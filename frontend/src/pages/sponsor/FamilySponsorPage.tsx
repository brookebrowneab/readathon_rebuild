import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import FormField from '../../components/ui/form-field';
import { handDrawnBorder } from '../../lib/admin-styles';
import {
  createPledges,
  listPublicChildrenByFamily,
  PublicChild,
} from '../../lib/api';

const pledgeOptions = [
  { label: 'Per Minute', value: 'per_minute' },
  { label: 'Flat Amount', value: 'flat' },
];

export default function FamilySponsorPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [children, setChildren] = React.useState<PublicChild[]>([]);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [pledgeType, setPledgeType] = React.useState('flat');
  const [amount, setAmount] = React.useState('25');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) {
      setError('Missing family link.');
      setLoading(false);
      return;
    }

    listPublicChildrenByFamily(userId)
      .then((data) => {
        setChildren(data);
        const init: Record<string, boolean> = {};
        data.forEach((child) => {
          init[child.id] = true;
        });
        setSelected(init);
      })
      .catch((err) => setError(err?.message || 'Unable to load family.'))
      .finally(() => setLoading(false));
  }, [userId]);

  const toggleAll = (value: boolean) => {
    const next: Record<string, boolean> = {};
    children.forEach((child) => {
      next[child.id] = value;
    });
    setSelected(next);
  };

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      setError('Select at least one student.');
      return;
    }
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError('Enter a valid amount.');
      return;
    }

    setError(null);
    await createPledges(
      selectedIds.map((id) => ({
        child_id: id,
        amount: numeric,
        pledge_type: pledgeType,
      }))
    );
    navigate('/sponsor/pledged');
  };

  return (
    <PublicLayout>
      <section className="bg-background-warm">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
            <div className="space-y-3">
              <h1 className="text-3xl font-serif">Support This Family</h1>
              <p className="text-muted-foreground">
                Choose the students you want to sponsor and set your pledge amount.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-serif">Students</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => toggleAll(true)}>
                      Select All
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleAll(false)}>
                      Deselect
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {loading && <p className="text-muted-foreground">Loading...</p>}
                  {!loading && children.length === 0 && (
                    <p className="text-muted-foreground">No shareable students found.</p>
                  )}
                  {children.map((child) => (
                    <label
                      key={child.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div>
                        <p className="font-medium">{child.display_name}</p>
                        <p className="text-xs text-muted-foreground">Grade {child.grade_info}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selected[child.id] || false}
                        onChange={(event) =>
                          setSelected((prev) => ({ ...prev, [child.id]: event.target.checked }))
                        }
                        className="h-4 w-4 accent-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                <h2 className="text-xl font-serif">Your Pledge</h2>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {pledgeOptions.map((option) => (
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
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm" style={handDrawnBorder}>
                <h2 className="text-xl font-serif">Summary</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <p>Students selected: {selectedIds.length}</p>
                  <p>Amount per pledge: ${amount || '0'}</p>
                  <p className="font-semibold">Total: ${(Number(amount) || 0) * selectedIds.length}</p>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button size="lg" onClick={handleSubmit}>
                Create Pledges
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
