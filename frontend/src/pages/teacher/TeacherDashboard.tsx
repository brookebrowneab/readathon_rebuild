import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNav from '../../components/layout/MainNav';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';
import StatCard from '../../components/ui/stat-card';
import Badge from '../../components/ui/badge';
import Tooltip from '../../components/ui/tooltip';
import ReadingGoalRing from '../../components/ui/reading-goal-ring';
import {
  ActiveEvent,
  getActiveEvent,
  getTeacherProfile,
  getTeacherUsername,
  listTeacherReadingLogs,
  listTeacherStudents,
  logout,
  TeacherProfile,
  TeacherStudent,
} from '../../lib/api';
import { clearTeacherUsername } from '../../lib/teacherSession';

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
      <path d="M6 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h2" />
      <path d="M14 21v-1a5 5 0 0 1 5-5h3" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5.5V19a2.5 2.5 0 0 1 2.5-2.5H20" />
      <path d="M20 5.5V19a2.5 2.5 0 0 0-2.5-2.5H4" />
      <path d="M4 5.5h10a2.5 2.5 0 0 1 2.5 2.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" />
    </svg>
  );
}

type Status = 'goal-reached' | 'on-track' | 'needs-encouragement' | 'not-started';

function getStatus(student: TeacherStudent): Status {
  if (student.total_minutes <= 0) {
    return 'not-started';
  }
  if (student.goal_minutes > 0 && student.total_minutes >= student.goal_minutes) {
    return 'goal-reached';
  }
  if (student.goal_minutes > 0 && student.total_minutes / student.goal_minutes >= 0.5) {
    return 'on-track';
  }
  return 'needs-encouragement';
}

function statusLabel(status: Status) {
  switch (status) {
    case 'goal-reached':
      return 'Goal Reached';
    case 'on-track':
      return 'On Track';
    case 'needs-encouragement':
      return 'Needs Encouragement';
    default:
      return 'Not Started';
  }
}

function statusVariant(status: Status) {
  switch (status) {
    case 'goal-reached':
      return 'success';
    case 'on-track':
      return 'info';
    case 'needs-encouragement':
      return 'warning';
    default:
      return 'neutral';
  }
}

