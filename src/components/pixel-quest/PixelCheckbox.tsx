'use client';

import { cn } from '@/lib/utils';
import { PixelCheckIcon } from './icons/PixelCheckIcon';

interface PixelCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function PixelCheckbox({ id, checked, onChange, label, className }: PixelCheckboxProps) {
  const RENDER_ID = id || `pixel-checkbox-${Math.random().toString(36).substring(7)}`;
  return (
    <div className={cn('flex items-center gap-2 cursor-pointer', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        id={RENDER_ID}
        onClick={() => onChange(!checked)}
        className={cn(
          'w-6 h-6 border-2 border-foreground bg-background flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          {
            'bg-accent': checked,
          }
        )}
      >
        {checked && <PixelCheckIcon className="w-4 h-4 text-accent-foreground" />}
      </button>
      {label && (
        <label htmlFor={RENDER_ID} className="cursor-pointer select-none font-body">
          {label}
        </label>
      )}
    </div>
  );
}
