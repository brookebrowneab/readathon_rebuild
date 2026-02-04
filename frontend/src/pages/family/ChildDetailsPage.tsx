import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainNav from '../../components/layout/MainNav';
import Footer from '../../components/layout/Footer';
import BottomTabBar from '../../components/layout/BottomTabBar';
import ReadingGoalRing from '../../components/legacy/ReadingGoalRing';
import ReadingLogsTable from '../../components/family/ReadingLogsTable';
import Button from '../../components/ui/button';
import { ChildSummary, listChildReadingLogs, listParentChildren, ParentReadingLogEntry, updateReadingLog, deleteReadingLog } from '../../lib/api';

export default function ChildDetailsPage() {
  const { id } = useParams();
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [logs, setLogs] = useState<ParentReadingLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const child = useMemo(() => children.find((entry) => entry.id === id) ?? null, [children, id]);

  const loadLogs = async (childId: string) => {
    const data = await listChildReadingLogs(childId);
    setLogs(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listParentChildren();
        setChildren(data);
        if (id) {
          await loadLogs(id);
        }
      } catch (err: any) {
        if (err?.code === 'UNAUTHORIZED') {
          setError('Parent session required.');
        } else {
          setError(err?.message ?? 'Unable to load child details.');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleEditLog = async (logId: string, minutes: number, title: string | null) => {
    await updateReadingLog(logId, { minutes, book_title: title });
    if (id) {
      await loadLogs(id);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    await deleteReadingLog(logId);
    if (id) {
      await loadLogs(id);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-warm">
      <MainNav />
      <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4 py-8">
          <Link to="/children" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Back to children
          </Link>

          {loading && <p className="mt-6 text-sm text-muted-foreground">Loading...</p>}
          {!loading && error && <p className="mt-6 text-sm text-destructive">{error}</p>}

          {!loading && !child && !error && (
            <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              Child not found.
            </div>
          )}

          {!loading && child && (
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy/10 text-sm font-semibold text-brand-navy">
                      {child.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-serif">{child.name}</h1>
                      <p className="text-sm text-muted-foreground">
                        {child.grade_info} · {child.class_name}
                      </p>
                    </div>
                    <Button variant="ghost" className="ml-auto">
                      Edit Profile
                    </Button>
                  </div>
                  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                    <ReadingGoalRing progress={child.total_minutes} goal={child.goal_minutes} size={160} />
                    <div className="grid gap-4 text-sm text-muted-foreground">
                      <div className="rounded-lg border border-border bg-background px-4 py-3">
                        Total Minutes: <span className="font-medium text-foreground">{child.total_minutes}</span>
                      </div>
                      <div className="rounded-lg border border-border bg-background px-4 py-3">
                        Goal Minutes: <span className="font-medium text-foreground">{child.goal_minutes}</span>
                      </div>
                      <div className="rounded-lg border border-border bg-background px-4 py-3">
                        Logs Verified: <span className="font-medium text-foreground">0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-serif">Reading Logs</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input type="checkbox" />
                      <span>Select All</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ReadingLogsTable
                      logs={logs}
                      childName={child.name}
                      onEdit={handleEditLog}
                      onDelete={handleDeleteLog}
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="secondary">Validate Selected</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-serif">Pledges</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No pledges yet. Invite sponsors to support {child.name}.
                  </p>
                  <Button className="mt-4" variant="secondary">
                    Invite Sponsors
                  </Button>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-serif">Quick Actions</h3>
                  <div className="mt-4 flex flex-col gap-2">
                    <Button>Log Reading</Button>
                    <Button variant="ghost">Invite Sponsors</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="h-20 md:hidden" />
      </main>
      <Footer />
      <BottomTabBar role="parent" />
    </div>
  );
}
