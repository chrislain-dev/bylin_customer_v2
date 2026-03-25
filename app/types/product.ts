import type { SpatieMedia } from "./shared";
import type { Brand } from "./brand";
import type { Category } from "./category";

export type ProductStatus = "active" | "out_of_stock" | "preorder";

export type StockStatus = "in_stock" | "out_of_stock" | "on_backorder";

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string;
  variation_name: string;

  price: number;
  compare_price?: number | null;

  stock_quantity: number;
  stock_status: StockStatus;

  is_active: boolean; //toujours true
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  brand_id: string;
  collection_id?: string | null;

  name: string;
  slug: string;
  sku: string;
  short_description?: string | null;
  description?: string | null;

  price: number;
  compare_price?: number | null;

  status: ProductStatus;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  is_variable: boolean;

  stock_quantity: number;

  weight?: number | null;
  dimensions?: ProductDimensions | null;

  // Précommande
  is_preorder_enabled: boolean;
  preorder_available_date?: string | null;
  preorder_limit?: number | null;
  preorder_count: number;
  preorder_message?: string | null;

  // Authenticité
  requires_authenticity: boolean;

  // Stats publiques
  rating_average: number;
  rating_count: number;
  views_count?: number;

  // Relations
  brand?: Brand | null;
  categories?: Category[];
  variations?: ProductVariation[];
  media?: SpatieMedia[];
  thumbnail_url?: string;
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_on_sale?: boolean;
  in_stock?: boolean;
  sort_by?: "price" | "name" | "newest" | "rating" | "created_at";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
  colors?: string[];
  sizes?: string[];
}

export function calculateDiscount(
  price: number,
  comparePrice: number | null | undefined
): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}
