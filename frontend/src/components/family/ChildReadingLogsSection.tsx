import { useEffect, useState } from 'react';
import { listChildReadingLogs, ParentReadingLogEntry, updateReadingLog, deleteReadingLog } from '../../lib/api';
import ReadingLogsTable from './ReadingLogsTable';

interface ChildReadingLogsSectionProps {
  childId: string;
  childName: string;
}

export default function ChildReadingLogsSection({ childId, childName }: ChildReadingLogsSectionProps) {
  const [logs, setLogs] = useState<ParentReadingLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const entries = await listChildReadingLogs(childId);
      setLogs(entries);
    } catch (err: any) {
      setError(err?.message ?? 'Unable to load logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [childId]);

  const handleEdit = async (id: string, minutes: number, title: string | null) => {
    await updateReadingLog(id, { minutes, book_title: title });
    await loadLogs();
  };

  const handleDelete = async (id: string) => {
    await deleteReadingLog(id);
    await loadLogs();
  };

  return (
    <div className="border-t border-border bg-muted/20 p-6">
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading logs...</div>
      ) : (
        <>
          <h4 className="font-serif text-lg">Reading Logs</h4>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="mt-4">
            <ReadingLogsTable logs={logs} childName={childName} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </>
      )}
    </div>
  );
}
