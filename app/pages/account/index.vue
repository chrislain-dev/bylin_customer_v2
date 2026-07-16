<script setup lang="ts">
definePageMeta({ middleware: 'sanctum:auth', layout: 'account' })
const cartStore = useCartStore()
const wishlist = useWishlist()
const orderStore = useOrderStore()
const { data: orders } = await useAsyncData('account-orders-preview', () => orderStore.fetchOrders().catch(() => []))
const recentOrders = computed(() => (orders.value || []).slice(0, 3))
const stats = computed(() => [
  { label: 'Commandes', value: orders.value?.length || 0, icon: 'heroicons:shopping-bag' },
  { label: 'Panier', value: cartStore.itemCount, icon: 'heroicons:shopping-cart' },
  { label: 'Favoris', value: wishlist.items.value?.length || 0, icon: 'heroicons:heart' },
])
</script>
<template>
  <div class="space-y-6 font-syne">
    <div class="grid sm:grid-cols-3 gap-4">
      <div v-for="s in stats" :key="s.label" class="rounded-3xl bg-white p-6 border border-black/5 shadow-sm">
        <Icon :name="s.icon" class="w-7 h-7 opacity-50" />
        <p class="mt-4 text-4xl font-black">{{ s.value }}</p>
        <p class="font-mono text-xs uppercase opacity-50">{{ s.label }}</p>
      </div>
    </div>
    <div class="grid lg:grid-cols-[1fr_.8fr] gap-6">
      <section class="rounded-3xl bg-white p-6 border border-black/5 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-black uppercase">Commandes récentes</h2>
          <NuxtLink to="/account/orders" class="text-sm underline">Tout voir</NuxtLink>
        </div>
        <div v-if="recentOrders.length" class="mt-5 space-y-3">
          <NuxtLink v-for="o in recentOrders" :key="o.id" :to="`/account/orders/${o.id}`"
            class="flex justify-between rounded-2xl bg-gray-50 p-4 hover:bg-gray-100"><span class="font-bold">{{
              o.order_number }}</span><span class="font-mono">{{ formatPrice(o.total) }}</span></NuxtLink>
        </div>
        <p v-else class="mt-5 opacity-60">Aucune commande pour le moment.</p>
      </section>
      <section class="rounded-3xl bg-white p-6 border border-black/5 shadow-sm">
        <h2 class="text-2xl font-black uppercase">Actions rapides</h2>
        <div class="mt-5 grid gap-3">
          <NuxtLink to="/products" class="rounded-2xl bg-black px-5 py-4 text-white font-bold">Continuer mes achats
          </NuxtLink>
          <NuxtLink to="/gift-carts/create" class="rounded-2xl border border-black px-5 py-4 font-bold">Créer une gift
            card</NuxtLink>
          <NuxtLink to="/account/profile" class="rounded-2xl bg-gray-50 px-5 py-4 font-bold">Mettre à jour mon profil
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
