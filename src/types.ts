export type Availability = 'available' | 'sold' | 'reserved' | 'nfs';

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  medium: string;
  series: string | null;
  dimensions: string;
  year: number | null;
  price_cents: number;
  currency: string;
  description: string | null;
  image_url: string;
  image_urls: string[];
  availability: Availability;
  sort_order: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartLine {
  artwork: Artwork;
  quantity: number;
}
