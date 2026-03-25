import type { Product, ProductVariation } from "./product";

export interface CartItem {
  id: string;
  product_id: string;
  variation_id?: string | null;

  product: Product;
  variation?: ProductVariation | null;

  quantity: number;
  unit_price: number;
  subtotal: number; // quantity * unit_price

  // Métadonnées
  added_at: string; // ISO timestamp
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  item_count: number;
}

export interface AddToCartPayload {
  product_id: string;
  variation_id?: string;
  quantity?: number;
}
