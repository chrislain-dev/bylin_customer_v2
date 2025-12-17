import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { API_ROUTES } from '@/utils/api-route'
import type { CartItem, CouponData, DeliveryInfo } from '@/types/cart'

export const useCartStore = defineStore('cart', () => {
    // --- STATE ---

    // Persistance locale (Guest cart)
    const items = useStorage<CartItem[]>('cart-items', [])

    // Infos panier
    const coupon = useStorage<CouponData | null>('cart-coupon', null)
    const deliveryInfo = useStorage<DeliveryInfo | null>('cart-delivery', null)

    // État Shared Cart (Spécifique à ton projet)
    const currentCartId = ref<number | null>(null)
    const sharedCartToken = ref<string | null>(null)
    const manualFinalPrice = ref<number | null>(null) // Override pour shared cart

    // UI States
    const isSyncing = ref(false)
    const error = ref<string | null>(null)
    const successMessage = ref<string | null>(null)
    const isCartOpen = ref(false)

    // --- GETTERS ---

    const totalQuantity = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

    // Sous-total théorique (Front-end calculation - Optimistic)
    const subTotal = computed(() => items.value.reduce((sum, i) => sum + (i.price * i.quantity), 0))

    // Total avec réduction coupon (Note: Le vrai total doit être confirmé par le back lors du checkout)
    const totalPrice = computed(() => {
        let total = subTotal.value
        if (coupon.value) {
            total -= coupon.value.discount_value
        }
        return Math.max(0, total) // Pas de négatif
    })

    // Prix final (supporte l'override manuel pour les paniers partagés/tontines)
    const finalPrice = computed(() => manualFinalPrice.value ?? totalPrice.value)

    // Frais de livraison (gratuit au-dessus de 60000 XOF)
    const shippingCost = computed(() => {
        if (subTotal.value >= 60000) return 0
        return deliveryInfo.value?.delivery_cost || 5000 // Frais par défaut
    })

    // Total final avec frais de livraison
    const total = computed(() => totalPrice.value + shippingCost.value)

    // Aliases pour compatibilité avec les composants
    const subtotal = subTotal

    // Formatage (Intl)
    const formatMoney = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)

    const formattedTotal = computed(() => formatMoney(finalPrice.value))
    const formattedDelivery = computed(() => formatMoney(deliveryInfo.value?.delivery_cost || 0))

    // --- ACTIONS PRINCIPALES ---

    /**
     * Ajoute un produit au panier
     * Gère intelligemment les variantes (Même produit mais taille différente = nouvelle ligne)
     */
    function addItem(product: any) {
        // Validation minimale
        if (!product.product_id && !product.id) {
            console.error('❌ ID produit manquant', product)
            return
        }

        const productId = product.product_id || product.id

        // Clé unique pour identifier l'item (ID + Options)
        const findExisting = (i: CartItem) =>
            i.product_id === productId &&
            i.variant_id === (product.variant_id || null) &&
            i.selectedColor?.id === product.selectedColor?.id &&
            i.selectedSize?.id === product.selectedSize?.id

        const existingItem = items.value.find(findExisting)

        if (existingItem) {
            existingItem.quantity += (product.quantity || 1)
        } else {
            const newItem: CartItem = {
                id: Date.now() + Math.random(), // Generate unique ID for UI tracking
                product_id: productId,
                slug: product.slug || '',
                name: product.name,
                price: Number(product.price), // Sécurité typage
                image: product.image || product.thumbnail,
                quantity: product.quantity || 1,
                selectedColor: product.selectedColor || null,
                selectedSize: product.selectedSize || null,
                variant_id: product.variant_id || null,
                variant: {
                    size: product.selectedSize?.name || product.variant?.size,
                    color: product.selectedColor?.name || product.variant?.color
                }
            }
            items.value.push(newItem)
        }

        // Reset des états liés au calcul
        manualFinalPrice.value = null
        syncCartWithServer() // "Fire and forget" (ne bloque pas l'UI)
    }

    function updateQuantity(productIdOrItemId: number, quantity: number, variantId: number | null = null) {
        const item = items.value.find(i =>
            (i.product_id === productIdOrItemId && i.variant_id === variantId) ||
            i.id === productIdOrItemId
        )
        if (item) {
            if (quantity <= 0) {
                removeItem(productIdOrItemId, variantId)
            } else {
                item.quantity = quantity
                syncCartWithServer()
            }
        }
    }

    function removeItem(productIdOrItemId: number, variantId: number | null = null) {
        // Support for removing by item.id (UI tracking ID) or product_id
        items.value = items.value.filter(i => {
            if (variantId !== null) {
                return !(i.product_id === productIdOrItemId && i.variant_id === variantId)
            }
            return !(i.product_id === productIdOrItemId || i.id === productIdOrItemId)
        })
        syncCartWithServer()
    }

    function clearCart() {
        items.value = []
        coupon.value = null
        currentCartId.value = null
        sharedCartToken.value = null
        manualFinalPrice.value = null
        error.value = null
    }

    // --- ACTIONS SERVEUR (SYNC) ---

    /**
     * Synchronise le panier local avec le serveur
     * Gère le nettoyage des items invalides
     */
    async function syncCartWithServer(isShared = false) {
        const authStore = useAuthStore()

        // Si pas connecté ou panier vide, pas de sync serveur (sauf si on veut vider le serveur ?)
        if (!authStore.isAuthenticated || items.value.length === 0) return

        isSyncing.value = true
        error.value = null

        try {
            // Nettoyage pré-envoi
            const validItems = items.value.filter(i => i.product_id && i.quantity > 0)

            const payload = {
                items: validItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    variant_id: item.variant_id, // Important si ton back gère les variantes
                    options: { // Envoi générique des options
                        color: item.selectedColor?.id,
                        size: item.selectedSize?.id
                    }
                })),
                is_shared: isShared,
                coupon_code: coupon.value?.code || null
            }

            const { data, error: fetchError } = await useApi<any>(API_ROUTES.cart.base, {
                method: 'POST',
                body: payload
            })

            if (fetchError.value) {
                throw new Error(fetchError.value.message || "Erreur API")
            }

            const rawData = data.value

            if (!rawData) {
                throw new Error("Données non reçues")
            }

            if (rawData.success) {
                currentCartId.value = rawData.cart?.id
                updatePricesFromServer(rawData.cart.items)
            }
        } catch (err: any) {
            console.error('Erreur sync panier', err)
            // On n'affiche pas l'erreur à l'utilisateur pour une sync background, sauf si critique
        } finally {
            isSyncing.value = false
        }
    }

    /**
     * Charge le panier depuis le serveur (au Login)
     */
    async function loadCartFromServer() {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) return

        isSyncing.value = true
        try {
            const { data, error: fetchError } = await useApi<any>(API_ROUTES.cart.load || '/cart')

            if (fetchError.value) {
                throw new Error(fetchError.value.message || "Erreur API")
            }

            const rawData = data.value

            if (!rawData) {
                throw new Error("Données non reçues")
            }

            if (rawData.data?.items) {
                // Stratégie : Le serveur écrase le local au chargement initial
                // (Tu pourrais aussi faire un merge complexe comme pour la wishlist)
                items.value = rawData.data.items.map((i: any) => ({
                    id: Date.now() + Math.random(),
                    product_id: i.product_id,
                    slug: i.product?.slug || '',
                    name: i.product.name,
                    price: Number(i.price),
                    image: i.product.image,
                    quantity: i.quantity,
                    variant_id: i.variant_id,
                    selectedColor: i.options?.color ? { id: i.options.color, name: '...' } : null,
                    selectedSize: i.options?.size ? { id: i.options.size, name: '...' } : null,
                    variant: {
                        size: i.variant?.size,
                        color: i.variant?.color
                    }
                }))

                currentCartId.value = rawData.data.id
            }
        } catch (err) {
            console.warn('Impossible de charger le panier serveur', err)
        } finally {
            isSyncing.value = false
        }
    }

    // --- ACTIONS COUPON ---

    async function applyCoupon(code: string) {
        if (!code) return

        error.value = null
        try {
            const { data, error: fetchError } = await useApi<any>(API_ROUTES.cart.coupon, {
                method: 'POST',
                body: {
                    code,
                    cart_total: subTotal.value // Le serveur revérifiera de toute façon
                }
            })

            if (data.value.success) {
                coupon.value = {
                    code,
                    discount_value: data.value.discount_value || data.value.discount,
                    type: data.value.type || 'fixed'
                }
                successMessage.value = "Code promo appliqué !"
                return true
            }
        } catch (err: any) {
            error.value = err.data?.message || "Code promo invalide"
            coupon.value = null
            return false
        }
    }

    function removeCoupon() {
        coupon.value = null
        successMessage.value = null
    }

    // --- ACTIONS SHARED CART (Spécifique) ---

    async function storeSharedCart(formData: any) {
        try {
            // 1. On force une sync pour être sûr que le back a les items
            await syncCartWithServer(false)

            const payload = {
                cart_id: currentCartId.value, // ID du panier technique synchronisé
                title: formData.title,
                description: formData.description,
                expires_in: formData.closing_date,
                final_price: manualFinalPrice.value ?? finalPrice.value, // Le prix cible défini par le créateur
                // Ajoute ici les infos de livraison si nécessaires
                delivery_info: deliveryInfo.value
            }

            const { data, error: fetchError } = await useApi<any>(API_ROUTES.cart.shared.base, {
                method: 'POST',
                body: payload
            })

            if (fetchError.value) {
                throw new Error(fetchError.value.message || "Erreur API")
            }

            const rawData = data.value

            if (!rawData) {
                throw new Error("Données non reçues")
            }

            sharedCartToken.value = rawData.token
            return rawData

        } catch (err: any) {
            error.value = err.data?.message || "Erreur création panier partagé"
            throw err
        }
    }

    async function fetchSharedCartByToken(token: string) {
        try {
            // Appel public (pas besoin d'auth)
            const { data, error: fetchError } = await useApi<any>(API_ROUTES.cart.shared.publicSingle(token))

            if (fetchError.value) {
                throw new Error(fetchError.value.message || "Erreur API")
            }

            const rawData = data.value

            if (!rawData) {
                throw new Error("Données non reçues")
            }

            return rawData
        } catch (err) {
            throw err
        }
    }

    async function processSharedPayment(token: string, paymentData: any) {
        try {
            return await useApi(API_ROUTES.cart.shared.processPayment(token), {
                method: 'POST',
                body: {
                    ...paymentData,
                    mobile_money_provider: paymentData.mobile_money_provider || 'mtn'
                }
            })
        } catch (err: any) {
            throw err // On laisse le composant gérer l'affichage de l'erreur
        }
    }

    // --- HELPERS ---

    function setDeliveryInfo(info: Omit<DeliveryInfo, 'set_at'>) {
        deliveryInfo.value = {
            ...info,
            set_at: new Date().toISOString()
        }
    }

    function updatePricesFromServer(items: any) {
        items.value = items.value.map((item: any) => {
            return {
                ...item,
                price: Number(item.price),
                final_price: Number(item.final_price)
            }
        })
    }

    // Toggle cart slideover
    function toggleCart() {
        isCartOpen.value = !isCartOpen.value
    }

    return {
        // State
        items,
        coupon,
        deliveryInfo,
        isSyncing,
        error,
        successMessage,
        currentCartId,
        sharedCartToken,
        manualFinalPrice,
        isCartOpen,

        // Getters
        totalQuantity,
        subTotal,
        subtotal, // Alias
        totalPrice,
        total, // Total avec livraison
        shippingCost,
        finalPrice,
        formattedTotal,
        formattedDelivery,

        // Actions Core
        addItem,
        updateQuantity,
        removeItem,
        clearCart,

        // Actions Server
        syncCartWithServer,
        loadCartFromServer,

        // Actions Coupon
        applyCoupon,
        removeCoupon,

        // Actions Shared Cart
        storeSharedCart,
        fetchSharedCartByToken,
        processSharedPayment,

        // Actions Delivery
        setDeliveryInfo,

        // UI Actions
        toggleCart
    }
})


