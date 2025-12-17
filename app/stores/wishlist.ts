import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { API_ROUTES } from '@/utils/api-route'
import type { WishlistItem } from '@/types/wishlist'


export const useWishlistStore = defineStore('wishlist', () => {
    // --- STATE ---

    const items = useStorage<WishlistItem[]>('wishlist-items', [])

    const loading = ref(false)
    const error = ref<string | null>(null)

    // --- GETTERS ---

    const count = computed(() => items.value.length)
    const isEmpty = computed(() => items.value.length === 0)

    // Retourne simplement la liste des IDs (utile pour vérifier 'isInWishlist' rapidement)
    const itemIds = computed(() => new Set(items.value.map(i => i.product_id)))

    const totalValue = computed(() =>
        items.value.reduce((sum, i) => sum + Number(i.price), 0)
    )

    // --- ACTIONS ---

    /**
     * Vérifie si un produit est dans la liste
     */
    function isInWishlist(productId: string): boolean {
        return itemIds.value.has(productId)
    }

    /**
     * Helper interne pour modifier le state sans appel API
     */
    function removeItemLocal(productId: string) {
        items.value = items.value.filter(i => i.product_id !== productId)
    }

    /**
     * Ajoute un item (Optimistic UI + Sync Server)
     */
    async function addItem(product: any) {
        // Vérification anti-doublon
        if (isInWishlist(product.id)) return

        // 1. Mise à jour locale immédiate (Optimistic)
        const newItem: WishlistItem = {
            product_id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.final_price || product.price),
            image: product.image || product.thumbnail, // Adapte selon ton objet produit
            in_stock: product.stock_quantity > 0 || product.in_stock,
            added_at: new Date().toISOString()
        }

        items.value.push(newItem)

        // 2. Sync Serveur (si connecté)
        const authStore = useAuthStore()
        if (authStore.isAuthenticated) {
            try {
                await useApi(API_ROUTES.wishlists.base || '/wishlist', {
                    method: 'POST',
                    body: { product_id: product.id }
                })
            } catch (err) {
                // Rollback en cas d'erreur (optionnel, mais pro)
                removeItemLocal(product.id)
                console.error('Erreur ajout wishlist serveur', err)
                // On pourrait afficher un toast d'erreur ici
            }
        }
    }

    /**
     * Retire un item (Optimistic UI + Sync Server)
     */
    async function removeItem(productId: string) {
        const originalList = [...items.value] // Backup pour rollback

        // 1. Suppression locale immédiate
        removeItemLocal(productId)

        // 2. Sync Serveur (si connecté)
        const authStore = useAuthStore()
        if (authStore.isAuthenticated) {
            try {
                await useApi(`${API_ROUTES.wishlists.single(productId)}`, {
                    method: 'DELETE'
                })
            } catch (err) {
                // Rollback
                items.value = originalList
                console.error('Erreur suppression wishlist serveur', err)
            }
        }
    }

    /**
     * Action principale pour les boutons UI (Cœur/Favori)
     */
    async function toggleItem(product: any) {
        if (isInWishlist(product.id)) {
            await removeItem(product.id)
        } else {
            await addItem(product)
        }
    }

    /**
     * Déplace vers le panier
     */
    async function moveToCart(productId: string) {
        const item = items.value.find(i => i.product_id === productId)
        if (!item) return

        const cartStore = useCartStore()

        // Ajout au panier
        await cartStore.addItem({
            product_id: item.product_id,
            quantity: 1
            //                 Le cart store gérera la récupération des détails frais si besoin
        })

        // Suppression de la wishlist
        await removeItem(productId)
    }

    /**
     * CHARGEMENT & FUSION
     * Cette fonction doit être appelée après le Login (dans auth.ts) ou au mount si connecté.
     */
    async function fetchAndMerge() {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) return

        loading.value = true
        error.value = null

        try {
            // Stratégie de fusion :
            // 1. On a des items locaux (ajoutés en invité) ?
            const localItemsIds = items.value.map(i => i.product_id)

            if (localItemsIds.length > 0) {
                // 2. On les envoie au serveur pour qu'il les fusionne à son niveau
                // Endpoint hypothétique 'sync' ou boucle d'ajouts
                await useApi(API_ROUTES.wishlists.sync || '/wishlist/sync', {
                    method: 'POST',
                    body: { product_ids: localItemsIds }
                })
            }

            // 3. On récupère la liste définitive du serveur (Server Authority)
            const response = await useApi<any>(API_ROUTES.wishlists.base || '/wishlist')

            // Mappage des données serveur vers notre format local
            // response.data est un Ref, on doit accéder à .value
            const serverItems = response.data?.value || []

            items.value = serverItems.map((entry: any) => {
                // Gestion de structure : parfois l'API renvoie l'item wishlist, parfois le produit direct
                const product = entry.product || entry
                return {
                    product_id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.final_price || product.price),
                    image: product.image || product.thumbnail,
                    in_stock: product.stock_quantity > 0,
                    added_at: entry.created_at || new Date().toISOString()
                }
            })

        } catch (err: any) {
            error.value = err.message
            console.error('Erreur sync wishlist', err)
        } finally {
            loading.value = false
        }
    }

    /**
     * Vide la wishlist (après logout par exemple)
     */
    function clearLocal() {
        items.value = []
    }

    return {
        // State
        items,
        loading,
        error,

        // Getters
        count,
        isEmpty,
        totalValue,
        isInWishlist,

        // Actions
        toggleItem,
        removeItem,
        moveToCart,
        fetchAndMerge, // À appeler au login
        clearLocal
    }
})