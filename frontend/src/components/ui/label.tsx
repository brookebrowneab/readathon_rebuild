import React from 'react';
import clsx from 'clsx';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: 'default' | 'error';
}

export default function Label({ variant = 'default', className, ...props }: LabelProps) {
  return (
    <label
      className={clsx(
        'text-sm font-medium leading-none',
        variant === 'error' ? 'text-destructive' : 'text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}
