import { Download, Plus } from 'lucide-react';
import AdminPageLayout from '../components/layout/AdminPageLayout';
import Badge from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import useAdminGuard from '../lib/useAdminGuard';
import Button from '../components/ui/button';

export default function AdminFinancePage() {
  const { loading } = useAdminGuard();

  if (loading) {
    return (
      <AdminPageLayout title="Finance" subtitle="Track pledges and payments.">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Financial Management"
      subtitle="Track payments, pledges, and generate reports"
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" />
            Manual Payment
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { label: 'Total Pledged', value: '$88.50', note: 'From all sponsors' },
            { label: 'Total Collected', value: '$0.00', note: 'Payments received' },
            { label: 'Outstanding', value: '$88.50', note: 'Awaiting payment' },
            { label: 'Collection Rate', value: '0%', note: '' },
            { label: 'Large Pledges', value: '0', note: '> $1,500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-4 hand-drawn">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-xl font-serif">{stat.value}</p>
              {stat.note && <p className="text-xs text-muted-foreground">{stat.note}</p>}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 rounded-lg bg-muted/60 p-2 text-sm">
          {['All Pledges', 'Guest Pledges', 'Payments', 'Outstanding'].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={[
                'rounded-md px-3 py-1.5',
                index === 0 ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
              ].join(' ')}
            >
              {tab} <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">9</span>
            </button>
          ))}
        </div>

        <div className="bg-background p-6 hand-drawn">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-serif">All Pledges</h3>
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>All Pledges</option>
            </select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Sponsor</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: '1',
                  date: 'Feb 3, 2026',
                  sponsor: 'Test Sponsor',
                  student: 'Lucas Demo',
                  type: 'Per Minute',
                  amount: '$2.25',
                  detail: '(45 min)',
                  status: 'Pending',
                },
                {
                  id: '2',
                  date: 'Feb 3, 2026',
                  sponsor: 'Test Sponsor',
                  student: 'Emma Test',
                  type: 'Per Minute',
                  amount: '$3.50',
                  detail: '(70 min)',
                  status: 'Pending',
                },
              ].map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="text-foreground">
                    <div>{row.sponsor}</div>
                    <div className="text-xs text-muted-foreground">brookebrown@gmail.com</div>
                  </TableCell>
                  <TableCell>{row.student}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>{row.amount}</div>
                    <div className="text-xs text-muted-foreground">{row.detail}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-5 rounded-full border border-muted" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminPageLayout>
  );
}
