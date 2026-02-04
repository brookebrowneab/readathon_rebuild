# Square Payment Flow

**Source Documents**: 07_payments_square.md, 03_user_flows.md

## End-to-End Payment Flows

### Flow A: Traditional End-of-Event Payment

### 1. Payment Initiation (Browser)

#### User Interface Setup
```javascript
// Vue component loads Square Web Payments SDK
import { payments } from '@square/web-payments-sdk';

const paymentsClient = await payments(
    applicationId,  // From backend config
    locationId      // From backend config
);

const card = await paymentsClient.card();
await card.attach('#card-container');
```

#### Card Tokenization
```javascript
// User enters card details
const result = await card.tokenize();
if (result.status === 'OK') {
    const nonce = result.token;  // Single-use token
    
    // Send to backend with pledge selection
    await submitPayment({
        nonce: nonce,
        pledgeIds: selectedPledgeIds,
        idempotencyKey: generateIdempotencyKey(),
        verificationToken: buyerVerificationToken  // SCA/3DS
    });
}
```

### 2. Server-Side Processing (Laravel)

#### Payment Controller
```php
public function process(Request $request)
{
    $validated = $request->validate([
        'nonce' => 'required|string',
        'pledge_ids' => 'required|array',
        'pledge_ids.*' => 'exists:pledges,id',
        'idempotency_key' => 'required|uuid',
        'verification_token' => 'nullable|string'
    ]);
    
    // Check idempotency - prevent double charges
    $existingPayment = Payment::where('idempotency_key', $validated['idempotency_key'])->first();
    if ($existingPayment) {
        return response()->json([
            'payment' => $existingPayment,
            'duplicate' => true
        ]);
    }
    
    // Lock pledges to prevent concurrent modifications
    $pledges = Pledge::whereIn('id', $validated['pledge_ids'])
        ->lockForUpdate()
        ->get();
    
    // Verify all pledges are unpaid and collectable
    $collectablePledges = collect();
    $skippedPledges = collect();
    
    foreach ($pledges as $pledge) {
        if ($pledge->payment_status !== 'pending') {
            throw new ValidationException('Pledge already paid');
        }
        if ($pledge->sponsor_parent_profile_id !== auth()->user()->parentProfile->id) {
            throw new ForbiddenException('Not your pledge');
        }
        
        // Check if pledge meets collection minimum
        if ($pledge->collection_status === 'under_minimum') {
            // Skip collection but mark as processed
            $skippedPledges->push($pledge);
        } else {
            $collectablePledges->push($pledge);
        }
    }
    
    // Calculate total for collectable pledges only
    $totalAmount = $collectablePledges->sum('calculated_total');
    
    // Handle skipped pledges (under minimum)
    foreach ($skippedPledges as $pledge) {
        $pledge->update(['payment_status' => 'skipped_under_minimum']);
    }
    
    // If no collectable pledges, return early
    if ($collectablePledges->isEmpty()) {
        return response()->json([
            'success' => true,
            'message' => 'All pledges were under collection minimum',
            'skipped_count' => $skippedPledges->count()
        ]);
    }
    
    // Create Square payment with collectable pledges only
    $payment = $this->squareService->createPayment(
        $validated['nonce'],
        $totalAmount,
        $validated['idempotency_key'],
        $collectablePledges,
        $validated['verification_token']
    );
    
    return response()->json(['payment' => $payment]);
}
```

