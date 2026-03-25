// stores/cart.ts
import { defineStore } from "pinia";
import type { CartItem, AddToCartPayload } from "~/types/cart";
import type { Product } from "~/types/product";

export const useCartStore = defineStore(
  "cart",
  () => {
    const toast = useToast();
    const authStore = useAuthStore();
    const client = useSanctumClient(); // Utilise le client Sanctum qui gère auth automatiquement

    // State
    const items = ref<CartItem[]>([]);
    const drawerOpen = ref(false);
    const syncing = ref(false);
    const lastSyncedAt = ref<string | null>(null);

    // Computed - Totaux
    const itemCount = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0),
    );

    const subtotal = computed(() =>
      items.value.reduce((sum, item) => sum + item.subtotal, 0),
    );

    const shipping = computed(() => {
      if (subtotal.value >= 100000) return 0;
      return items.value.length > 0 ? 2000 : 0;
    });

    const tax = computed(() => {
      return Math.round(subtotal.value * 0.18);
    });

    const discount = computed(() => {
      return 0;
    });

    const total = computed(
      () => subtotal.value + shipping.value + tax.value - discount.value,
    );

    // Backend sync functions
    async function syncWithBackend() {
      if (!authStore.isAuthenticated || syncing.value) return;

      syncing.value = true;
      try {
        // Le client Sanctum gère automatiquement l'auth et les cookies
        const response = await client<{ success: boolean; data: { items: CartItem[] } }>("/api/v1/customer/cart");

        // The API returns a Cart object with items array
        items.value = response.data?.items || [];
        lastSyncedAt.value = new Date().toISOString();
      } catch (error: any) {
        console.error("Failed to sync cart:", error);
      } finally {
        syncing.value = false;
      }
    }

    async function addToBackend(payload: AddToCartPayload): Promise<boolean> {
      if (!authStore.isAuthenticated) return false;

      try {
        // Le client Sanctum inclut automatiquement CSRF token et cookies
        await client<{ data: CartItem }>("/api/v1/customer/cart/items", {
          method: "POST",
          body: payload,
        });

        return true;
      } catch (error: any) {
        console.error("Failed to add to cart:", error);
        throw error;
      }
    }

    async function updateInBackend(
      itemId: string,
      quantity: number,
    ): Promise<boolean> {
      if (!authStore.isAuthenticated) return false;

      try {
        await client(`/api/v1/customer/cart/items/${itemId}`, {
          method: "PUT",
          body: { quantity },
        });

        return true;
      } catch (error: any) {
        console.error("Failed to update cart item:", error);
        throw error;
      }
    }

    async function removeFromBackend(itemId: string): Promise<boolean> {
      if (!authStore.isAuthenticated) return false;

      try {
        await client(`/api/v1/customer/cart/items/${itemId}`, {
          method: "DELETE",
        });

        return true;
      } catch (error: any) {
        console.error("Failed to remove cart item:", error);
        throw error;
      }
    }

    // Actions
    async function addItem(
      product: Product,
      quantity = 1,
      variationId?: string,
    ) {
      // Validation du stock
      const variation = variationId
        ? product.variations?.find((v) => v.id === variationId)
        : null;

      const availableStock = variation
        ? variation.stock_quantity
        : product.stock_quantity;

      if (availableStock < quantity) {
        toast.add({
          title: "Stock insuffisant",
          description: `Seulement ${availableStock} article(s) disponible(s)`,
          color: "error",
          icon: "i-heroicons-exclamation-triangle",
        });
        return;
      }

      // Chercher si l'article existe déjà
      const existingItem = items.value.find(
        (i) =>
          i.product_id === product.id &&
          (variationId ? i.variation_id === variationId : !i.variation_id),
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > availableStock) {
          toast.add({
            title: "Stock insuffisant",
            description: `Maximum ${availableStock} article(s) disponible(s)`,
            color: "error",
            icon: "i-heroicons-exclamation-triangle",
          });
          return;
        }

        // Update local
        existingItem.quantity = newQuantity;
        existingItem.subtotal = existingItem.quantity * existingItem.unit_price;

        // Update backend
        if (authStore.isAuthenticated) {
          try {
            await updateInBackend(existingItem.id, newQuantity);
          } catch (error) {
            // Rollback on error
            existingItem.quantity -= quantity;
            existingItem.subtotal =
              existingItem.quantity * existingItem.unit_price;

            toast.add({
              title: "Erreur",
              description: "Impossible de mettre à jour le panier",
              color: "error",
              icon: "i-heroicons-exclamation-circle",
            });
            return;
          }
        }
      } else {
        const unitPrice = variation?.price || product.price;

        const newItem: CartItem = {
          id: crypto.randomUUID(),
          product_id: product.id,
          variation_id: variationId || null,
          product,
          variation: variation || null,
          quantity,
          unit_price: unitPrice,
          subtotal: unitPrice * quantity,
          added_at: new Date().toISOString(),
        };

        // Add to backend first if authenticated
        if (authStore.isAuthenticated) {
          try {
            await addToBackend({
              product_id: product.id,
              variation_id: variationId,
              quantity,
            });
          } catch (error) {
            toast.add({
              title: "Erreur",
              description: "Impossible d'ajouter l'article au panier",
              color: "error",
              icon: "i-heroicons-exclamation-circle",
            });
            return;
          }
        }

        // Add local
        items.value.push(newItem);
      }

      // Ouvrir le drawer et notifier
      drawerOpen.value = true;

      toast.add({
        title: "✓ Ajouté au panier",
        description: `${product.name} ${variation ? `(${getVariationLabel(variation)})` : ""}`,
        color: "success",
        icon: "i-heroicons-shopping-bag",
      });
    }

    async function updateQuantity(itemId: string, newQuantity: number) {
      const item = items.value.find((i) => i.id === itemId);
      if (!item) return;

      if (newQuantity < 1) {
        await removeItem(itemId);
        return;
      }

      const maxQuantity = item.variation
        ? item.variation.stock_quantity
        : item.product.stock_quantity;

      if (newQuantity > maxQuantity) {
        toast.add({
          title: "Stock insuffisant",
          description: `Maximum ${maxQuantity} article(s) disponible(s)`,
          color: "error",
          icon: "i-heroicons-exclamation-triangle",
        });
        return;
      }

      const oldQuantity = item.quantity;

      // Update local optimistically
      item.quantity = newQuantity;
      item.subtotal = item.quantity * item.unit_price;

      // Update backend
      if (authStore.isAuthenticated) {
        try {
          await updateInBackend(itemId, newQuantity);
        } catch (error) {
          // Rollback on error
          item.quantity = oldQuantity;
          item.subtotal = item.quantity * item.unit_price;

          toast.add({
            title: "Erreur",
            description: "Impossible de mettre à jour la quantité",
            color: "error",
            icon: "i-heroicons-exclamation-circle",
          });
        }
      }
    }

    async function removeItem(itemId: string) {
      const index = items.value.findIndex((i) => i.id === itemId);
      if (index === -1) return;

      const item = items.value[index];
      const removedItem = { ...item };

      // Remove local optimistically
      items.value.splice(index, 1);

      // Remove from backend
      if (authStore.isAuthenticated) {
        try {
          await removeFromBackend(itemId);
        } catch (error) {
          // Rollback on error
          items.value.splice(index, 0, removedItem);

          toast.add({
            title: "Erreur",
            description: "Impossible de retirer l'article",
            color: "error",
            icon: "i-heroicons-exclamation-circle",
          });
          return;
        }
      }

      toast.add({
        title: "Article retiré",
        description: `${removedItem.product.name} a été retiré du panier`,
        color: "neutral",
        icon: "i-heroicons-trash",
      });
    }

    function clear() {
      items.value = [];
      drawerOpen.value = false;
    }

    function toggleDrawer() {
      drawerOpen.value = !drawerOpen.value;
    }

    function validateStock(): boolean {
      for (const item of items.value) {
        const availableStock = item.variation
          ? item.variation.stock_quantity
          : item.product.stock_quantity;

        if (item.quantity > availableStock) {
          toast.add({
            title: "Stock insuffisant",
            description: `${item.product.name} n'est plus disponible en quantité demandée`,
            color: "error",
            icon: "i-heroicons-exclamation-circle",
          });
          return false;
        }
      }
      return true;
    }

    function getCheckoutData() {
      return {
        items: items.value.map((item) => ({
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        subtotal: subtotal.value,
        shipping: shipping.value,
        tax: tax.value,
        discount: discount.value,
        total: total.value,
      };
    }

    function getVariationLabel(variation: any): string {
      const parts = [];
      if (variation.attributes?.color) parts.push(variation.attributes.color);
      if (variation.attributes?.size) parts.push(variation.attributes.size);
      if (variation.attributes?.shoe_size)
        parts.push(`Pointure ${variation.attributes.shoe_size}`);
      return parts.join(", ");
    }

    // Auto-sync on auth changes
    watch(
      () => authStore.isAuthenticated,
      (isAuth) => {
        if (isAuth) {
          syncWithBackend();
        }
      },
      { immediate: true },
    );

    return {
      // State
      items,
      drawerOpen,
      syncing,
      lastSyncedAt,

      // Computed
      itemCount,
      subtotal,
      shipping,
      tax,
      discount,
      total,

      // Actions
      addItem,
      updateQuantity,
      removeItem,
      clear,
      toggleDrawer,
      validateStock,
      getCheckoutData,
      syncWithBackend,
    };
  },
  {
    persist: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      pick: ["items"],
    },
  },
);
