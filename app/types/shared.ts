// types/shared.ts (nouveau fichier commun)
export interface SpatieMedia {
  id: number;
  model_type: string;
  model_id: string;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: Record<string, unknown>;
  custom_properties: Record<string, unknown>;
  generated_conversions: Record<string, boolean>;
  responsive_images: Record<string, unknown>;
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
}

export interface LaravelPaginator<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

// Utils
export function isApiError(response: unknown): response is ApiResponse<null> {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  );
}

export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Octets";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Octets", "Ko", "Mo", "Go", "To"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
