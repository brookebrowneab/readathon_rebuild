import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  Mail,
  PenLine,
  Settings,
} from 'lucide-react';
import MainNav from './MainNav';
import Footer from './Footer';
import BottomTabBar from './BottomTabBar';

interface AdminPageLayoutProps {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminPageLayout({
  title,
  subtitle,
  actions,
  children,
}: AdminPageLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="border-b-2 border-foreground/20 bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {[
              { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
              { label: 'Reading', path: '/admin/reading', icon: BookOpen },
              { label: 'Users', path: '/admin-users', icon: Users },
              { label: 'Finance', path: '/admin-finance', icon: DollarSign },
              { label: 'Emails', path: '/admin/emails', icon: Mail },
              { label: 'Content', path: '/admin/content', icon: PenLine },
              { label: 'Settings', path: '/admin/settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={[
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-md',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    isActive ? 'hand-drawn-nav' : '',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      <main className="flex-1 bg-background-warm">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-12">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative inline-block">
              <h1 className="font-serif text-4xl font-normal leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                <span className="relative inline-block isolate">
                  <span className="relative z-10">{title}</span>
                  <span
                    className="absolute left-[-2%] right-[-2%] -z-0 -skew-y-1 -rotate-[0.5deg]"
                    style={{
                      top: '50%',
                      bottom: '0',
                      borderRadius: '4px 8px 4px 6px',
                      backgroundColor: 'hsl(var(--warning) / 0.45)',
                    }}
                    aria-hidden="true"
                  />
                </span>
              </h1>
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </div>
        <div className="h-20 md:hidden" />
      </main>
      <Footer />
      <BottomTabBar role="admin" />
    </div>
  );
}
