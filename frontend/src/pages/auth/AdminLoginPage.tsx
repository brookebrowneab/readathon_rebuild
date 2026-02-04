import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNav from '../../components/layout/MainNav';
import Footer from '../../components/layout/Footer';
import logoSvg from '../../assets/logo.svg';
import FormField from '../../components/ui/form-field';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { adminLogin } from '../../lib/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message ?? 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-warm">
      <MainNav />
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 bg-background p-8 shadow-sm hand-drawn">
          <div className="space-y-2 text-center">
            <img src={logoSvg} alt="Read-a-thon" className="mx-auto h-12 w-auto" />
            <p className="text-sm text-muted-foreground">Admin sign in</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField label="Email" htmlFor="admin-email" required>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
              />
            </FormField>
            <FormField label="Password" htmlFor="admin-password" required>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
              />
            </FormField>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
