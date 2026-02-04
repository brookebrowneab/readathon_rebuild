import { useState } from 'react';
import { Download, Upload, Plus, Save } from 'lucide-react';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import Button from '../../components/ui/button';
import FormField from '../../components/ui/form-field';
import Input from '../../components/ui/input';
import Switch from '../../components/ui/switch';
import useAdminGuard from '../../lib/useAdminGuard';
import logoSvg from '../../assets/logo.svg';

export default function AdminSettingsPage() {
  const { loading } = useAdminGuard();
  const [sendReminders, setSendReminders] = useState(true);

  if (loading) {
    return (
      <AdminPageLayout
        title="Settings"
        subtitle="Configure event details, payments, and logging."
        actions={<Button>Save Changes</Button>}
      >
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Event Settings"
      subtitle={
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Spring Read-a-thon 2026
          <span className="rounded-full border border-input px-2 py-0.5 text-xs">Upcoming</span>
        </span>
      }
      actions={
        <Button variant="secondary" className="gap-2">
          <Save className="h-4 w-4" />
          Saved
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="bg-background p-6 hand-drawn">
          <h3 className="text-sm font-semibold text-foreground">Event Details</h3>
          <div className="mt-4 space-y-4">
            <FormField label="Event Name" htmlFor="event-name" required>
              <Input id="event-name" defaultValue="Spring Read-a-thon 2026" />
            </FormField>
            <FormField label="School Name" htmlFor="school-name" required>
              <Input id="school-name" defaultValue="Janney Elementary" />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Start Date" htmlFor="start-date" required>
                <Input id="start-date" defaultValue="February 23rd, 2026" />
              </FormField>
              <FormField label="End Date" htmlFor="end-date" required>
                <Input id="end-date" defaultValue="March 8th, 2026" />
              </FormField>
            </div>
            <FormField label="Last Day to Log Reading" htmlFor="last-log-date" required>
              <Input id="last-log-date" defaultValue="March 11th, 2026" />
            </FormField>
            <FormField label="Default Reading Goal (minutes)" htmlFor="goal-minutes" required>
              <Input id="goal-minutes" type="number" defaultValue={500} />
            </FormField>
          </div>
        </div>

        <div className="bg-background p-6 hand-drawn">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Reading Log Verification</h3>
              <p className="text-xs text-muted-foreground">
                Require parent verification for long sessions
              </p>
              <p className="text-xs text-muted-foreground">
                When enabled, reading logs exceeding the threshold require parent approval
              </p>
            </div>
            <Switch checked={sendReminders} onClick={() => setSendReminders(!sendReminders)} />
          </div>
        </div>

        <div className="bg-background p-6 hand-drawn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Teachers & Staff</h3>
              <p className="text-xs text-muted-foreground">9 active teachers</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="gap-2">
                <Download className="h-4 w-4" />
                Template
              </Button>
              <Button variant="secondary" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload CSV
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Teacher
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {['Mr. Johnson', 'Mrs. Bailey', 'Mrs. Davis'].map((name) => (
              <div key={name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">teacher@school.edu</p>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="rounded-full border border-input px-2 py-0.5 text-xs">Pending Link</span>
                  <span className="h-4 w-4 rounded border border-muted" />
                  <span className="h-4 w-4 rounded border border-muted" />
                  <span className="h-4 w-4 rounded border border-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background p-6 hand-drawn">
          <h3 className="text-sm font-semibold text-foreground">Event Controls</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">End Event</p>
                <p className="text-xs text-muted-foreground">
                  Close the event and begin payment collection
                </p>
              </div>
              <Button variant="secondary">End Event</Button>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Create New Event</p>
                <p className="text-xs text-muted-foreground">
                  Start a new read-a-thon (will end current event)
                </p>
              </div>
              <Button variant="secondary">New Event</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-destructive">Delete Event</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete this event and all data
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 hand-drawn">
          <h3 className="text-sm font-semibold text-foreground">Logo Generator</h3>
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <img src={logoSvg} alt="Read-a-thon" className="h-20 w-auto" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Button variant="secondary">SVG</Button>
            <Button variant="secondary">PNG</Button>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
