import React from 'react';
import clsx from 'clsx';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({ value, label, icon, className }: StatCardProps) {
  return (
    <div className={clsx('rounded-2xl border border-border bg-card p-4 shadow-sm', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary">
            {icon}
          </div>
        )}
        <div>
          <div className="text-2xl font-semibold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}
