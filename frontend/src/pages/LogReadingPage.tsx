import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MainNav from '../components/layout/MainNav';
import Footer from '../components/layout/Footer';
import BottomTabBar from '../components/layout/BottomTabBar';
import FormField from '../components/ui/form-field';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import BookSelector from '../components/books/BookSelector';
import ReadingGoalRing from '../components/legacy/ReadingGoalRing';
import {
  ChildSummary,
  createParentReadingLog,
  listChildReadingLogs,
  listParentChildren,
  ParentReadingLogEntry,
  updateReadingLog,
  deleteReadingLog,
} from '../lib/api';

export default function LogReadingPage() {
  const [searchParams] = useSearchParams();
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [logs, setLogs] = useState<ParentReadingLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [minutes, setMinutes] = useState(15);
  const [bookTitle, setBookTitle] = useState('');
  const [loggedAt, setLoggedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId) ?? null,
    [children, selectedChildId]
  );

  const loadChildren = async () => {
    try {
      const data = await listParentChildren();
      setChildren(data);
      if (!selectedChildId) {
        const childParam = searchParams.get('child');
        const initialId =
          childParam && data.find((child) => child.id === childParam) ? childParam : data[0]?.id;
        setSelectedChildId(initialId ?? null);
      }
    } catch (err: any) {
      if (err?.code === 'UNAUTHORIZED') {
        setError('Parent session required.');
      } else {
        setError(err?.message ?? 'Unable to load children.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async (childId: string) => {
    try {
      const data = await listChildReadingLogs(childId);
      setLogs(data);
    } catch (err: any) {
      setError(err?.message ?? 'Unable to load reading history.');
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      loadLogs(selectedChildId);
    }
  }, [selectedChildId]);

  const resetForm = () => {
    setMinutes(15);
    setBookTitle('');
    setLoggedAt(new Date().toISOString().slice(0, 10));
    setNotes('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!selectedChildId) {
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      if (editingId) {
        await updateReadingLog(editingId, {
          minutes,
          book_title: bookTitle || null,
          logged_at: loggedAt,
        });
      } else {
        await createParentReadingLog({
          child_id: selectedChildId,
          minutes,
          book_title: bookTitle || null,
          logged_at: loggedAt,
        });
      }
      await loadLogs(selectedChildId);
      await loadChildren();
      resetForm();
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Could not log reading.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditLog = (log: ParentReadingLogEntry) => {
    setEditingId(log.id);
    setMinutes(log.minutes);
    setBookTitle(log.book_title ?? '');
    setLoggedAt(log.logged_at);
  };

  const handleDeleteLog = async (id: string) => {
    if (!selectedChildId) {
      return;
    }
    if (!window.confirm('Delete this log?')) {
      return;
    }
    await deleteReadingLog(id);
    await loadLogs(selectedChildId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-warm">
      <MainNav />
      <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <Link to="/dashboard" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Back to dashboard
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-foreground md:text-4xl">Log Reading</h1>
              <p className="text-sm text-muted-foreground">
                Track minutes read for your children.
              </p>
            </div>
          </div>

          {loading && <p className="mt-8 text-sm text-muted-foreground">Loading...</p>}
          {!loading && error && <p className="mt-6 text-sm text-destructive">{error}</p>}

          {!loading && children.length === 0 && (
            <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No children added yet.
            </div>
          )}

          {!loading && children.length > 0 && (
            <>
              {children.length > 1 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setSelectedChildId(child.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        selectedChildId === child.id
                          ? 'border-brand-navy bg-brand-navy/10 text-brand-navy'
                          : 'border-border text-muted-foreground hover:border-brand-navy'
                      }`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )}

              {selectedChild && (
                <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Child</p>
                      <h2 className="text-2xl font-serif">{selectedChild.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedChild.grade_info} · {selectedChild.class_name}
                      </p>
                    </div>
                    <ReadingGoalRing
                      progress={selectedChild.total_minutes}
                      goal={selectedChild.goal_minutes}
                      size={160}
                      mobileSize={140}
                    />
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-6 rounded-2xl border border-success/30 bg-success/10 p-4 text-success">
                  Reading logged successfully!
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="grid gap-6">
                  <FormField label="Date" htmlFor="loggedAt">
                    <Input
                      id="loggedAt"
                      type="date"
                      value={loggedAt}
                      onChange={(event) => setLoggedAt(event.target.value)}
                    />
                  </FormField>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Minutes</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setMinutes((prev) => Math.max(0, prev - 5))}
                        >
                          -
                        </Button>
                        <span className="text-lg font-serif">{minutes}</span>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setMinutes((prev) => prev + 5)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[15, 30, 45, 60].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMinutes(preset)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                            minutes === preset
                              ? 'border-brand-navy bg-brand-navy/10 text-brand-navy'
                              : 'border-border text-muted-foreground hover:border-brand-navy'
                          }`}
                        >
                          {preset} min
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Book Title</label>
                    <div className="mt-3">
                      <BookSelector value={bookTitle} onChange={setBookTitle} books={[]} />
                    </div>
                  </div>

                  <FormField label="Notes (optional)" htmlFor="notes">
                    <textarea
                      id="notes"
                      className="w-full rounded-md border border-text-tertiary bg-background px-4 py-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={notes}
                      maxLength={500}
                      rows={3}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </FormField>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleSubmit} loading={saving}>
                      {editingId ? 'Save Changes' : 'Log Reading'}
                    </Button>
                    {editingId && (
                      <Button variant="ghost" onClick={resetForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                <button
                  type="button"
                  onClick={() => setHistoryOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h3 className="text-lg font-serif">Reading History</h3>
                  <span className="text-sm text-muted-foreground">{historyOpen ? 'Hide' : 'Show'}</span>
                </button>
                {historyOpen && (
                  <div className="mt-4 space-y-3">
                    {logs.length === 0 && (
                      <p className="text-sm text-muted-foreground">No reading logged yet.</p>
                    )}
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3"
                      >
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {log.minutes} minutes · {log.logged_at}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.book_title ?? 'No book title'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditLog(log)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDeleteLog(log.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="h-20 md:hidden" />
      </main>
      <Footer />
      <BottomTabBar role="parent" />
    </div>
  );
}