#### Square Service
```php
class SquarePaymentService
{
    private SquareClient $client;
    
    public function createPayment($nonce, $amount, $idempotencyKey, $pledges, $verificationToken = null)
    {
        DB::beginTransaction();
        
        try {
            // Create local payment record first
            $payment = Payment::create([
                'parent_profile_id' => auth()->user()->parentProfile->id,
                'amount' => $amount,
                'status' => 'pending',
                'idempotency_key' => $idempotencyKey,
                'initiated_at' => now()
            ]);
            
            // Create payment items
            foreach ($pledges as $pledge) {
                PaymentItem::create([
                    'payment_id' => $payment->id,
                    'pledge_id' => $pledge->id,
                    'amount' => $pledge->calculated_total,
                    'description' => "Pledge for {$pledge->child->display_name}"
                ]);
            }
            
            // Build Square request
            $money = new Money();
            $money->setAmount($amount * 100); // Convert to cents
            $money->setCurrency('USD');
            
            $createPaymentRequest = new CreatePaymentRequest($nonce, $idempotencyKey);
            $createPaymentRequest->setAmountMoney($money);
            $createPaymentRequest->setLocationId(config('square.location_id'));
            $createPaymentRequest->setReferenceId($payment->id);
            
            // Add buyer verification for SCA/3DS if provided
            if ($verificationToken) {
                $createPaymentRequest->setVerificationToken($verificationToken);
            }
            
            // Add metadata
            $createPaymentRequest->setNote(json_encode([
                'pledge_ids' => $pledges->pluck('id'),
                'event_id' => $pledges->first()->event_id
            ]));
            
            // Execute payment
            $response = $this->client->getPaymentsApi()->createPayment($createPaymentRequest);
            
            if ($response->isSuccess()) {
                $squarePayment = $response->getResult()->getPayment();
                
                // Update local payment record
                $payment->update([
                    'square_payment_id' => $squarePayment->getId(),
                    'square_order_id' => $squarePayment->getOrderId(),
                    'status' => strtolower($squarePayment->getStatus()),
                    'receipt_url' => $squarePayment->getReceiptUrl(),
                    'completed_at' => now()
                ]);
                
                // Update pledge statuses
                $pledges->each->update(['payment_status' => 'paid']);
                
                DB::commit();
                
                // Queue receipt email
                SendPaymentReceiptJob::dispatch($payment);
                
                return $payment;
                
            } else {
                throw new PaymentException($response->getErrors()[0]->getDetail());
            }
            
        } catch (\Exception $e) {
            DB::rollback();
            
            // Log failure
            Log::error('Payment failed', [
                'error' => $e->getMessage(),
                'idempotency_key' => $idempotencyKey,
                'user_id' => auth()->id()
            ]);
            
            throw $e;
        }
    }
}
```

### Flow B: Immediate Sponsor Payment

#### Sponsor Immediate Payment Flow
```php
// Route: POST /sponsor/{child_id}/pledge/immediate
class PledgeController
{
    public function storeWithPayment(Request $request, ChildProfile $child)
    {
        $validated = $request->validate([
            'type' => 'required|in:flat',  // Only flat pledges for immediate payment
            'amount' => 'required|numeric|min:1',  // Must be $1 or more
            'anonymous' => 'boolean',
            'payment_nonce' => 'required|string',
            'idempotency_key' => 'required|uuid'
        ]);
        
        // Verify child allows public sponsoring or valid invitation
        if (!$child->allow_public_sponsoring && !$this->hasValidInvitation($request, $child)) {
            throw new ForbiddenException('Child not available for sponsoring');
        }
        
        DB::beginTransaction();
        try {
            // Create sponsor account if needed (guest sponsor flow)
            $sponsorProfile = $this->getOrCreateSponsorProfile($request);
            
            // Create pledge with immediate payment timing
            $pledge = app(CreatePledgeWithImmediatePayment::class)->execute(
                child_profile_id: $child->id,
                sponsor_parent_profile_id: $sponsorProfile->id,
                event_id: $child->activeEnrollment->event_id,
                amount: $validated['amount'],
                payment_nonce: $validated['payment_nonce'],
                anonymous: $validated['anonymous'] ?? false,
                idempotency_key: $validated['idempotency_key']
            );
            
            DB::commit();
            
            // Redirect to receipt page
            return Inertia::render('Pledges/ImmediatePayment', [
                'pledge' => $pledge,
                'payment' => $pledge->payments->first(),
                'child' => $child->only(['first_name', 'last_initial']),
                'receipt_url' => $pledge->payments->first()->receipt_url
            ]);
            
        } catch (PaymentException $e) {
            DB::rollback();
            
            // Payment failed but pledge exists
            return back()->withErrors(['payment' => $e->getMessage()]);
        }
    }
    
    private function getOrCreateSponsorProfile(Request $request): ParentProfile
    {
        // If authenticated, use existing profile
        if (auth()->check()) {
            return auth()->user()->parentProfile;
        }
        
        // Guest sponsor flow - collect minimal info
        $sponsorData = $request->validate([
            'sponsor_email' => 'required|email',
            'sponsor_first_name' => 'required|string|max:50',
            'sponsor_last_name' => 'required|string|max:50'
        ]);
        
        // Find or create user account
        $user = User::firstOrCreate(
            ['email' => $sponsorData['sponsor_email']],
            ['password_hash' => null]  // Guest account, no password
        );
        
        // Create parent profile if needed
        return ParentProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => $sponsorData['sponsor_first_name'],
                'last_name' => $sponsorData['sponsor_last_name'],
                'household_id' => Str::uuid()
            ]
        );
    }
}
```

