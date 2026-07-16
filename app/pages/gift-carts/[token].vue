<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { fetchGiftCart, contribute } = useGiftCarts()

const token = computed(() => String(route.params.token))
const { data: giftCart, pending, refresh } = await useAsyncData(`gift-cart-${token.value}`, () => fetchGiftCart(token.value), { watch: [token] })

const mode = ref<'amount' | 'percentage'>('amount')
const amount = ref(5000)
const percentage = ref(25)
const name = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)

const target = computed(() => Number(giftCart.value?.gift_cart_target_amount || 0))
const paid = computed(() => Number(giftCart.value?.gift_cart_paid_amount || 0))
const remaining = computed(() => Math.max(0, target.value - paid.value))
const progress = computed(() => target.value ? Math.min(100, Math.round((paid.value / target.value) * 100)) : 0)
const computedAmount = computed(() => mode.value === 'percentage' ? Math.ceil(target.value * percentage.value / 100) : amount.value)
const quickAmounts = computed(() => [5000, 10000, 25000, Math.ceil(remaining.value / 2), remaining.value].filter((v, i, a) => v > 0 && a.indexOf(v) === i))

const submit = async () => {
  if (!giftCart.value) return
  loading.value = true
  try {
    await contribute(token.value, { contribution_type: mode.value, amount: amount.value, percentage: percentage.value, name: name.value, email: email.value, message: message.value })
    toast.add({ title: 'Contribution enregistrée', description: 'La prochaine étape est le paiement.', color: 'success' })
    await refresh()
  } catch (error: any) {
    toast.add({ title: 'Contribution refusée', description: error?.data?.message || error?.message || 'Réessaie avec un autre montant.', color: 'error' })
  } finally { loading.value = false }
}
</script>

<template>
  <main class="min-h-screen bg-[#f7f4ef] pt-28 pb-20 font-syne text-[#171717]">
    <div v-if="pending" class="container mx-auto px-4 py-20 text-center font-mono">Chargement...</div>
    <section v-else-if="giftCart" class="container mx-auto px-4 grid gap-8 lg:grid-cols-[1fr_.85fr]">
      <div class="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-black/5">
        <p class="font-mono text-xs uppercase tracking-[0.3em] opacity-50">Gift card Bylin</p>
        <h1 class="mt-3 text-4xl md:text-6xl font-black uppercase leading-none">Participe à ce panier cadeau.</h1>
        <p v-if="giftCart.gift_cart_message" class="mt-6 rounded-2xl bg-[#f7f4ef] p-5 leading-relaxed">“{{ giftCart.gift_cart_message }}”</p>

        <div class="mt-8 rounded-3xl bg-black text-white p-6">
          <div class="flex justify-between font-mono text-sm"><span>{{ formatPrice(paid) }} collectés</span><span>{{ formatPrice(target) }}</span></div>
          <div class="mt-3 h-3 rounded-full bg-white/15 overflow-hidden"><div class="h-full bg-white" :style="{ width: `${progress}%` }" /></div>
          <div class="mt-3 flex justify-between text-xs uppercase tracking-widest opacity-70"><span>{{ progress }}%</span><span>reste {{ formatPrice(remaining) }}</span></div>
        </div>

        <div class="mt-8 grid sm:grid-cols-2 gap-4">
          <div v-for="item in giftCart.items" :key="item.id" class="rounded-3xl border border-black/5 bg-gray-50 p-4 flex gap-4">
            <img :src="item.product.thumbnail_url || item.product.media?.[0]?.original_url" :alt="item.product.name" class="h-24 w-20 rounded-2xl object-cover bg-gray-100" />
            <div><p class="font-bold line-clamp-2">{{ item.product.name }}</p><p class="font-mono text-xs opacity-60 mt-1">Qté {{ item.quantity }}</p><p class="font-mono text-sm mt-2">{{ formatPrice(item.subtotal) }}</p></div>
          </div>
        </div>
      </div>

      <aside class="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-black/5 h-fit lg:sticky lg:top-28">
        <h2 class="text-2xl font-black uppercase">Contribuer</h2>
        <div class="mt-6 grid grid-cols-2 gap-2 rounded-full bg-gray-100 p-1">
          <button @click="mode = 'amount'" class="rounded-full py-3 text-sm font-bold" :class="mode === 'amount' ? 'bg-black text-white' : ''">Montant</button>
          <button @click="mode = 'percentage'" class="rounded-full py-3 text-sm font-bold" :class="mode === 'percentage' ? 'bg-black text-white' : ''">Pourcentage</button>
        </div>

        <div v-if="mode === 'amount'" class="mt-5">
          <label class="font-mono text-xs uppercase opacity-60">Montant FCFA</label>
          <input v-model.number="amount" type="number" min="500" :max="remaining" class="mt-2 w-full rounded-2xl border border-black/10 p-4 outline-none focus:border-black" />
          <div class="mt-3 flex flex-wrap gap-2"><button v-for="v in quickAmounts" :key="v" @click="amount = v" class="rounded-full bg-black/5 px-3 py-2 font-mono text-xs hover:bg-black hover:text-white">{{ formatPrice(v) }}</button></div>
        </div>
        <div v-else class="mt-5">
          <label class="font-mono text-xs uppercase opacity-60">Pourcentage</label>
          <input v-model.number="percentage" type="range" min="5" max="100" step="5" class="mt-4 w-full" />
          <div class="mt-2 font-black text-3xl">{{ percentage }}% <span class="font-mono text-sm opacity-60">≈ {{ formatPrice(computedAmount) }}</span></div>
        </div>

        <div class="mt-6 grid gap-3">
          <input v-model="name" placeholder="Ton nom" class="rounded-2xl border border-black/10 p-4 outline-none focus:border-black" />
          <input v-model="email" placeholder="Ton email" type="email" class="rounded-2xl border border-black/10 p-4 outline-none focus:border-black" />
          <textarea v-model="message" rows="3" placeholder="Petit message optionnel" class="rounded-2xl border border-black/10 p-4 outline-none focus:border-black" />
        </div>
        <button :disabled="loading || remaining <= 0" @click="submit" class="mt-6 w-full rounded-full bg-[#0066bf] py-4 text-white font-black uppercase disabled:opacity-50">{{ remaining <= 0 ? 'Déjà financé' : loading ? 'Traitement...' : `Participer ${formatPrice(computedAmount)}` }}</button>
        <p class="mt-4 font-mono text-[11px] opacity-50">Le paiement réel est lancé par l’intégration paiement du backend après création de la contribution.</p>
      </aside>
    </section>
    <section v-else class="container mx-auto px-4 py-20 text-center"><h1 class="text-5xl font-black">Gift card introuvable</h1></section>
  </main>
</template>
