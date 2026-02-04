import React from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-md border border-text-tertiary bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
        className
      )}
      {...props}
    />
  );
}
