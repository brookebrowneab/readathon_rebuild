import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNav from '../../components/layout/MainNav';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';
import ReadingGoalRing from '../../components/ui/reading-goal-ring';
import Badge from '../../components/ui/badge';
import {
  createTeacherReadingLog,
  getTeacherUsername,
  listTeacherStudents,
  TeacherStudent,
} from '../../lib/api';

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export default function TeacherLogReading() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedBulk, setSelectedBulk] = useState<Record<string, boolean>>({});
  const [minutes, setMinutes] = useState(20);
  const [bookTitle, setBookTitle] = useState('');
  const [loggedAt, setLoggedAt] = useState<'today' | 'yesterday'>('today');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const teacherUsername = getTeacherUsername();

  useEffect(() => {
    const load = async () => {
      if (!teacherUsername) {
        navigate('/teacher/login');
        return;
      }

      try {
        const roster = await listTeacherStudents(teacherUsername);
        setStudents(roster);
        if (roster.length > 0) {
          setSelectedStudent(roster[0].id);
        }
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load roster.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teacherUsername]);

  const selectedBulkIds = useMemo(
    () => Object.keys(selectedBulk).filter((id) => selectedBulk[id]),
    [selectedBulk]
  );

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    const logDate = new Date();
    if (loggedAt === 'yesterday') {
      logDate.setDate(logDate.getDate() - 1);
    }

    try {
      const targets = bulkMode ? selectedBulkIds : selectedStudent ? [selectedStudent] : [];
      if (targets.length === 0) {
        setError('Select at least one student.');
        return;
      }

      await Promise.all(
        targets.map((childId) =>
          createTeacherReadingLog({
            child_id: childId,
            minutes,
            book_title: bookTitle || null,
            logged_at: logDate.toISOString(),
          })
        )
      );
      setSuccess(`Logged reading for ${targets.length} student${targets.length === 1 ? '' : 's'}.`);
      setBookTitle('');
      setMinutes(20);
      setSelectedBulk({});
    } catch (err: any) {
      setError(err?.message ?? 'Unable to log reading.');
    } finally {
      setSaving(false);
    }
  };

  const activeStudent = students.find((student) => student.id === selectedStudent);

  return (
    <div className="flex min-h-screen flex-col bg-background-warm">
      <MainNav
        rightContent={
          <nav className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span>Dashboard</span>
            <span className="text-foreground">Log Reading</span>
          </nav>
        }
      />
      <main className="container flex-1 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-normal tracking-tight">Log Reading</h1>
            <p className="text-sm text-muted-foreground">Record minutes for your roster.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/teacher')}>
            Back to Dashboard
          </Button>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading roster...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div>
                <p className="text-sm text-muted-foreground">Logging Mode</p>
                <h2 className="text-lg font-semibold">
                  {bulkMode ? 'Bulk Log' : 'Single Student'}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Single</span>
                <button
                  type="button"
                  className={`relative h-6 w-11 rounded-full transition ${
                    bulkMode ? 'bg-accent' : 'bg-muted'
                  }`}
                  onClick={() => setBulkMode((prev) => !prev)}
                >
                  <span
                    className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background transition ${
                      bulkMode ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
                <span className="text-xs text-muted-foreground">Bulk</span>
              </div>
            </div>

            {!bulkMode && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Student</p>
                    <Select
                      value={selectedStudent}
                      onChange={(event) => setSelectedStudent(event.target.value)}
                      options={students.map((student) => ({
                        label: `${student.name} (${student.grade_info})`,
                        value: student.id,
                      }))}
                      className="mt-2"
                    />
                  </div>
                  {activeStudent && (
                    <ReadingGoalRing
                      current={activeStudent.total_minutes}
                      goal={activeStudent.goal_minutes}
                      size={60}
                    />
                  )}
                </div>
                {activeStudent && (
                  <Badge variant="info">
                    {activeStudent.total_minutes} / {activeStudent.goal_minutes} minutes
                  </Badge>
                )}
              </div>
            )}

            {bulkMode && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Select students</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const next: Record<string, boolean> = {};
                        students.forEach((student) => {
                          next[student.id] = true;
                        });
                        setSelectedBulk(next);
                      }}
                    >
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedBulk({})}>
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {students.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedBulk[student.id]}
                        onChange={(event) =>
                          setSelectedBulk((prev) => ({
                            ...prev,
                            [student.id]: event.target.checked,
                          }))
                        }
                      />
                      <span>
                        {student.name} · {student.grade_info}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon />
                <span>Date</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={loggedAt === 'today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoggedAt('today')}
                >
                  Today
                </Button>
                <Button
                  variant={loggedAt === 'yesterday' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoggedAt('yesterday')}
                >
                  Yesterday
                </Button>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground">Minutes</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMinutes((prev) => Math.max(prev - 5, 5))}
                  >
                    -
                  </Button>
                  <div className="w-20">
                    <Input
                      value={minutes}
                      onChange={(event) => setMinutes(Number(event.target.value) || 0)}
                      type="number"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setMinutes((prev) => prev + 5)}>
                    +
                  </Button>
                  {[15, 20, 30, 45].map((value) => (
                    <Button
                      key={value}
                      variant="ghost"
                      size="sm"
                      onClick={() => setMinutes(value)}
                    >
                      {value} min
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground">Activity Note (optional)</p>
                <textarea
                  value={bookTitle}
                  onChange={(event) => setBookTitle(event.target.value)}
                  placeholder="Classroom read-aloud, silent reading..."
                  className="mt-2 h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {success && <p className="text-sm text-success">{success}</p>}

            <Button className="h-12 w-full text-base" onClick={handleSubmit} loading={saving}>
              Log Reading
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
