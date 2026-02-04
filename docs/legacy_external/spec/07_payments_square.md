# Square Payment Integration

## Overview

The system integrates with Square API v25.1.0 for payment processing, customer management, and receipt generation. Payment functionality is contained in the `/square-payment/` directory.

## Square Configuration

### Environment Variables
Located in `/square-payment/.env`:
- `SQUARE_ACCESS_TOKEN`: API authentication token
- `ENVIRONMENT`: 'production' or 'sandbox'
- `SQUARE_LOCATION_ID`: Business location identifier
- `SQUARE_APPLICATION_SECRET`: Application secret key
- `SQUARE_APPLICATION_ID`: Application identifier

### SDK Initialization
```php
$client = new SquareClient([
    'accessToken' => $token,
    'environment' => 'production'
]);
```

## Payment Flow Architecture

### 1. Pre-Payment Preparation (`payment.php`)

#### Pledge Aggregation
- Retrieves unpaid pledges for logged-in sponsor
- Separates pledges into two categories:
  - **Payable now**: One-time pledges and per-minute pledges after cutoff date
  - **Display only**: Per-minute pledges before cutoff (still accumulating)

#### Line Item Structure
```php
$line_item = array(
    'pledgeId' => unique_identifier,
    'studentName' => 'First Last',
    'payType' => 'one-time' | 'by-the-minute',
    'amount' => decimal_amount,
    'minutes' => total_minutes (if per-minute),
    'total_item_money' => amount_in_cents
);
```

### 2. Customer Management

#### Customer Lookup/Creation
1. Check if customer exists by email
2. If exists: Retrieve customer ID
3. If new: Create customer record
```php
$customer = new CreateCustomerRequest();
$customer->setGivenName($firstName);
$customer->setFamilyName($lastName);
$customer->setEmailAddress($email);
```

### 3. Payment Processing

#### Card Tokenization
- Card details tokenized client-side
- Token passed to server via POST
- No raw card data stored

#### Order Creation
```php
$order = new Order($location_id);
$order->setCustomerId($customerId);

// For each selected pledge
$line_item = new OrderLineItem($quantity);
$line_item->setName($item_name);
$line_item->setBasePriceMoney($money);
$line_item->setNote($pledgeId); // Stores pledge ID for tracking
```

#### Payment Execution
```php
$payment_request = new CreatePaymentRequest(
    $_POST['token'],
    Uuid::uuid4(),
    $money
);
$payment_request->setOrderId($order_id);
$payment_request->setCustomerId($customer_id);
```

### 4. Post-Payment Processing

#### Database Updates
1. Update `pledges` table:
   - Set `paid` field to amount in cents
   - Store `payment_id` from Square
   - Store `order_id` from Square

2. Create `payments` record:
   - `sponsor_id`: Sponsor username
   - `payment_id`: Square payment ID
   - `order_id`: Square order ID
   - `pledgeId_json`: JSON array of paid pledge IDs
   - `customerId`: Square customer ID
   - `paid_amt`: Total amount
   - `paid_date`: Transaction timestamp
   - `pymt_status`: Payment status
   - `receipt_link`: Square receipt URL

#### Receipt Generation
- Square automatically generates receipt
- Receipt URL stored in database
- Email receipt sent via Square's system

## Payment Features

### Supported Payment Methods
- Credit cards (via Square Web Payments SDK)
- Debit cards
- Card tokenization for security

### Payment Amounts
- **One-time pledges**: Fixed dollar amount
- **Per-minute pledges**: Rate × total reading minutes
- All amounts converted to cents for processing

### Batch Processing
- Multiple pledges can be paid in single transaction
- Each pledge becomes a line item in Square order
- Pledge IDs preserved for reconciliation

## Error Handling

### API Errors
```php
try {
    $response = $payments_api->createPayment($payment_request);
} catch (ApiException $e) {
    // Log error
    // Display user-friendly message
    // Rollback any partial updates
}
```

### Validation Errors
- Missing required fields
- Invalid token
- Insufficient funds
- Card declined

### Network Errors
- Timeout handling
- Retry logic for transient failures
- Transaction rollback on failure

## Security Measures

### PCI Compliance
- No card data stored locally
- Square handles PCI compliance
- Tokenization for all card transactions

### Data Protection
- HTTPS required for payment pages
- Session validation before payment
- Sponsor can only pay own pledges

## Payment Reconciliation

### Tracking Mechanisms
1. **Pledge Level**: Individual pledge payment status
2. **Order Level**: Square order groups multiple pledges
3. **Payment Level**: Single payment covers entire order

### Reconciliation Tools
- Admin can view all payments
- Payment reports via stored procedures
- Square dashboard for detailed transaction history

## Integration Points

### Square APIs Used
1. **Customers API**: Customer management
2. **Orders API**: Order creation and management
3. **Payments API**: Payment processing
4. **Checkout API**: Payment links (prepared but not fully implemented)

### Local Database Integration
- Pledge status updates
- Payment record creation
- Receipt link storage
- Customer ID mapping

## Payment States

### Pledge Payment States
1. **Unpaid** (`paid = 0`): No payment received
2. **Partial** (`paid < total`): Partial payment (rare)
3. **Paid** (`paid = total`): Fully paid
4. **Overpaid** (`paid > total`): Overpayment (edge case)

### Square Payment States
- `COMPLETED`: Payment successful
- `PENDING`: Payment processing
- `FAILED`: Payment failed
- `CANCELED`: Payment canceled

## Limitations and Constraints

### Current Limitations
1. No refund processing through UI (admin manual process)
2. No recurring payments
3. No saved payment methods
4. No payment plans or installments
5. Single currency (USD) only

### Transaction Limits
- Minimum payment: $1.00 (Square requirement)
- Maximum determined by Square account settings
- No partial pledge payments supported

## Payment Page Files

### Core Payment Files
- `payment.php`: Main payment form and processing
- `payment-close.php`: Post-payment confirmation
- `payment-close2.php`: Alternative confirmation flow
- `batchretrieveorders.php`: Bulk order retrieval

### Supporting Files
- `.env`: Square credentials (git-ignored)
- `composer.json`: Square SDK dependencies

## Testing Considerations

### Test Environment
- Sandbox environment available
- Test cards provided by Square
- Separate test credentials in `.env`

### Test Scenarios
1. Successful payment
2. Declined card
3. Network timeout
4. Multiple pledge payment
5. Zero-dollar pledge handling
6. Customer creation vs existing

## Audit Trail

### Payment Tracking
- All payments logged in `payments` table
- Square provides transaction history
- Email receipts for verification
- Admin reporting capabilities

### Reconciliation Points
1. Daily payment reports
2. Pledge status verification
3. Square dashboard comparison
4. Email receipt matching