import React, { useState } from 'react';
import clsx from 'clsx';

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-flex">{children}</div>;
}

export function DropdownMenuTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function DropdownMenuContent({
  open,
  children,
  className,
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div
      className={clsx(
        'absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}

export function useDropdownState() {
  const [open, setOpen] = useState(false);
  return {
    open,
    setOpen,
    toggle: () => setOpen((prev) => !prev),
    close: () => setOpen(false),
  };
}
