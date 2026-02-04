import { Search, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/badge';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import useAdminGuard from '../../lib/useAdminGuard';

const logs = [
  {
    id: 'log-1',
    student: 'Emma Smith',
    grade: '3rd',
    className: 'Mrs. Lane',
    minutes: 45,
    date: '2026-02-02',
  },
  {
    id: 'log-2',
    student: 'Mason Lee',
    grade: '2nd',
    className: 'Mr. Patel',
    minutes: 520,
    date: '2026-02-01',
  },
];

export default function AdminReadingLogsPage() {
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
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-normal text-foreground md:text-4xl">Reading Logs</h1>
          <p className="text-sm text-muted-foreground">View and search all reading activity</p>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          {[
            { label: 'Total Logs', value: 4 },
            { label: 'Total Minutes', value: 115 },
            { label: 'Unique Students', value: 2 },
            { label: 'Avg. Minutes/Log', value: 29 },
            { label: 'Over 8 Hours', value: 0 },
            { label: '10+ Hrs/Day', value: 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-4 hand-drawn">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-xl font-serif">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr,140px,140px,140px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by student, book, or class..." />
          </div>
          <Select>
            <option>All Grades</option>
          </Select>
          <Select>
            <option>All Classes</option>
          </Select>
          <Select>
            <option>All Time</option>
          </Select>
        </div>

        <div className="bg-background p-2 hand-drawn">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.student}</p>
                        <p className="text-xs text-muted-foreground">{log.grade} Grade</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Charlotte's Web</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="inline-flex items-center gap-1">
                      {log.minutes}
                      {log.minutes > 480 && <AlertTriangle className="h-3 w-3" />}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.className}</TableCell>
                  <TableCell>{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
