<script setup lang="ts">
definePageMeta({ middleware: 'sanctum:auth' })

const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const { createFromCurrentCart, buildPublicUrl } = useGiftCarts()

const message = ref('J’ai préparé ce panier cadeau. Tu peux participer au montant que tu veux, même avec un bon de 5 000 FCFA ❤️')
const expirationDays = ref(30)
const loading = ref(false)
const createdLink = ref('')

const backendCartId = computed(() => {
  const firstItem: any = cartStore.items?.[0]
  return firstItem?.cart_id || firstItem?.cart?.id || null
})

const remainingHint = computed(() => [5000, 10000, 25000, Math.ceil(cartStore.total / 2), cartStore.total].filter((v, i, a) => v > 0 && a.indexOf(v) === i))

const createGiftCart = async () => {
  if (!authStore.isAuthenticated) {
    await router.push('/auth/login?redirect=/gift-carts/create')
    return
  }

  if (cartStore.itemCount <= 0) {
    toast.add({ title: 'Panier vide', description: 'Ajoute d’abord des articles avant de créer une gift card.', color: 'warning' })
    return
  }

  if (!backendCartId.value) {
    toast.add({ title: 'Panier non synchronisé', description: 'Recharge ton panier après connexion puis réessaie. Le backend doit renvoyer cart_id sur les lignes du panier.', color: 'error' })
    return
  }

  loading.value = true
  try {
    const response = await createFromCurrentCart({ cart_id: backendCartId.value, message: message.value, expiration_days: expirationDays.value })
    const token = response.data.gift_cart.gift_cart_token
    createdLink.value = response.data.share_link || buildPublicUrl(token)
    toast.add({ title: 'Gift card créée', description: 'Le lien de contribution est prêt à être partagé.', color: 'success' })
  } catch (error: any) {
    toast.add({ title: 'Création impossible', description: error?.data?.message || error?.message || 'Vérifie le panier puis réessaie.', color: 'error' })
  } finally {
    loading.value = false
  }
}

const copyLink = async () => {
  if (!createdLink.value) return
  await navigator.clipboard.writeText(createdLink.value)
  toast.add({ title: 'Lien copié', color: 'success' })
}
</script>

<template>
  <main class="min-h-screen bg-[#f7f4ef] pt-28 pb-20 font-syne text-[#171717]">
    <section class="container mx-auto px-4 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      <div class="rounded-[2rem] bg-[#111] text-white p-8 md:p-12 overflow-hidden relative">
        <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <p class="font-mono text-xs uppercase tracking-[0.35em] text-white/60">Gift card collaborative</p>
        <h1 class="mt-4 text-4xl md:text-6xl font-black uppercase leading-none">Transforme ton panier en cadeau partageable.</h1>
        <p class="mt-6 max-w-2xl text-white/70 leading-relaxed">Tu prépares le panier, Bylin génère une URL privée, et les proches participent par montant libre, par pourcentage ou par bon simple de 5 000 FCFA.</p>
        <div class="mt-8 grid sm:grid-cols-3 gap-3">
          <div v-for="step in ['1. Crée ton panier', '2. Partage le lien', '3. Les proches paient']" :key="step" class="rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs uppercase">{{ step }}</div>
        </div>
      </div>

      <aside class="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-black/5">
        <h2 class="text-2xl font-black uppercase">Résumé du panier</h2>
        <div v-if="cartStore.itemCount" class="mt-6 space-y-4">
          <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 border-b border-black/5 pb-4">
            <img :src="item.product.thumbnail_url || item.product.media?.[0]?.original_url" :alt="item.product.name" class="h-20 w-16 object-cover rounded-xl bg-gray-100" />
            <div class="flex-1 min-w-0">
              <p class="font-bold line-clamp-2">{{ item.product.name }}</p>
              <p class="font-mono text-xs opacity-60">Qté {{ item.quantity }}</p>
              <p class="font-mono text-sm mt-1">{{ formatPrice(item.subtotal) }}</p>
            </div>
          </div>
          <div class="flex justify-between font-black text-xl"><span>Total ciblé</span><span>{{ formatPrice(cartStore.total) }}</span></div>
          <div class="flex flex-wrap gap-2 pt-2">
            <span v-for="amount in remainingHint" :key="amount" class="rounded-full bg-black/5 px-3 py-1 font-mono text-xs">{{ formatPrice(amount) }}</span>
          </div>
        </div>
        <div v-else class="mt-6 rounded-2xl bg-gray-50 p-6 text-sm opacity-70">Ton panier est vide.</div>
      </aside>
    </section>

    <section class="container mx-auto px-4 mt-8 grid gap-8 lg:grid-cols-[1fr_.8fr]">
      <div class="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-black/5">
        <h2 class="text-2xl font-black uppercase">Paramètres du lien</h2>
        <label class="block mt-6">
          <span class="font-mono text-xs uppercase opacity-60">Message visible sur la page cadeau</span>
          <textarea v-model="message" rows="5" class="mt-2 w-full rounded-2xl border border-black/10 p-4 outline-none focus:border-black" />
        </label>
        <label class="block mt-5 max-w-xs">
          <span class="font-mono text-xs uppercase opacity-60">Expiration</span>
          <select v-model.number="expirationDays" class="mt-2 w-full rounded-2xl border border-black/10 p-4 outline-none focus:border-black">
            <option :value="7">7 jours</option><option :value="15">15 jours</option><option :value="30">30 jours</option><option :value="60">60 jours</option><option :value="90">90 jours</option>
          </select>
        </label>
        <button :disabled="loading || cartStore.itemCount === 0" @click="createGiftCart" class="mt-8 w-full rounded-full bg-black py-4 text-white font-black uppercase disabled:opacity-50">{{ loading ? 'Création...' : 'Créer le lien gift card' }}</button>
      </div>

      <div class="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-black/5">
        <h2 class="text-2xl font-black uppercase">Lien généré</h2>
        <div v-if="createdLink" class="mt-6 space-y-4">
          <div class="rounded-2xl bg-gray-50 p-4 break-all font-mono text-sm">{{ createdLink }}</div>
          <button @click="copyLink" class="w-full rounded-full border border-black py-3 font-bold uppercase">Copier le lien</button>
          <NuxtLink :to="createdLink.replace(/^https?:\/\/[^/]+/, '')" class="block text-center rounded-full bg-[#0066bf] py-3 text-white font-bold uppercase">Voir la page publique</NuxtLink>
        </div>
        <p v-else class="mt-6 text-sm opacity-70">Après création, tu pourras envoyer ce lien par WhatsApp, Instagram ou email.</p>
      </div>
    </section>
  </main>
</template>
