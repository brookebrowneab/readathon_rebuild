import { Plus, Clock } from 'lucide-react';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import Button from '../../components/ui/button';
import useAdminGuard from '../../lib/useAdminGuard';

export default function AdminEmailPage() {
  const { loading } = useAdminGuard();

  if (loading) {
    return (
      <AdminPageLayout title="Emails" subtitle="Manage templates and recent sends.">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Email Templates"
      subtitle="Create, schedule, and send emails to sponsors, parents, and teachers"
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 rounded-lg bg-muted/60 p-2 text-sm">
          {['All Templates', 'Drafts', 'Scheduled', 'Sent', 'Email Logs'].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={[
                'rounded-md px-3 py-1.5',
                index === 0 ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
              ].join(' ')}
            >
              {tab === 'Email Logs' ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tab}
                </span>
              ) : (
                tab
              )}
            </button>
          ))}
        </div>

        <div className="bg-background p-6 hand-drawn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Test Template</h3>
              <p className="text-xs text-muted-foreground">Hello, {{sponsor_name}}</p>
              <p className="text-xs text-muted-foreground">Sent January 23rd, 2026</p>
            </div>
            <div className="flex gap-3 text-muted-foreground">
              <span className="h-4 w-4 rounded border border-muted" />
              <span className="h-4 w-4 rounded border border-muted" />
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
