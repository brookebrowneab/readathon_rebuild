import type { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'neutral' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-muted text-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning-foreground',
  info: 'bg-info/10 text-info',
  neutral: 'bg-muted text-muted-foreground',
  outline: 'border border-input text-muted-foreground',
};

export default function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
