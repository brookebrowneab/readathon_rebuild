import React from 'react';
import clsx from 'clsx';

type Variant = 'default' | 'warm' | 'accent';
type Shadow = 'subtle' | 'normal' | 'prominent';

interface BookContainerProps {
  variant?: Variant;
  shadowLevel?: Shadow;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  default: 'bg-card',
  warm: 'bg-background-warm',
  accent: 'bg-background-warmer',
};

const shadowStyles: Record<Shadow, string> = {
  subtle: 'shadow-[0_2px_4px_rgba(0,0,0,0.15)]',
  normal: 'shadow-book',
  prominent: 'shadow-[0_6px_14px_rgba(0,0,0,0.3)]',
};

export default function BookContainer({
  variant = 'default',
  shadowLevel = 'normal',
  children,
  className,
}: BookContainerProps) {
  return (
    <div
      className={clsx(
        'rounded-[0_8vw_0_0] p-[6%_5%_2%_8%]',
        variantStyles[variant],
        shadowStyles[shadowLevel],
        className
      )}
    >
      <div className="pt-[max(2rem,3vw)]">{children}</div>
    </div>
  );
}
