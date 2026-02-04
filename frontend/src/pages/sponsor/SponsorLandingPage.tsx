import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import FormField from '../../components/ui/form-field';
import { handDrawnBorder } from '../../lib/admin-styles';
import { createPledges, getPublicChild, PublicChild } from '../../lib/api';

export default function SponsorLandingPage() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = React.useState<PublicChild | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pledgeType, setPledgeType] = React.useState('flat');
  const [amount, setAmount] = React.useState('25');

  React.useEffect(() => {
    if (!childId) {
      setError('Missing child link.');
      setLoading(false);
      return;
    }
    getPublicChild(childId)
      .then((data) => setChild(data))
      .catch((err) => setError(err?.message || 'Unable to load student.'))
      .finally(() => setLoading(false));
  }, [childId]);

  const handleSubmit = async () => {
    if (!child) {
      return;
    }
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    await createPledges([
      {
        child_id: child.id,
        amount: numeric,
        pledge_type: pledgeType,
      },
    ]);
    navigate('/sponsor/pledged');
  };

  return (
    <PublicLayout>
      <section className="bg-background-warm">
        <div className="mx-auto max-w-5xl px-4 py-10">
          {loading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {child && (
            <div className="space-y-8">
              <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                <h1 className="text-3xl font-serif">Sponsor {child.display_name}</h1>
                <p className="text-muted-foreground">Help reach the reading goal this season.</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="rounded-full bg-background px-4 py-2">
                    Grade {child.grade_info}
                  </div>
                  <div className="rounded-full bg-background px-4 py-2">
                    {child.total_minutes} minutes logged
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                <h2 className="text-xl font-serif">Your Pledge</h2>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Per Minute', value: 'per_minute' },
                      { label: 'Flat Amount', value: 'flat' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPledgeType(option.value)}
                        className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                          pledgeType === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <FormField label="Amount" htmlFor="amount" required>
                    <Input
                      id="amount"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      inputMode="decimal"
                      placeholder="25"
                    />
                  </FormField>
                  <Button size="lg" onClick={handleSubmit}>
                    Submit Pledge
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
