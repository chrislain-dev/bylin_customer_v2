<script setup lang="ts">
definePageMeta({ middleware: 'sanctum:auth', layout: 'account' })
const toast = useToast()
const { fetchMyGiftCarts, buildPublicUrl } = useGiftCarts()
const { data: giftCarts, pending } = await useAsyncData('my-gift-carts', fetchMyGiftCarts)

const copyGiftLink = async (token: string) => {
  if (!import.meta.client) return
  await navigator.clipboard.writeText(buildPublicUrl(token))
  toast.add({ title: 'Lien copié', color: 'success' })
}
</script>

<template>
  <div class="space-y-6 font-syne">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div><h1 class="text-3xl font-black uppercase">Mes gift cards</h1><p class="text-sm opacity-60">Suis les paniers cadeaux que tu as partagés.</p></div>
      <NuxtLink to="/gift-carts/create" class="rounded-full bg-black px-5 py-3 text-white font-bold uppercase text-sm">Créer</NuxtLink>
    </div>
    <div v-if="pending" class="rounded-2xl bg-white p-6">Chargement...</div>
    <div v-else-if="giftCarts?.length" class="grid gap-4">
      <article v-for="cart in giftCarts" :key="cart.id" class="rounded-3xl bg-white p-6 border border-black/5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div><p class="font-mono text-xs uppercase opacity-50">{{ cart.gift_cart_status }}</p><h2 class="font-black text-xl">{{ formatPrice(cart.gift_cart_paid_amount) }} / {{ formatPrice(cart.gift_cart_target_amount) }}</h2><p class="text-sm opacity-60">{{ cart.items?.length || 0 }} article(s)</p></div>
          <div class="flex flex-wrap gap-2"><NuxtLink :to="`/gift-carts/${cart.gift_cart_token}`" class="rounded-full border border-black px-4 py-2 text-sm font-bold">Voir</NuxtLink><button @click="copyGiftLink(cart.gift_cart_token)" class="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">Copier le lien</button></div>
        </div>
      </article>
    </div>
    <div v-else class="rounded-3xl bg-white p-10 text-center"><h2 class="font-black text-2xl">Aucune gift card</h2><p class="mt-2 opacity-60">Crée un panier cadeau depuis ton panier actuel.</p></div>
  </div>
</template>
