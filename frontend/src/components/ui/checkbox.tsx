import React from 'react';
import clsx from 'clsx';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={clsx(
        'h-4 w-4 rounded-sm border border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}
