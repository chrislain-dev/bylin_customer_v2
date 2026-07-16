<script setup lang="ts">
definePageMeta({ middleware: 'sanctum:auth', layout: 'account' })
const client = useSanctumClient()
const { data: preorders, pending } = await useAsyncData('customer-preorders', async () => {
  const response = await client<{ data: any[] }>('/api/v1/customer/preorders')
  return response.data || []
})
</script>
<template><div class="space-y-6 font-syne"><h1 class="text-3xl font-black uppercase">Mes précommandes</h1><div v-if="pending" class="rounded-3xl bg-white p-6">Chargement...</div><div v-else-if="preorders?.length" class="grid gap-4"><article v-for="item in preorders" :key="item.id" class="rounded-3xl bg-white p-6 border border-black/5 shadow-sm"><div class="flex justify-between gap-4"><div><p class="font-black text-xl">{{ item.product?.name || item.product_name || 'Précommande' }}</p><p class="font-mono text-xs opacity-60">{{ item.status || item.payment_status }}</p></div><p class="font-black">{{ formatPrice(item.total || item.amount || 0) }}</p></div></article></div><div v-else class="rounded-3xl bg-white p-10 text-center"><h2 class="font-black text-2xl">Aucune précommande</h2><p class="mt-2 opacity-60">Tes précommandes apparaîtront ici après validation.</p></div></div></template>
