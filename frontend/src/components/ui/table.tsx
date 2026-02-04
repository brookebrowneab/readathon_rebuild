import type { TableHTMLAttributes, HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={clsx('w-full text-left text-sm', className)} {...props} />;
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={clsx('text-xs uppercase tracking-wide text-muted-foreground', className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx('divide-y divide-border', className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={clsx('hover:bg-muted/30', className)} {...props} />;
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={clsx('px-4 py-3 font-semibold text-foreground', className)} {...props} />;
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx('px-4 py-3 text-muted-foreground', className)} {...props} />;
}
