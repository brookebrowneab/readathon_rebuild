import React from 'react';
import clsx from 'clsx';

type InputVariant = 'default' | 'error' | 'success';
type InputSize = 'sm' | 'default' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  error?: boolean;
  success?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-9 px-3 py-2',
  default: 'h-11 px-4 py-3',
  lg: 'h-12 px-4 py-3',
};

export default function Input({
  variant = 'default',
  inputSize = 'default',
  error = false,
  success = false,
  className,
  ...props
}: InputProps) {
  const hasError = error || variant === 'error';
  const hasSuccess = success || variant === 'success';

  return (
    <input
      className={clsx(
        'w-full rounded-md border bg-background text-base text-foreground placeholder:text-muted-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
        sizeStyles[inputSize],
        hasError && 'border-destructive border-2 animate-shake',
        hasSuccess && 'border-success',
        !hasError && !hasSuccess && 'border-text-tertiary focus-visible:border-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}