#### Immediate Payment Service Implementation
```php
class CreatePledgeWithImmediatePayment
{
    public function execute(
        string $child_profile_id,
        string $sponsor_parent_profile_id, 
        string $event_id,
        float $amount,
        string $payment_nonce,
        bool $anonymous,
        string $idempotency_key
    ): Pledge {
        
        // Validate business rules
        if ($amount < 1.00) {
            throw new ValidationException('Immediate payments require minimum $1.00');
        }
        
        // Check for existing payment with same idempotency key
        $existingPayment = Payment::where('idempotency_key', $idempotency_key)->first();
        if ($existingPayment) {
            return $existingPayment->pledges->first();
        }
        
        DB::beginTransaction();
        try {
            // Create pledge with immediate timing
            $pledge = Pledge::create([
                'child_profile_id' => $child_profile_id,
                'sponsor_parent_profile_id' => $sponsor_parent_profile_id,
                'event_id' => $event_id,
                'type' => 'flat',
                'amount' => $amount,
                'calculated_total' => $amount,  // Known immediately for flat pledges
                'payment_timing' => 'immediate',
                'payment_status' => 'pending',
                'collection_status' => 'collectable',
                'anonymous' => $anonymous
            ]);
            
            // Create and process payment immediately
            $payment = $this->processSquarePayment(
                sponsor_profile_id: $sponsor_parent_profile_id,
                pledge_ids: [$pledge->id],
                payment_nonce: $payment_nonce,
                idempotency_key: $idempotency_key
            );
            
            // Update pledge status based on payment result
            if ($payment->status === 'completed') {
                $pledge->update(['payment_status' => 'paid']);
            }
            
            DB::commit();
            
            // Send confirmation emails
            $this->sendImmediatePaymentConfirmation($pledge, $payment);
            
            return $pledge;
            
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }
    
    private function processSquarePayment(
        string $sponsor_profile_id,
        array $pledge_ids,
        string $payment_nonce,
        string $idempotency_key
    ): Payment {
        // Use existing Square payment processing logic
        return app(InitiateSquarePayment::class)->execute(
            parent_profile_id: $sponsor_profile_id,
            pledge_ids: $pledge_ids,
            payment_nonce: $payment_nonce,
            idempotency_key: $idempotency_key
        );
    }
}
```

### 3. Webhook Verification and Reconciliation

#### Webhook Controller
```php
class SquareWebhookController
{
    public function handle(Request $request)
    {
        // Verify webhook signature
        $signature = $request->header('X-Square-Signature');
        $body = $request->getContent();
        
        if (!$this->verifyWebhookSignature($body, $signature)) {
            Log::warning('Invalid webhook signature');
            return response('Unauthorized', 401);
        }
        
        $payload = json_decode($body, true);
        
        // Check if we've already processed this event (idempotency)
        $existingEvent = WebhookEvent::where('square_event_id', $payload['event_id'])->first();
        if ($existingEvent) {
            return response('Already processed', 200);
        }
        
        // Store raw webhook
        $webhookEvent = WebhookEvent::create([
            'square_event_id' => $payload['event_id'],
            'event_type' => $payload['type'],
            'payload' => $payload,
            'signature' => $signature
        ]);
        
        // Process based on event type
        ProcessSquareWebhookJob::dispatch($webhookEvent);
        
        return response('Accepted', 200);
    }
    
    private function verifyWebhookSignature($body, $signature)
    {
        $webhookSignatureKey = config('square.webhook_signature_key');
        $url = config('app.url') . '/webhooks/square';
        
        $hash = base64_encode(
            hash_hmac(
                'sha256',
                $url . $body,
                $webhookSignatureKey,
                true
            )
        );
        
        return $hash === $signature;
    }
}
```

