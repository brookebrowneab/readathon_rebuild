import AdminPageLayout from '../components/layout/AdminPageLayout';
import Input from '../components/ui/input';
import Select from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import Badge from '../components/ui/badge';
import useAdminGuard from '../lib/useAdminGuard';

const users = [
  { id: '1', name: 'Jane Doe', email: 'jane@example.com', role: 'admin' },
  { id: '2', name: 'Sam Hill', email: 'sam@example.com', role: 'teacher' },
];

export default function AdminUsersPage() {
  const { loading } = useAdminGuard();

  if (loading) {
    return (
      <AdminPageLayout title="Users" subtitle="Manage roles and access.">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Users" subtitle="Manage roles and access.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Input placeholder="Search users" />
          <Select>
            <option>All roles</option>
            <option>Admin</option>
            <option>Teacher</option>
            <option>Parent</option>
          </Select>
        </div>

        <div className="bg-background p-2 hand-drawn">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-foreground">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
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
