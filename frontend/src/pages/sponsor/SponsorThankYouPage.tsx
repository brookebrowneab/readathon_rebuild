import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { handDrawnBorder } from '../../lib/admin-styles';
import Button from '../../components/ui/button';

export default function SponsorThankYouPage() {
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
            <h1 className="text-3xl font-serif">Thank You!</h1>
            <p className="mt-2 text-muted-foreground">
              Your support helps students reach their reading goals.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => (window.location.href = '/sponsor')}>
                Sponsor Another Student
              </Button>
              <Button variant="secondary" onClick={() => (window.location.href = '/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
