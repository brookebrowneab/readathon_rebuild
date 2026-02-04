import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Badge from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import useAdminGuard from '../../lib/useAdminGuard';

const rows = [
  { id: 'check-1', sponsor: 'Jordan Green', student: 'Emma Smith', amount: 40, date: '2026-01-29', status: 'pending' },
  { id: 'check-2', sponsor: 'Lily Hart', student: 'Mason Lee', amount: 65, date: '2026-01-24', status: 'received' },
];

const statusVariant: Record<string, 'warning' | 'success' | 'secondary'> = {
  pending: 'warning',
  received: 'success',
  bounced: 'secondary',
};

export default function AdminChecksPage() {
  const { loading } = useAdminGuard();

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-normal md:text-4xl">Checks</h1>
          <p className="text-sm text-muted-foreground">Track check pledges and incoming mail.</p>
        </div>

        <Button variant="secondary">Export Report</Button>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Pending', value: 12 },
            { label: 'Received', value: 38 },
            { label: 'Bounced', value: 2 },
          ].map((card) => (
            <div key={card.label} className="bg-background p-4 hand-drawn">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-serif">{card.value}</p>
            </div>
          ))}
        </div>

        <Input placeholder="Search sponsors or students" />

        <div className="bg-background p-2 hand-drawn">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sponsor</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-foreground">{row.sponsor}</TableCell>
                <TableCell>{row.student}</TableCell>
                <TableCell>${row.amount}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      Received
                    </Button>
                    <Button size="sm" variant="ghost">
                      Email
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-background p-6 hand-drawn">
          <h3 className="text-lg font-serif">Mailing Instructions</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Checks can be mailed to: 123 Library Lane, Reading City, ST 00000
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
