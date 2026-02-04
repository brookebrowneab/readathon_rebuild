import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import FormField from '../../components/ui/form-field';
import SquareCardForm, { CardFormValues } from '../../components/payments/SquareCardForm';
import { handDrawnBorder } from '../../lib/admin-styles';
import { checkoutGuestPay, getGuestPay, GuestPaySummary } from '../../lib/api';

const initialCard: CardFormValues = {
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  zipCode: '',
};

export default function GuestPaymentPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [pledge, setPledge] = React.useState<GuestPaySummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [card, setCard] = React.useState<CardFormValues>(initialCard);
  const [guestName, setGuestName] = React.useState('');
  const [guestEmail, setGuestEmail] = React.useState('');
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setError('Missing payment token.');
      setLoading(false);
      return;
    }
    getGuestPay(token)
      .then((data) => setPledge(data))
      .catch((err) => setError(err?.message || 'Unable to load pledge.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handlePay = async () => {
    if (!token || !pledge) {
      return;
    }

    if (!guestName || !guestEmail) {
      setError('Please enter your name and email.');
      return;
    }

    setProcessing(true);
    try {
      const result = await checkoutGuestPay(token, {
        amount: pledge.amount,
        payerName: guestName,
        payerEmail: guestEmail,
        sourceId: 'guest-card',
        payment_method: 'card',
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        window.location.href = '/sponsor/thank-you';
      }
    } catch (err: any) {
      setError(err?.message || 'Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PublicLayout>
      <section className="bg-background-warm">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
              <h1 className="text-3xl font-serif">Guest Payment</h1>
              <p className="text-muted-foreground">Complete your pledge in a few simple steps.</p>
            </div>

            {loading && <p className="text-muted-foreground">Loading pledge...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {pledge && (
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                  <h2 className="text-xl font-serif">Pledge Summary</h2>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>Student: {pledge.student_name || 'Student'}</p>
                    <p>Amount: ${pledge.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                  <h2 className="text-xl font-serif">Payment Details</h2>
                  <div className="mt-4 space-y-4">
                    <FormField label="Your Name" htmlFor="guestName" required>
                      <Input
                        id="guestName"
                        value={guestName}
                        onChange={(event) => setGuestName(event.target.value)}
                        placeholder="Name"
                      />
                    </FormField>
                    <FormField label="Email" htmlFor="guestEmail" required>
                      <Input
                        id="guestEmail"
                        value={guestEmail}
                        onChange={(event) => setGuestEmail(event.target.value)}
                        placeholder="you@email.com"
                      />
                    </FormField>
                  </div>

                  <div className="mt-6">
                    <SquareCardForm value={card} onChange={setCard} />
                  </div>

                  <Button className="mt-6" loading={processing} onClick={handlePay}>
                    {processing ? 'Processing...' : `Pay $${pledge.amount.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
