
import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'import' | 'inhouse' | 'success' | 'warning' | 'error' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variantClasses: Record<BadgeVariant, string> = {
    import:
      'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 shadow-sm shadow-amber-500/30',
    inhouse:
      'bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-300 text-zinc-800',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
    default: 'bg-zinc-700 text-zinc-200 border border-zinc-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
