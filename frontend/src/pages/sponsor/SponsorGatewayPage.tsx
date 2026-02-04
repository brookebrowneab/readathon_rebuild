import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import BookContainer from '../../components/legacy/BookContainer';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { handDrawnBorder } from '../../lib/admin-styles';

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background-warm text-brand-navy">
      {children}
    </span>
  );
}

export default function SponsorGatewayPage() {
  const navigate = useNavigate();
  const [code, setCode] = React.useState('');

  return (
    <PublicLayout>
      <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background-warm px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Icon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
                </svg>
              </Icon>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif">Sponsor a Reader</h1>
            <p className="text-muted-foreground">Choose how you would like to support students this season.</p>
          </div>

          <BookContainer variant="default" shadowLevel="normal">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-5 shadow-sm" style={handDrawnBorder}>
                  <div className="flex items-start gap-3">
                    <Icon>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7h18" />
                        <path d="M3 12h18" />
                        <path d="M3 17h18" />
                      </svg>
                    </Icon>
                    <div className="space-y-2">
                      <h2 className="font-serif text-xl">Support a Classroom</h2>
                      <p className="text-sm text-muted-foreground">
                        Pledge to a class in one step and help an entire group of readers.
                      </p>
                      <Button onClick={() => navigate('/sponsor/class')}>Get Started</Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-5 shadow-sm" style={handDrawnBorder}>
                  <div className="flex items-start gap-3">
                    <Icon>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </Icon>
                    <div className="space-y-2">
                      <h2 className="font-serif text-xl">Returning Sponsor</h2>
                      <p className="text-sm text-muted-foreground">
                        Sign in to see your previous pledges and make a quick payment.
                      </p>
                      <Button variant="secondary" onClick={() => navigate('/sponsor/pay')}>
                        Sign In
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-background-warm p-5" style={handDrawnBorder}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <Icon>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 1 1 7.07 0l-1.41 1.41" />
                        <path d="M21 21l-4.5-4.5" />
                      </svg>
                    </Icon>
                    <div>
                      <h3 className="font-serif text-lg">Have a family link?</h3>
                      <p className="text-sm text-muted-foreground">Paste the sponsor code or family link.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-2">
                    <Input
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      placeholder="Enter sponsor code"
                    />
                    <Button
                      onClick={() => {
                        if (code.trim()) {
                          navigate(`/returning/${encodeURIComponent(code.trim())}`);
                        }
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </BookContainer>

          <p className="text-center text-xs text-muted-foreground">
            Need help? Reach out to your school coordinator for a fresh invite link.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
