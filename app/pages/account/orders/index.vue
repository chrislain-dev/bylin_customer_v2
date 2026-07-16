<script setup lang="ts">
definePageMeta({ middleware: 'sanctum:auth', layout: 'account' })
const orderStore = useOrderStore()
const { data: orders, pending } = await useAsyncData('account-orders', () => orderStore.fetchOrders().catch(() => []))
</script>
<template>
      <div class="space-y-6 font-syne">
            <h1 class="text-3xl font-black uppercase">Mes commandes</h1>
            <div v-if="pending" class="rounded-3xl bg-white p-6">Chargement...</div>
            <div v-else-if="orders?.length" class="grid gap-4">
                  <NuxtLink v-for="order in orders" :key="order.id" :to="`/account/orders/${order.id}`"
                        class="rounded-3xl bg-white p-6 border border-black/5 shadow-sm hover:shadow-md transition">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div>
                                    <p class="font-black text-xl">{{ order.order_number }}</p>
                                    <p class="font-mono text-xs opacity-50">{{ new
                                          Date(order.created_at).toLocaleDateString('fr-FR') }}</p>
                              </div>
                              <div class="flex flex-wrap items-center gap-3"><span
                                          class="rounded-full bg-gray-100 px-3 py-1 font-mono text-xs uppercase">{{
                                          order.status }}</span><span
                                          class="rounded-full bg-gray-100 px-3 py-1 font-mono text-xs uppercase">{{
                                          order.payment_status }}</span><span class="font-black text-lg">{{
                                          formatPrice(order.total) }}</span></div>
                        </div>
                  </NuxtLink>
            </div>
            <div v-else class="rounded-3xl bg-white p-10 text-center">
                  <h2 class="font-black text-2xl">Aucune commande</h2>
                  <NuxtLink to="/products"
                        class="mt-4 inline-flex rounded-full bg-black px-5 py-3 text-white font-bold">Découvrir la
                        boutique</NuxtLink>
            </div>
      </div>
</template>