#### Webhook Processing Job
```php
class ProcessSquareWebhookJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable;
    
    public function handle(WebhookEvent $webhookEvent)
    {
        $payload = $webhookEvent->payload;
        
        switch ($payload['type']) {
            case 'payment.created':
            case 'payment.updated':
                $this->handlePaymentUpdate($payload['data']['object']['payment']);
                break;
                
            case 'refund.created':
            case 'refund.updated':
                $this->handleRefund($payload['data']['object']['refund']);
                break;
                
            default:
                Log::info('Unhandled webhook type', ['type' => $payload['type']]);
        }
        
        $webhookEvent->update(['processed_at' => now()]);
    }
    
    private function handlePaymentUpdate($squarePayment)
    {
        $payment = Payment::where('square_payment_id', $squarePayment['id'])->first();
        
        if (!$payment) {
            // Payment initiated outside our system
            Log::warning('Payment not found for webhook', ['square_id' => $squarePayment['id']]);
            return;
        }
        
        DB::transaction(function () use ($payment, $squarePayment) {
            $oldStatus = $payment->status;
            $newStatus = strtolower($squarePayment['status']);
            
            // Update payment status
            $payment->update([
                'status' => $newStatus,
                'square_receipt_url' => $squarePayment['receipt_url'] ?? null,
                'updated_at' => now()
            ]);
            
            // Update pledge statuses based on payment status
            if ($newStatus === 'completed' && $oldStatus !== 'completed') {
                $payment->paymentItems->each(function ($item) {
                    $item->pledge->update(['payment_status' => 'paid']);
                });
                
                // Send confirmation email
                SendPaymentConfirmationJob::dispatch($payment);
                
            } elseif ($newStatus === 'failed' || $newStatus === 'canceled') {
                $payment->paymentItems->each(function ($item) {
                    $item->pledge->update(['payment_status' => 'pending']);
                });
                
                // Notify user of failure
                SendPaymentFailureNotificationJob::dispatch($payment);
            }
            
            // Log status change
            AuditLog::create([
                'action' => 'payment_status_changed',
                'entity_type' => 'Payment',
                'entity_id' => $payment->id,
                'old_values' => ['status' => $oldStatus],
                'new_values' => ['status' => $newStatus]
            ]);
        });
    }
}
```

### 4. Payment Status State Machine

```
┌─────────┐
│ pending │ ← Initial state when payment created
└────┬────┘
     │
     ├────────────────┬─────────────────┬──────────────┐
     ↓                ↓                 ↓              ↓
┌────────────┐  ┌──────────┐    ┌──────────┐   ┌──────────┐
│ completed  │  │  failed  │    │ canceled │   │ refunded │
└────────────┘  └──────────┘    └──────────┘   └──────────┘
     │                                                 ↑
     └─────────────────────────────────────────────────┘
                    (refund can happen later)
```

#### State Transition Rules
- `pending → completed`: Payment successful
- `pending → failed`: Payment declined or error
- `pending → canceled`: User or system canceled
- `completed → refunded`: Admin processes refund
- No backwards transitions except refunds

### 5. Preventing Double Charges

#### Client-Side Prevention
```javascript
// Disable submit button immediately
const submitButton = ref(null);
const processing = ref(false);

async function submitPayment() {
    if (processing.value) return;  // Prevent double-click
    
    processing.value = true;
    submitButton.value.disabled = true;
    
    try {
        // Generate unique key client-side
        const idempotencyKey = crypto.randomUUID();
        
        // Store in session storage to detect page refresh
        sessionStorage.setItem('lastPaymentKey', idempotencyKey);
        
        await processPayment(idempotencyKey);
    } finally {
        processing.value = false;
        submitButton.value.disabled = false;
    }
}
```

