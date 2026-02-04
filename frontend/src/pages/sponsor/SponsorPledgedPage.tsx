import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import Button from '../../components/ui/button';
import { handDrawnBorder } from '../../lib/admin-styles';

export default function SponsorPledgedPage() {
  return (
    <PublicLayout>
      <section className="bg-background-warm">
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-4 py-12">
          <div className="w-full rounded-xl bg-white p-8 text-center shadow-sm" style={handDrawnBorder}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif">Pledge Recorded</h1>
            <p className="mt-2 text-muted-foreground">
              Thank you for pledging. You can pay now or return later from your email link.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => (window.location.href = '/sponsor/pay')}>Pay Now</Button>
              <Button variant="secondary" onClick={() => (window.location.href = '/sponsor')}>
                Sponsor Another
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