function formatDate(value: string | null) {
  if (!value) return 'No activity yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [event, setEvent] = useState<ActiveEvent | null>(null);
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [lastActive, setLastActive] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState('all');

  const teacherUsername = getTeacherUsername();

  useEffect(() => {
    const load = async () => {
      if (!teacherUsername) {
        navigate('/teacher/login');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [profile, roster, activeEvent] = await Promise.all([
          getTeacherProfile(teacherUsername),
          listTeacherStudents(teacherUsername),
          getActiveEvent().catch(() => null),
        ]);
        setTeacher(profile);
        setStudents(roster);
        setEvent(activeEvent as ActiveEvent | null);

        const ids = roster.map((student) => student.id);
        if (ids.length > 0) {
          const logs = await listTeacherReadingLogs(ids);
          const activityMap: Record<string, string> = {};
          logs.forEach((log) => {
            if (!log.child_id) return;
            if (!activityMap[log.child_id]) {
              activityMap[log.child_id] = log.logged_at;
            }
          });
          setLastActive(activityMap);
        }
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load teacher dashboard.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teacherUsername]);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const participating = students.filter((student) => student.total_minutes > 0).length;
    const totalMinutes = students.reduce((sum, student) => sum + student.total_minutes, 0);
    const avgMinutes = totalStudents > 0 ? Math.round(totalMinutes / totalStudents) : 0;
    return { totalStudents, participating, totalMinutes, avgMinutes };
  }, [students]);

  const filtered = useMemo(() => {
    let result = students.filter((student) =>
      student.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    if (statusFilter !== 'all') {
      result = result.filter((student) => getStatus(student) === statusFilter);
    }

    if (sortBy === 'progress') {
      result = [...result].sort(
        (a, b) => b.total_minutes / Math.max(b.goal_minutes, 1) - a.total_minutes / Math.max(a.goal_minutes, 1)
      );
    } else if (sortBy === 'last-active') {
      result = [...result].sort((a, b) => {
        const aDate = lastActive[a.id] ? new Date(lastActive[a.id]).getTime() : 0;
        const bDate = lastActive[b.id] ? new Date(lastActive[b.id]).getTime() : 0;
        return bDate - aDate;
      });
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [students, search, statusFilter, sortBy, lastActive]);

  const daysRemaining = useMemo(() => {
    if (!event?.end_date) return null;
    const endDate = new Date(event.end_date);
    const diff = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [event]);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav
        rightContent={
          <nav className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-foreground">Dashboard</span>
            <span>Account</span>
          </nav>
        }
      />
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-brand-navy">
                {teacher?.name ? `${teacher.name}'s Dashboard` : 'Teacher Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {teacher?.teacher_type ? teacher.teacher_type : 'Homeroom Teacher'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout().catch(() => null);
                clearTeacherUsername();
                navigate('/teacher/login');
              }}
            >
              Sign Out
            </Button>
          </div>

          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {!loading && !error && (
            <>
              {event && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2 text-muted-foreground">
                      <CalendarIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {daysRemaining !== null ? `${daysRemaining} days remaining` : 'Event in progress'} ·{' '}
                        {stats.participating} of {stats.totalStudents} students participating
                      </p>
                    </div>
                  </div>
                  <Badge variant="neutral" className="bg-muted text-foreground">
                    Active
                  </Badge>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard value={stats.totalStudents} label="Students" icon={<UsersIcon />} />
                <StatCard value={stats.participating} label="Participating" icon={<UsersIcon />} />
                <StatCard value={stats.totalMinutes} label="Total Minutes" icon={<BookIcon />} />
                <StatCard value={stats.avgMinutes} label="Avg per Student" icon={<AwardIcon />} />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <SearchIcon />
                  </span>
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search students..."
                    className="h-10 pl-9 text-sm"
                  />
                </div>
                <div className="min-w-[160px]">
                  <Select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    options={[
                      { label: 'Name', value: 'name' },
                      { label: 'Progress', value: 'progress' },
                      { label: 'Last Active', value: 'last-active' },
                    ]}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="min-w-[160px]">
                  <Select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    options={[
                      { label: 'All Status', value: 'all' },
                      { label: 'Goal Reached', value: 'goal-reached' },
                      { label: 'On Track', value: 'on-track' },
                      { label: 'Needs Encouragement', value: 'needs-encouragement' },
                      { label: 'Not Started', value: 'not-started' },
                    ]}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="h-10 bg-muted text-sm text-foreground hover:bg-muted/80"
                    onClick={() => navigate('/teacher/log')}
                  >
                    Log Reading
                  </Button>
                  <Tooltip content="Exporting is coming soon">
                    <Button variant="outline" className="h-10 text-sm" disabled>
                      Export
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.length === 0 && (
                  <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                    No students match your filters.
                  </div>
                )}
                {filtered.map((student) => {
                  const status = getStatus(student);
                  const percent = student.goal_minutes
                    ? Math.round((student.total_minutes / student.goal_minutes) * 100)
                    : 0;
                  return (
                    <div
                      key={student.id}
                      className="hand-drawn-border bg-card p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-2">
                          <ReadingGoalRing
                            current={student.total_minutes}
                            goal={student.goal_minutes}
                            size={56}
                          />
                          <div className="text-lg font-semibold text-foreground">{percent}%</div>
                          <div className="text-xs text-muted-foreground">
                            {student.total_minutes}/{student.goal_minutes} min
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-base font-semibold text-foreground">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {student.total_minutes} / {student.goal_minutes} min
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last: {formatDate(lastActive[student.id] ?? null)}
                          </p>
                          <Badge
                            variant={statusVariant(status)}
                            className={status === 'needs-encouragement' ? 'bg-warning/20 text-warning' : ''}
                          >
                            {statusLabel(status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
