import type { SpatieMedia, LaravelPaginator } from "./shared";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  website?: string | null;
  is_active: boolean;
  is_bylin_brand: boolean;

  logo_url?: string | null;
  media?: SpatieMedia[];

  products_count?: number;
  active_products_count?: number;
}

export type BrandPaginator = LaravelPaginator<Brand>;