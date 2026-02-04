import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx('inline-flex gap-2 rounded-full bg-muted p-1', className)}>{children}</div>;
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    return null;
  }
  const active = ctx.value === value;
  return (
    <button
      className={clsx(
        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
        className
      )}
      onClick={() => ctx.setValue(value)}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) {
    return null;
  }
  return <div className={className}>{children}</div>;
}
