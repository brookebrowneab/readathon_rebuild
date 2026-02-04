import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import MobileMinutesStepper from '../../components/mobile/MobileMinutesStepper';
import BookSelector from '../../components/books/BookSelector';
import Button from '../../components/ui/button';
import {
  createStudentReadingLog,
  getStudentMe,
  listStudentReadingLogs,
  ReadingLogEntry,
  StudentSummary,
} from '../../lib/api';

export default function StudentLogReadingPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentSummary | null>(null);
  const [logs, setLogs] = useState<ReadingLogEntry[]>([]);
  const [minutes, setMinutes] = useState(15);
  const [bookTitle, setBookTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await getStudentMe();
        setStudent(me);
        const entries = await listStudentReadingLogs();
        setLogs(entries);
      } catch (err: any) {
        if (err?.code === 'UNAUTHORIZED') {
          navigate('/student/login');
          return;
        }
        setError(err?.message ?? 'Unable to load student data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await createStudentReadingLog({
        minutes,
        book_title: bookTitle || null,
        logged_at: new Date().toISOString(),
      });
      const updated = await listStudentReadingLogs();
      setLogs(updated);
    } catch (err: any) {
      if (err?.code === 'UNAUTHORIZED') {
        navigate('/student/login');
        return;
      }
      setError(err?.message ?? 'Could not log reading.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-yellow/20 to-background-warm">
      <PageHeader
        rightContent={
          student ? (
            <div className="text-sm text-muted-foreground">Hi, {student.name}</div>
          ) : null
        }
      />

      <main className="mx-auto max-w-lg space-y-6 px-4 pb-8 md:mt-[15px] lg:mt-0">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!loading && student && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Your progress</p>
            <p className="text-2xl font-serif">
              {student.total_minutes} / {student.goal_minutes} minutes
            </p>
          </div>
        )}

        <MobileMinutesStepper value={minutes} onChange={setMinutes} />

        <BookSelector value={bookTitle} onChange={setBookTitle} books={[]} />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="h-[72px] w-full text-base" onClick={handleSubmit} loading={saving}>
          Log Reading
        </Button>

        <div className="space-y-2">
          <h2 className="text-lg font-serif">Recent Logs</h2>
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground">No reading logged yet.</p>
          )}
          {logs.map((log) => (
            <div key={log.id} className="rounded-md border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{log.minutes} minutes</span>
                <span className="text-xs text-muted-foreground">{log.logged_at}</span>
              </div>
              {log.book_title && <p className="text-sm">{log.book_title}</p>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
