import React from 'react';
import clsx from 'clsx';

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
}

export default function Switch({ checked, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-muted',
        className
      )}
      {...props}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1'
        )}
      />
    </button>
  );
}
