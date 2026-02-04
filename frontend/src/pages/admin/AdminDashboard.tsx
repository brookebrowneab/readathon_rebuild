import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  DollarSign,
  CreditCard,
  Mail,
  Download,
  Settings,
  ChevronDown,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useDropdownState,
} from '../../components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import {
  AdminActivity,
  AdminAlert,
  AdminMetrics,
  ActiveEvent,
  OutstandingPledge,
  getActiveEvent,
  getAdminActivity,
  getAdminAlerts,
  getAdminMetrics,
  getOutstandingPledges,
} from '../../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [activity, setActivity] = useState<AdminActivity[]>([]);
  const [outstanding, setOutstanding] = useState<OutstandingPledge[]>([]);
  const [event, setEvent] = useState<ActiveEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const menu = useDropdownState();

  useEffect(() => {
    const load = async () => {
      try {
        const [eventData, metricsData, alertsData, activityData, outstandingData] =
          await Promise.all([
            getActiveEvent(),
            getAdminMetrics(),
            getAdminAlerts(),
            getAdminActivity(),
            getOutstandingPledges(),
          ]);
        setEvent(eventData);
        setMetrics(metricsData);
        setAlerts(alertsData);
        setActivity(activityData);
        setOutstanding(outstandingData);
      } catch (err: any) {
        if (err?.code === 'FORBIDDEN' || err?.code === 'UNAUTHORIZED') {
          navigate('/admin/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="relative inline-block">
            <h1 className="relative font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
              <span className="relative">
                {event?.name || 'Spring Read-a-thon 2026'}
                <span
                  className="absolute inset-0 -z-10 -skew-y-1"
                  style={{
                    top: '50%',
                    height: '50%',
                    left: '-2%',
                    right: '-2%',
                    borderRadius: '4px 8px 4px 6px',
                    transform: 'rotate(-0.5deg)',
                    backgroundColor: 'hsl(var(--warning) / 0.45)',
                  }}
                  aria-hidden="true"
                />
              </span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{event?.name || 'Spring Read-a-thon 2026'}</span>
            <Badge variant="outline">Upcoming</Badge>
            <span>• 31 days remaining</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              label: 'Students',
              value: metrics?.studentsEnrolled ?? 5,
              icon: Users,
              note: '~ +1 this week',
              color: 'text-primary',
              bg: 'bg-primary/10',
            },
            {
              label: 'Minutes Read',
              value: metrics?.totalMinutes ?? 280,
              icon: Clock,
              note: '~ No logs today',
              color: 'text-accent',
              bg: 'bg-accent/20',
            },
            {
              label: 'Pledged',
              value: `$${metrics?.totalPledged ?? 88.5}`,
              icon: DollarSign,
              note: '~ No pledges today',
              color: 'text-foreground',
              bg: 'bg-muted',
            },
            {
              label: 'Collected',
              value: `$${metrics?.totalCollected ?? 0}`,
              icon: CreditCard,
              note: '0% collected',
              color: 'text-success',
              bg: 'bg-success/10',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-background p-4 hand-drawn">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-2xl text-foreground">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="mt-1 text-xs text-success">{card.note}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-lg text-foreground">Attention Needed</h2>
          <div
            className="flex items-center justify-between bg-background p-4 hand-drawn"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/outstanding')}
          >
            <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/20 text-warning-foreground">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {alerts[0]?.count ?? 9}
                </p>
                <p className="text-xs text-muted-foreground">pledges awaiting collection</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-lg text-foreground">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Mail className="h-4 w-4" />
              Send Payment Reminders
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary" onClick={menu.toggle} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent open={menu.open}>
                <DropdownMenuItem
                  onSelect={() => {
                    menu.close();
                    window.location.href = '/api/admin/reports/students?format=csv';
                  }}
                >
                  Students Report
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    menu.close();
                    window.location.href = '/api/admin/reports/pledges?format=csv';
                  }}
                >
                  Pledges Report
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    menu.close();
                    window.location.href = '/api/admin/reports/payments?format=csv';
                  }}
                >
                  Payments Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="secondary" onClick={() => navigate('/admin/settings')} className="gap-2">
              <Settings className="h-4 w-4" />
              Manage Event
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-background p-6 hand-drawn">
            <h3 className="text-lg font-serif">Recent Activity</h3>
            <div className="mt-4 space-y-3">
              {loading && <p className="text-sm text-muted-foreground">Loading activity...</p>}
              {!loading && activity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
              {activity.map((item, index) => (
                <div key={`${item.message}-${index}`} className="flex items-center justify-between text-sm">
                  <span>{item.message}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-background p-6 hand-drawn">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-serif">Outstanding Payments</h3>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/admin/outstanding')}
              >
                View All
              </button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstanding.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-foreground">{row.sponsor.name}</TableCell>
                    <TableCell>{row.student.id}</TableCell>
                    <TableCell>${row.amount}</TableCell>
                    <TableCell>12</TableCell>
                  </TableRow>
                ))}
                {outstanding.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4}>All payments collected!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>Send Payment Reminders</DialogTitle>
          <DialogDescription>
            This will send reminders to all selected outstanding pledges.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setDialogOpen(false)}>Send Reminders</Button>
        </DialogFooter>
      </Dialog>
    </AdminLayout>
  );
}
