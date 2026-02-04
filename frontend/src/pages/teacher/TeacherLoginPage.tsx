import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainNav from '../../components/layout/MainNav';
import Footer from '../../components/layout/Footer';
import FormField from '../../components/ui/form-field';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { teacherLogin } from '../../lib/api';
import { setTeacherUsername } from '../../lib/teacherSession';

export default function TeacherLoginPage() {
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
      const response = await teacherLogin(email, password);
      if (response.user.user_type !== 'teacher') {
        setError('Teacher access required.');
        return;
      }
      if (response.user.username) {
        setTeacherUsername(response.user.username);
      }
      navigate('/teacher');
    } catch (err: any) {
      setError(err?.message ?? 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="font-serif text-3xl">Teacher Sign In</h1>
            <p className="text-sm text-muted-foreground">Use your school email to sign in.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField label="Email" htmlFor="teacher-email" required>
              <Input
                id="teacher-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teacher@example.com"
              />
            </FormField>
            <FormField label="Password" htmlFor="teacher-password" required>
              <Input
                id="teacher-password"
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
          <div className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary underline">
              Parent/Sponsor Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
