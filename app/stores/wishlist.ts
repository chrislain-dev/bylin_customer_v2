import { defineStore } from "pinia";

interface WishlistItem {
  id: string;
  product_id: string;
  product: any;
}

export const useWishlist = defineStore(
  "wishlist",
  () => {
    const items = ref<WishlistItem[]>([]);
    const loading = ref(false);

    const client = useSanctumClient();

    async function fetchWishlist() {
      loading.value = true;

      try {
        const response: any = await client("/api/v1/customer/wishlist");

        items.value = response.data ?? [];
      } finally {
        loading.value = false;
      }
    }

    async function add(productId: string) {
      const response: any = await client("/api/v1/customer/wishlist", {
        method: "POST",
        body: {
          product_id: productId,
        },
      });

      items.value.unshift(response.data);

      return response.data;
    }

    async function remove(productId: string) {
      await client(`/api/v1/customer/wishlist/${productId}`, {
        method: "DELETE",
      });

      items.value = items.value.filter((item) => item.product_id !== productId);
    }

    async function clear() {
      await client("/api/v1/customer/wishlist", {
        method: "DELETE",
      });

      items.value = [];
    }

    function isFavorite(productId: string) {
      return items.value.some((item) => item.product_id === productId);
    }

    return {
      items,
      loading,
      fetchWishlist,
      add,
      remove,
      clear,
      isFavorite,
    };
  },
  {
    persist: true,
  },
);
