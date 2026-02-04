import React from 'react';
import Label from './label';
import clsx from 'clsx';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  helperText,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} variant={error ? 'error' : 'default'}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className={clsx('text-xs text-destructive')}>{error}</p>}
    </div>
  );
}
