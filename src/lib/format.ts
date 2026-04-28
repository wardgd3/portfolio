export function formatPrice(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function availabilityLabel(a: string): string {
  switch (a) {
    case 'available': return 'Available';
    case 'sold': return 'Sold';
    case 'reserved': return 'Reserved';
    case 'nfs': return 'Not For Sale';
    default: return a;
  }
}
