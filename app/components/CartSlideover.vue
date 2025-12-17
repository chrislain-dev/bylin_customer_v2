<script setup lang="ts">
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const router = useRouter()

// Aller au checkout
const goToCheckout = () => {
    cartStore.toggleCart()
    router.push('/checkout')
}

// Continuer les achats
const continueShopping = () => {
    cartStore.toggleCart()
    router.push('/shop')
}

// Supprimer un article
const removeItem = (itemId: number) => {
    cartStore.removeItem(itemId)
}

// Mettre à jour la quantité
const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
        removeItem(itemId)
    } else {
        cartStore.updateQuantity(itemId, quantity)
    }
}
</script>

<template>
    <USlideover v-model="cartStore.isCartOpen" side="right">
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-shopping-cart" class="w-6 h-6 text-brand-600" />
                    <div>
                        <h2 class="text-xl font-bold">Mon Panier</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ cartStore.items.length }} article{{ cartStore.items.length > 1 ? 's' : '' }}
                        </p>
                    </div>
                </div>
                <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="cartStore.toggleCart" />
            </div>

            <!-- Cart Items -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
                <!-- Empty State -->
                <div v-if="cartStore.items.length === 0"
                    class="flex flex-col items-center justify-center h-full text-center">
                    <UIcon name="i-lucide-shopping-bag" class="w-16 h-16 text-gray-300 mb-4" />
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Votre panier est vide
                    </h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-6">
                        Ajoutez des articles pour commencer vos achats
                    </p>
                    <UButton label="Découvrir la boutique" icon="i-lucide-arrow-right" trailing
                        @click="continueShopping" />
                </div>

                <!-- Cart Items List -->
                <TransitionGroup v-else name="cart-item" tag="div" class="space-y-4">
                    <UCard v-for="item in cartStore.items" :key="item.id" :ui="{
                        body: 'p-4 rounded-xl'
                    }">
                        <div class="flex gap-4">
                            <!-- Image -->
                            <NuxtLink :to="`/product/${item.slug}`" @click="cartStore.toggleCart" class="flex-shrink-0">
                                <img :src="item.image" :alt="item.name"
                                    class="w-20 h-20 object-cover rounded-lg hover:opacity-75 transition-opacity" />
                            </NuxtLink>

                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <NuxtLink :to="`/product/${item.slug}`" @click="cartStore.toggleCart"
                                    class="font-semibold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2">
                                    {{ item.name }}
                                </NuxtLink>

                                <!-- Variants -->
                                <div v-if="item.variant" class="flex gap-2 mt-2 text-xs text-gray-500">
                                    <span v-if="item.variant.size">
                                        Taille: {{ item.variant.size }}
                                    </span>
                                    <span v-if="item.variant.color">
                                        • Couleur: {{ item.variant.color }}
                                    </span>
                                </div>

                                <!-- Price & Quantity -->
                                <div class="flex items-center justify-between mt-3">
                                    <div class="flex items-center gap-2">
                                        <UButton icon="i-lucide-minus" size="xs" color="neutral" variant="soft"
                                            :disabled="item.quantity <= 1"
                                            @click="updateQuantity(item.id, item.quantity - 1)" />
                                        <span class="text-sm font-medium min-w-[2rem] text-center">
                                            {{ item.quantity }}
                                        </span>
                                        <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="soft"
                                            @click="updateQuantity(item.id, item.quantity + 1)" />
                                    </div>

                                    <div class="text-right">
                                        <p class="font-bold text-brand-600 dark:text-brand-400">
                                            {{ currencyStore.formatPrice(item.price * item.quantity) }}
                                        </p>
                                        <p v-if="item.quantity > 1" class="text-xs text-gray-500">
                                            {{ currencyStore.formatPrice(item.price) }} / unité
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Delete Button -->
                            <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="sm"
                                @click="removeItem(item.id)" class="flex-shrink-0" />
                        </div>
                    </UCard>
                </TransitionGroup>
            </div>

            <!-- Footer / Checkout -->
            <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <!-- Subtotal -->
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Sous-total</span>
                        <span class="font-medium">
                            {{ currencyStore.formatPrice(cartStore.subtotal) }}
                        </span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Livraison</span>
                        <span class="font-medium">
                            {{ cartStore.shippingCost === 0 ? 'Gratuite' :
                                currencyStore.formatPrice(cartStore.shippingCost) }}
                        </span>
                    </div>
                    <UDivider class="my-2" />
                    <div class="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span class="text-brand-600 dark:text-brand-400">
                            {{ currencyStore.formatPrice(cartStore.total) }}
                        </span>
                    </div>
                </div>

                <!-- Shipping Info -->
                <UAlert v-if="cartStore.subtotal < 60000" icon="i-lucide-truck" color="info" variant="soft"
                    :title="`Plus que ${currencyStore.formatPrice(60000 - cartStore.subtotal)} pour la livraison gratuite`" />

                <!-- Actions -->
                <div class="space-y-2">
                    <UButton label="Commander" icon="i-lucide-credit-card" trailing block size="lg"
                        @click="goToCheckout" />
                    <UButton label="Continuer mes achats" color="neutral" variant="soft" block
                        @click="continueShopping" />
                </div>

                <!-- Trust Badges -->
                <div class="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
                    <div class="flex items-center gap-1">
                        <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
                        <span>Paiement sécurisé</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <UIcon name="i-lucide-rotate-ccw" class="w-4 h-4" />
                        <span>Retours gratuits</span>
                    </div>
                </div>
            </div>
        </div>
    </USlideover>
</template>

<style scoped>
/* Animations pour les items du panier */
.cart-item-enter-active,
.cart-item-leave-active {
    transition: all 0.3s ease;
}

.cart-item-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.cart-item-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.cart-item-move {
    transition: transform 0.3s ease;
}

/* Smooth scroll */
.overflow-y-auto {
    scroll-behavior: smooth;
}

/* Line clamp pour le nom du produit */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>