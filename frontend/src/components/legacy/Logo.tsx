import React from 'react';
import clsx from 'clsx';

type Size = 'default' | 'hero';

interface LogoProps {
  size?: Size;
}

export default function Logo({ size = 'default' }: LogoProps) {
  return (
    <div
      className={clsx(
        'font-serif text-brand-navy',
        size === 'hero' ? 'text-3xl md:text-4xl' : 'text-2xl'
      )}
    >
      Read-a-thon
    </div>
  );
}
