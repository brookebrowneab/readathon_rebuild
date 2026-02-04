import React from 'react';
import clsx from 'clsx';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={clsx('group relative inline-flex', className)}>
      {children}
      <span className="pointer-events-none absolute -top-2 left-1/2 z-20 hidden w-max -translate-x-1/2 -translate-y-full rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md group-hover:block">
        {content}
      </span>
    </span>
  );
}
