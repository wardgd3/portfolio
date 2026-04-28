import type { Availability } from '../types';

interface Props {
  availability: Availability;
  size?: 'sm' | 'md';
}

const dotColor: Record<Availability, string> = {
  available: 'bg-sage',
  sold: 'bg-stone-500',
  reserved: 'bg-stone-400',
  nfs: 'bg-stone-400',
};

const labelText: Record<Availability, string> = {
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
  nfs: 'Not for sale',
};

export function AvailabilityBadge({ availability, size = 'sm' }: Props) {
  const textCls = size === 'md' ? 'text-[11px]' : 'text-[10.5px]';
  return (
    <span className={`inline-flex items-center gap-2 font-mono uppercase tracking-widewide ${textCls} ${
      availability === 'sold' ? 'text-stone-500' : 'text-ink/80'
    }`}>
      <span className={`availability-dot ${dotColor[availability]}`} aria-hidden />
      {labelText[availability]}
    </span>
  );
}
