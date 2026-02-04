import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainNav from '../../components/layout/MainNav';
import Footer from '../../components/layout/Footer';
import BottomTabBar from '../../components/layout/BottomTabBar';
import ReadingGoalRing from '../../components/legacy/ReadingGoalRing';
import ChildReadingLogsSection from '../../components/family/ChildReadingLogsSection';
import Button from '../../components/ui/button';
import { ChildSummary, listParentChildren } from '../../lib/api';

export default function ManageChildrenPage() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listParentChildren();
        setChildren(data);
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
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background-warm">
      <MainNav />
      <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4 py-8">
          <Link to="/dashboard" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Back to dashboard
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-serif md:text-4xl">My Children</h1>
              <p className="text-sm text-muted-foreground">View and manage enrolled students.</p>
            </div>
            <Button variant="secondary" className="w-fit">
              Add Child
            </Button>
          </div>

          {loading && <p className="mt-6 text-sm text-muted-foreground">Loading...</p>}
          {!loading && error && <p className="mt-6 text-sm text-destructive">{error}</p>}

          {!loading && children.length === 0 && (
            <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No children added yet.
            </div>
          )}

          <div className="mt-8 space-y-6">
            {children.map((child) => {
              const expanded = expandedId === child.id;
              return (
                <div key={child.id} className="rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy/10 text-sm font-semibold text-brand-navy">
                        {child.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h2 className="text-lg font-serif">{child.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {child.grade_info} · {child.class_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <ReadingGoalRing
                        progress={child.total_minutes}
                        goal={child.goal_minutes}
                        size={110}
                        mobileSize={90}
                        showLabel={false}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="secondary">
                          Invite Sponsors
                        </Button>
                        <Button size="sm" variant="ghost">
                          Edit Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpandedId(expanded ? null : child.id)}
                        >
                          {expanded ? 'Hide Logs' : 'View Logs'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {expanded && <ChildReadingLogsSection childId={child.id} childName={child.name} />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-20 md:hidden" />
      </main>
      <Footer />
      <BottomTabBar role="parent" />
    </div>
  );
}
