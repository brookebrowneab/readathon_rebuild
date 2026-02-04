import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BookContainer from '../../components/legacy/BookContainer';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/button';
import FormField from '../../components/ui/form-field';
import Input from '../../components/ui/input';
import { studentLogin } from '../../lib/api';

function BookOpenIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10 text-brand-navy"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5V5.75a2.5 2.5 0 0 1 2.5-2.5h10" />
      <path d="M20 19.5V5.75a2.5 2.5 0 0 0-2.5-2.5h-10" />
      <path d="M4 19.5h10a2.5 2.5 0 0 1 2.5 2.5" />
      <path d="M20 19.5h-10a2.5 2.5 0 0 0-2.5 2.5" />
    </svg>
  );
}

export default function StudentPinLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usernameValid = username.trim().length >= 3 && !/\s/.test(username);
  const passwordValid = password.length >= 4;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!usernameValid || !passwordValid) {
      setError('Please enter your username and password.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await studentLogin(username.trim().toLowerCase(), password);
      navigate('/student/log');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-yellow/20 to-background-warm">
      <PageHeader />

      <main className="mx-auto w-full max-w-lg space-y-6 px-4 pb-8 md:mt-[15px] lg:mt-0">
        <BookContainer>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy/10">
                <BookOpenIcon />
              </div>
              <h1 className="text-2xl font-serif">Student Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your student username and password to start reading.
              </p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <FormField
                label="Username"
                htmlFor="username"
                error={!usernameValid && username.length > 0 ? 'Use at least 3 characters.' : undefined}
              >
                <Input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="emma_s"
                />
              </FormField>

              <FormField
                label="Password"
                htmlFor="password"
                error={!passwordValid && password.length > 0 ? 'Use at least 4 characters.' : undefined}
              >
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </FormField>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="h-[72px] w-full text-base" loading={loading}>
                Start Reading!
              </Button>
            </form>

            <div className="space-y-1 text-center text-sm">
              <p className="text-muted-foreground">Need help? Ask a parent or teacher.</p>
              <Link to="/login" className="text-primary underline">
                Parent/Teacher Login
              </Link>
            </div>
          </div>
        </BookContainer>
      </main>
    </div>
  );
}
