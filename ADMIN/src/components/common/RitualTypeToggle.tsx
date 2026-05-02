import React from 'react';
import clsx from 'clsx';
import type { RitualType, RitualTypeWithBoth } from '../../types';

interface RitualTypeToggleProps {
  value: RitualType | RitualTypeWithBoth | 'all';
  onChange: (value: RitualType | RitualTypeWithBoth | 'all') => void;
  includeAll?: boolean;
  includeBoth?: boolean;
}

const RitualTypeToggle: React.FC<RitualTypeToggleProps> = ({
  value,
  onChange,
  includeAll = false,
  includeBoth = false,
}) => {
  const options: { value: string; label: string; emoji: string }[] = [];

  if (includeAll) options.push({ value: 'all', label: 'All', emoji: '📋' });
  options.push({ value: 'hajj', label: 'Hajj', emoji: '🕋' });
  options.push({ value: 'umrah', label: 'Umrah', emoji: '🌙' });
  if (includeBoth) options.push({ value: 'both', label: 'Both', emoji: '✨' });

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value as RitualType | RitualTypeWithBoth | 'all')}
          className={clsx('filter-chip', {
            'filter-chip-active': value === option.value,
            'bg-emerald-50 text-emerald-700 border-emerald-100':
              value === option.value && option.value === 'hajj',
            'bg-sky-50 text-sky-700 border-sky-100':
              value === option.value && option.value === 'umrah',
            'bg-orange-50 text-orange-700 border-orange-100':
              value === option.value && option.value === 'both',
          })}
        >
          <span>{option.emoji}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RitualTypeToggle;