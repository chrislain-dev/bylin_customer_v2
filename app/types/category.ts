export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  image_url: string | null;
  icon: string | null;
  color: string | null;
  level: number;
  path: string | null;
  full_path: string;
  breadcrumbs: BreadcrumbItem[];
  is_active: boolean;
  is_visible_in_menu: boolean;
  is_featured: boolean;
  sort_order: number;
  meta_data: Record<string, any> | null;
  meta_title: string | null;
  meta_description: string | null;
  products_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Relations
  parent?: Category | null;
  children?: Category[];
  children_count?: number;
}

export interface BreadcrumbItem {
  label: string; // 🔥 Correspond à category.name
  to: string; // 🔥 Correspond à category.full_path
}
