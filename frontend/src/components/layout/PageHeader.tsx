import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../legacy/Logo';

interface PageHeaderProps {
  rightContent?: React.ReactNode;
}

export default function PageHeader({ rightContent }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-card px-4 py-4">
      <Link to="/" className="block w-[405px] max-w-[60vw]">
        <Logo size="hero" />
      </Link>
      {rightContent}
    </header>
  );
}
