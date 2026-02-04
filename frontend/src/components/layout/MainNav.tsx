import { Link, useLocation } from 'react-router-dom';
import logoSvg from '../../assets/logo.svg';
import Logo from '../legacy/Logo';

export default function MainNav() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-');

  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.15)]">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/admin" className="flex items-center" style={{ marginTop: '10px', marginLeft: '8px' }}>
            <img
              src={logoSvg}
              alt="Read-a-thon"
              className="h-14 w-auto"
              style={{ transform: 'scale(1.08)', transformOrigin: 'top left' }}
            />
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-semibold tracking-[0.2em] text-muted-foreground md:flex">
            <Link to="/admin" className="transition-colors hover:text-foreground">
              DASHBOARD
            </Link>
            <Link to="/admin/login" className="transition-colors hover:text-foreground">
              LOG OUT
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
      </div>
    </header>
  );
}
