import { NavLink } from 'react-router-dom';

type TabRole = 'parent' | 'student' | 'teacher' | 'sponsor' | 'admin' | null;

const adminTabs = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Reading', path: '/admin/reading' },
  { label: 'Users', path: '/admin-users' },
  { label: 'Finance', path: '/admin-finance' },
  { label: 'Settings', path: '/admin/settings' },
];

export default function BottomTabBar({ role }: { role: TabRole }) {
  if (role !== 'admin') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:hidden">
      <div className="flex h-16 items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] text-xs font-medium">
        {adminTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1 text-muted-foreground transition-colors',
                isActive ? 'text-primary' : 'hover:text-foreground',
              ].join(' ')
            }
          >
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
