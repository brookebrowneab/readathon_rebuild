import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  DollarSign,
  FileText,
  Mail,
  PenLine,
  Settings,
} from 'lucide-react';
import MainNav from './MainNav';
import Footer from './Footer';
import BottomTabBar from './BottomTabBar';
import booksShelfDivider from '../../assets/books-shelf-divider.png';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Reading', path: '/admin/reading', icon: BookOpen },
  { label: 'Finance', path: '/admin-finance', icon: DollarSign },
  { label: 'Outstanding', path: '/admin/outstanding', icon: DollarSign },
  { label: 'Checks', path: '/admin/checks', icon: FileText },
  { label: 'Emails', path: '/admin/emails', icon: Mail },
  { label: 'Content', path: '/admin/content', icon: PenLine },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="border-b-2 border-foreground/20 bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={[
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-md',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
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

      <div
        className="h-12 w-full md:h-16"
        style={{
          backgroundImage: `url(${booksShelfDivider})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      <main className="flex-1 bg-background-warm">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</div>
        <div className="h-20 md:hidden" />
      </main>
      <Footer />
      <BottomTabBar role="admin" />
    </div>
  );
}