#### Server-Side Prevention
1. **Idempotency Keys**: Required UUID for each payment
2. **Database Constraint**: Unique index on idempotency_key
3. **Pledge Locking**: Pessimistic locking during payment
4. **Status Checks**: Verify pledges are still unpaid
5. **Square's Idempotency**: Square API also respects idempotency

```php
// Database migration
Schema::table('payments', function (Blueprint $table) {
    $table->unique('idempotency_key');
    $table->unique('square_payment_id');
    $table->index(['parent_profile_id', 'status']);
});

// Pledge locking during payment
DB::transaction(function () {
    $pledges = Pledge::whereIn('id', $pledgeIds)
        ->lockForUpdate()  // Prevent concurrent access
        ->get();
        
    // Check all still unpaid
    if ($pledges->where('payment_status', '!=', 'pending')->isNotEmpty()) {
        throw new ValidationException('One or more pledges already paid');
    }
    
    // Process payment...
});
```

### 6. Webhook Security Requirements

#### Configuration
```php
// config/square.php
return [
    'application_id' => env('SQUARE_APPLICATION_ID'),
    'access_token' => env('SQUARE_ACCESS_TOKEN'),
    'location_id' => env('SQUARE_LOCATION_ID'),
    'environment' => env('SQUARE_ENVIRONMENT', 'production'),
    'webhook_signature_key' => env('SQUARE_WEBHOOK_SIGNATURE_KEY'),
];
```

#### Security Measures
1. **HTTPS Only**: Webhook endpoint must use HTTPS
2. **Signature Verification**: HMAC-SHA256 signature check
3. **IP Allowlisting**: Optional Square IP range restriction
4. **Rate Limiting**: Prevent webhook flooding
5. **Timeout Handling**: Return 200 quickly, process async
6. **Retry Logic**: Handle Square's retry attempts
7. **Event Ordering**: Process events by timestamp

### 7. Error Recovery

#### Payment Failures
```php
// Automatic retry for transient failures
class RetryFailedPaymentsJob implements ShouldQueue
{
    public function handle()
    {
        $failedPayments = Payment::where('status', 'failed')
            ->where('created_at', '>', now()->subHours(24))
            ->get();
            
        foreach ($failedPayments as $payment) {
            // Check if pledges still unpaid
            if ($payment->paymentItems->every(fn($item) => $item->pledge->payment_status === 'pending')) {
                // Notify user to retry
                SendPaymentRetryNotificationJob::dispatch($payment);
            }
        }
    }
}
```

#### Webhook Failures
```php
// Reconciliation job runs hourly
class ReconcileSquarePaymentsJob implements ShouldQueue
{
    public function handle()
    {
        // Find payments in pending state > 10 minutes old
        $pendingPayments = Payment::where('status', 'pending')
            ->where('created_at', '<', now()->subMinutes(10))
            ->get();
            
        foreach ($pendingPayments as $payment) {
            // Query Square API directly
            $squarePayment = $this->squareService->getPayment($payment->square_payment_id);
            
            if ($squarePayment) {
                // Update local status
                $payment->update(['status' => $squarePayment->getStatus()]);
                
                // Process as if webhook received
                ProcessSquareWebhookJob::dispatch($payment);
            }
        }
    }
}
```

### 8. Testing Considerations

#### Test Card Numbers
```php
// Square Sandbox test cards
const TEST_CARDS = [
    'visa' => '4111 1111 1111 1111',
    'mastercard' => '5105 1051 0510 5100',
    'amex' => '3400 0000 0000 009',
    'decline' => '4000 0000 0000 0002',
    'sca_required' => '4800 0000 0000 0004'
];
```

#### Test Scenarios
1. Successful payment
2. Declined card
3. SCA/3DS verification required
4. Webhook delivery failure
5. Duplicate payment attempt
6. Concurrent payment attempts
7. Refund processing
8. Network timeout during payment