/**
 * WishlistItem interface
 */
export interface WishlistItem {
  product_id: string
  name: string
  slug: string
  price: number
  image?: string
  in_stock: boolean
  added_at?: string
  // Ajoute d'autres champs si ton API renvoie des variantes
}
