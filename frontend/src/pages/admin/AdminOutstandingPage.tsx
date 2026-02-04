import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/button';
import Checkbox from '../../components/ui/checkbox';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';
import Badge from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import useAdminGuard from '../../lib/useAdminGuard';

const rows = [
  {
    id: 'pledge-1',
    sponsor: 'Uncle Bob',
    student: 'Emma Smith',
    amount: 50,
    pledgeType: 'Flat',
    days: 12,
  },
  {
    id: 'pledge-2',
    sponsor: 'Aunt Lee',
    student: 'Mason Lee',
    amount: 75,
    pledgeType: 'Per minute',
    days: 20,
  },
];

export default function AdminOutstandingPage() {
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
          <h1 className="font-serif text-3xl font-normal md:text-4xl">Outstanding Payments</h1>
          <p className="text-sm text-muted-foreground">Track pledges that need reminders.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Export</Button>
          <Button>Send Reminders</Button>
        </div>

        <div className="bg-background p-4 hand-drawn">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Search sponsors or students" />
            <Select>
              <option>All statuses</option>
              <option>Overdue</option>
              <option>No reminder sent</option>
              <option>Large pledges</option>
            </Select>
          </div>
        </div>

        <div className="bg-background p-2 hand-drawn">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
              </TableHead>
              <TableHead>Sponsor</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Days</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="text-foreground">{row.sponsor}</TableCell>
                <TableCell>{row.student}</TableCell>
                <TableCell>${row.amount}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.pledgeType}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-warning">{row.days} days</span>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
