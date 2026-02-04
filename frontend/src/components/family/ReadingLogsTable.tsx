import { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';

export interface ReadingLogRow {
  id: string;
  minutes: number;
  book_title: string | null;
  logged_at: string;
}

interface ReadingLogsTableProps {
  logs: ReadingLogRow[];
  childName: string;
  onEdit: (id: string, minutes: number, title: string | null) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function ReadingLogsTable({
  logs,
  childName,
  onEdit,
  onDelete,
}: ReadingLogsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [minutes, setMinutes] = useState('');
  const [title, setTitle] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const startEdit = (log: ReadingLogRow) => {
    setEditingId(log.id);
    setMinutes(String(log.minutes));
    setTitle(log.book_title ?? '');
  };

  const handleSave = async () => {
    if (!editingId) {
      return;
    }
    const parsed = Number(minutes);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return;
    }
    setBusyId(editingId);
    await onEdit(editingId, parsed, title.trim() === '' ? null : title.trim());
    setBusyId(null);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Delete this log?');
    if (!ok) {
      return;
    }
    setBusyId(id);
    await onDelete(id);
    setBusyId(null);
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-6 py-8 text-center">
        <div className="text-sm text-muted-foreground">No reading logged yet for {childName}.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Minutes</th>
            <th className="px-4 py-3">Book Title</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="px-4 py-3 text-sm text-muted-foreground">{log.logged_at}</td>
              {editingId === log.id ? (
                <>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min={1}
                      value={minutes}
                      onChange={(event) => setMinutes(event.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Book title"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleSave} loading={busyId === log.id}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground">
                      {log.minutes} min
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.book_title ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(log)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(log.id)}
                        loading={busyId === log.id}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
