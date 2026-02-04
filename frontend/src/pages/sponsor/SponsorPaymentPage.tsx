import React from 'react';
import MainNav from '../../components/layout/MainNav';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/button';
import SquareCardForm, { CardFormValues } from '../../components/payments/SquareCardForm';
import FormField from '../../components/ui/form-field';
import Input from '../../components/ui/input';
import { handDrawnBorder } from '../../lib/admin-styles';
import { listUnpaidPledges, notifyCheckPayment, processSquarePayment, PledgeSummary } from '../../lib/api';

const initialCard: CardFormValues = {
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  zipCode: '',
};

export default function SponsorPaymentPage() {
  const [pledges, setPledges] = React.useState<PledgeSummary[]>([]);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [method, setMethod] = React.useState<'card' | 'check'>('card');
  const [card, setCard] = React.useState<CardFormValues>(initialCard);
  const [payerEmail, setPayerEmail] = React.useState(
    () => window.localStorage.getItem('sponsor_email') || ''
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    listUnpaidPledges()
      .then((data) => {
        setPledges(data);
        const init: Record<string, boolean> = {};
        data.forEach((pledge) => {
          init[pledge.id] = true;
        });
        setSelected(init);
      })
      .catch((err) => setError(err?.message || 'Unable to load pledges.'))
      .finally(() => setLoading(false));
  }, []);

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);
  const total = pledges
    .filter((pledge) => selectedIds.includes(pledge.id))
    .reduce((sum, pledge) => sum + pledge.amount, 0);

  const handlePayment = async () => {
    if (selectedIds.length === 0) {
      setError('Select at least one pledge to pay.');
      return;
    }
    if (!payerEmail.trim()) {
      setError('Please enter an email for the receipt.');
      return;
    }

    setError(null);
    setProcessing(true);
    try {
      if (method === 'card') {
        await processSquarePayment({
          amount: total,
          pledgeIds: selectedIds,
          payerName: card.cardName || 'Sponsor',
          payerEmail: payerEmail || 'sponsor@example.com',
          sourceId: 'card-nonce-test',
        });
      } else {
        await notifyCheckPayment({
          amount: total,
          pledgeIds: selectedIds,
          payerName: card.cardName || 'Sponsor',
          payerEmail,
        });
      }
      window.location.href = '/sponsor/thank-you';
    } catch (err: any) {
      setError(err?.message || 'Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (payerEmail) {
      window.localStorage.setItem('sponsor_email', payerEmail);
    }
  }, [payerEmail]);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                <h1 className="text-3xl font-serif">Make a Payment</h1>
                <p className="text-muted-foreground">Select the pledges you want to pay today.</p>
                <div className="mt-4 space-y-3">
                  {loading && <p className="text-muted-foreground">Loading pledges...</p>}
                  {!loading && pledges.length === 0 && (
                    <p className="text-muted-foreground">No unpaid pledges yet.</p>
                  )}
                  {pledges.map((pledge) => (
                    <label
                      key={pledge.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div>
                        <p className="font-medium">{pledge.child?.name || 'Student'}</p>
                        <p className="text-xs text-muted-foreground">{pledge.pledge_type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">${pledge.amount}</span>
                        <input
                          type="checkbox"
                          checked={selected[pledge.id] || false}
                          onChange={(event) =>
                            setSelected((prev) => ({ ...prev, [pledge.id]: event.target.checked }))
                          }
                          className="h-4 w-4 accent-primary"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                <h2 className="text-xl font-serif">Payment Summary</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <p>Pledges selected: {selectedIds.length}</p>
                  <p className="font-semibold">Total due: ${total.toFixed(2)}</p>
                </div>
                <div className="mt-4">
                  <FormField label="Email for Receipt" htmlFor="payerEmail" required>
                    <Input
                      id="payerEmail"
                      type="email"
                      value={payerEmail}
                      onChange={(event) => setPayerEmail(event.target.value)}
                      placeholder="you@email.com"
                    />
                  </FormField>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {['card', 'check'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMethod(option as 'card' | 'check')}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                        method === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background'
                      }`}
                    >
                      {option === 'card' ? 'Card' : 'Check'}
                    </button>
                  ))}
                </div>
              </div>

              {method === 'card' && (
                <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                  <h2 className="text-xl font-serif">Card Details</h2>
                  <div className="mt-4">
                    <SquareCardForm value={card} onChange={setCard} />
                  </div>
                </div>
              )}

              {method === 'check' && (
                <div className="rounded-xl bg-white p-6 shadow-sm text-sm" style={handDrawnBorder}>
                  <h2 className="text-xl font-serif">Check Instructions</h2>
                  <p className="mt-2 text-muted-foreground">
                    Make checks payable to the school PTA and include the student name in the memo line.
                  </p>
                  <p className="mt-2 font-medium">Mail to: 123 School St, City, ST 00000</p>
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button size="lg" loading={processing} onClick={handlePayment}>
                {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
