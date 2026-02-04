import React from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ label: string; value: string }>;
}

export default function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        'h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
