import type { Product, ProductFilters } from "~/types/product";
import type { Brand } from "~/types/brand";
import type { Category } from "~/types/category";

interface ProductsState {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  colors: Array<{ id: string; name: string; hex_code: string }>;
  sizes: Array<{ id: string; name: string }>;
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export const useProducts = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || "/api/v1";

  const state = useState<ProductsState>("products-state", () => ({
    products: [],
    brands: [],
    categories: [],
    colors: [],
    sizes: [],
    pagination: null,
    loading: false,
    error: null,
  }));

  // Computed getters
  const allProducts = computed(() => state.value.products);
  const allBrands = computed(() => state.value.brands);
  const allCategories = computed(() => state.value.categories);
  const allColors = computed(() => state.value.colors);
  const allSizes = computed(() => state.value.sizes);
  const pagination = computed(() => state.value.pagination);
  const isLoading = computed(() => state.value.loading);
  const hasError = computed(() => state.value.error);

  /**
   * Fetch all products with optional filters
   */
  const fetchProducts = async (filters?: ProductFilters) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const params = new URLSearchParams();

      if (filters?.search) params.append("filter[name]", filters.search);
      // Use exact match for direct category selection
      if (filters?.category_id) {
          params.append("filter[category_id]", filters.category_id);
      }

      if (filters?.brand_id)
        params.append("filter[brand_id]", filters.brand_id);
      if (filters?.is_featured) params.append("filter[is_featured]", "1");
      if (filters?.is_new) params.append("filter[is_new]", "1");
      if (filters?.is_on_sale) params.append("filter[is_on_sale]", "1");
      if (filters?.in_stock) params.append("filter[status]", "active");

      if (filters?.min_price !== undefined || filters?.max_price !== undefined) {
         const min = filters.min_price ?? 0;
         const max = filters.max_price ?? ''; // Backend handles empty strings or nulls if we adjusted it, or we can send just comma for open range if backend supports it.
         // Based on my PHP change: scopePriceBetween($query, $min, $max = null)
         // If max is missing, it does >= min.
         // So:
         if (filters.max_price !== undefined && filters.max_price !== null) {
             params.append("filter[price_between]", `${min},${filters.max_price}`);
         } else {
             params.append("filter[price_between]", `${min}`);
         }
      }

      if (filters?.sort_by) {
        const direction = filters.sort_order === "desc" ? "-" : "";
        params.append("sort", `${direction}${filters.sort_by}`);
      }

      if (filters?.colors && filters.colors.length > 0) {
        params.append("filter[color]", filters.colors.join(","));
      }
      if (filters?.sizes && filters.sizes.length > 0) {
        params.append("filter[size]", filters.sizes.join(","));
      }

      params.append("per_page", String(filters?.per_page || 50));
      if (filters?.page) params.append("page", String(filters.page));

      const response = await $fetch<{ data: Product[]; meta: PaginationMeta }>(
        `${apiBase}/api/v1/catalog/products?${params}`,
      );

      state.value.products = response.data || [];
      state.value.pagination = response.meta || null;

      // Extract unique brands, colors, sizes from products
      extractMetadata();

      return response.data;
    } catch (err: any) {
      state.value.error = err.message || "Failed to fetch products";
      console.error("Error fetching products:", err);
      throw err;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetch a single product by ID
   */
  const fetchProduct = async (id: string) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const response = await $fetch<{ data: Product }>(
        `${apiBase}/api/v1/catalog/products/${id}`,
      );
      return response.data;
    } catch (err: any) {
      state.value.error = err.message || "Failed to fetch product";
      console.error("Error fetching product:", err);
      throw err;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetch a single product by slug
   */
  const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      // L'API accepte ID ou slug dans le endpoint show
      const response = await $fetch<{ data: Product }>(
        `${apiBase}/api/v1/catalog/products/${slug}`,
      );
      return response.data;
    } catch (err: any) {
      state.value.error = err.message || "Failed to fetch product";
      console.error("Error fetching product by slug:", err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * Fetch preorder information for a product
   */
  const fetchPreorderInfo = async (id: string) => {
    try {
      const response = await $fetch<{ data: any }>(
        `${apiBase}/api/v1/catalog/products/${id}/preorder-info`,
      );
      return response.data;
    } catch (err: any) {
      console.error("Error fetching preorder info:", err);
      throw err;
    }
  };

  /**
   * Extract brands, colors, and sizes from loaded products
   */
  const extractMetadata = () => {
    const brandsMap = new Map<string, Brand>();
    const colorsMap = new Map<
      string,
      { id: string; name: string; hex_code: string }
    >();
    const sizesMap = new Map<string, { id: string; name: string }>();

    state.value.products.forEach((product) => {
      // Extract brands
      if (product.brand && product.brand.id) {
        brandsMap.set(product.brand.id, product.brand);
      }

      // Extract colors and sizes from variations
      product.variations?.forEach((variation) => {
        if (variation.attributes?.color) {
          const colorName = variation.attributes.color;
          if (!colorsMap.has(colorName)) {
            colorsMap.set(colorName, {
              id: colorName.toLowerCase().replace(/\s+/g, "-"),
              name: colorName,
              hex_code: getColorHex(colorName),
            });
          }
        }

        if (variation.attributes?.size) {
          const sizeName = variation.attributes.size;
          if (!sizesMap.has(sizeName)) {
            sizesMap.set(sizeName, {
              id: sizeName.toLowerCase().replace(/\s+/g, "-"),
              name: sizeName,
            });
          }
        }
      });
    });

    state.value.brands = Array.from(brandsMap.values());
    state.value.colors = Array.from(colorsMap.values());
    state.value.sizes = Array.from(sizesMap.values());
  };

  /**
   * Get approximate hex color for common color names
   */
  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      noir: "#000000",
      blanc: "#FFFFFF",
      rouge: "#FF0000",
      bleu: "#0000FF",
      vert: "#00FF00",
      jaune: "#FFFF00",
      rose: "#FFC0CB",
      violet: "#800080",
      orange: "#FFA500",
      gris: "#808080",
      marron: "#A52A2A",
      beige: "#F5F5DC",
      black: "#000000",
      white: "#FFFFFF",
      red: "#FF0000",
      blue: "#0000FF",
      green: "#00FF00",
      yellow: "#FFFF00",
      pink: "#FFC0CB",
      purple: "#800080",
      gray: "#808080",
      brown: "#A52A2A",
    };

    return colorMap[colorName.toLowerCase()] || "#CCCCCC";
  };

  /**
   * Reset state
   */
  const reset = () => {
    state.value = {
      products: [],
      brands: [],
      categories: [],
      colors: [],
      sizes: [],
      pagination: null,
      loading: false,
      error: null,
    };
  };

  return {
    state, // Expose state if needed or keep it hidden
    // Computed props
    allProducts,
    allBrands,
    allCategories,
    allColors,
    allSizes,
    pagination,
    isLoading,
    hasError,

    // Methods
    fetchProducts,
    fetchProduct,
    fetchProductBySlug,
    fetchPreorderInfo,
    reset,
  };
};
