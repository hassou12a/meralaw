'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-navy text-white hover:bg-navy-600': variant === 'primary',
            'bg-gold text-navy hover:bg-gold-600': variant === 'gold',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100':
              variant === 'secondary',
            'border-2 border-navy text-navy hover:bg-navy hover:text-white':
              variant === 'outline',
            'text-navy hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800':
              variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm rounded-md': size === 'sm',
            'h-10 px-4 text-base rounded-lg': size === 'md',
            'h-12 px-6 text-lg rounded-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
