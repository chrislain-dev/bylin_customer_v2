import type { Category } from "~/types/category";
import type { NavigationItem } from "~/types/navigation";

export const useCategories = () => {
  const config = useRuntimeConfig();

  const getApiUrl = (path: string) => {
    if (process.server) return `${config.apiSecretUrl}${path}`;
    return path;
  };

  const {
    data: categories,
    pending,
    error,
    refresh,
  } = useAsyncData<Category[]>(
    "categories-tree",
    () =>
      $fetch<any>(getApiUrl("/api/v1/catalog/categories/tree"))
        .then((response) => {
          if (Array.isArray(response)) return response;
          return response?.data || [];
        })
        .catch((err) => {
          console.error("Failed to fetch categories:", err?.message);
          return [];
        }),
    {
      lazy: false,
      server: true,
      default: () => [] as Category[],
      dedupe: "defer",
    },
  );

  const getCategoryUrl = (slug: string): string => {
    if (slug === "products" || slug === "collections") return `/${slug}`;
    return `/categories/${slug}`;
  };

  const navigation = computed((): NavigationItem[] => {
    if (!categories.value?.length) return [];

    return categories.value
      .filter(
        (cat) => cat.level === 0 && cat.is_visible_in_menu && cat.is_active,
      )
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((rootCategory) => ({
        label: rootCategory.name,
        url: getCategoryUrl(rootCategory.slug),
        mega_menu:
          rootCategory.children?.map((level1) => ({
            type: "links" as const,
            title: level1.name,
            links:
              level1.children?.map((level2) => ({
                label: level2.name,
                url: getCategoryUrl(level2.slug),
              })) || [],
            bottom_link: {
              label: `Tout voir ${level1.name}`,
              url: getCategoryUrl(level1.slug),
            },
          })) || [],
      }));
  });

  const mainCategories = computed((): Category[] => {
    if (!categories.value?.length) return [];
    return categories.value.filter((cat) => cat.level === 0 && cat.is_active);
  });

  return { categories, mainCategories, navigation, pending, error, refresh };
};
