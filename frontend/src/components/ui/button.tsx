import React from 'react';
import clsx from 'clsx';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'accent'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-transparent text-primary border-2 border-primary hover:bg-primary/10',
  accent:
    'bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover active:bg-accent-active',
  destructive:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover active:bg-destructive-active',
  outline: 'bg-background border border-input hover:bg-muted',
  ghost: 'bg-transparent hover:bg-muted',
  link: 'bg-transparent text-primary underline-offset-4 hover:underline',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3',
  default: 'h-10 px-6 py-3',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10 p-0',
};

export default function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span className={clsx({ 'animate-pulse-subtle': loading })}>{children}</span>
    </button>
  );
}
