<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Promotions',
  description: 'Profitez de nos offres spéciales'
})

const { data: products, pending } = await useFetch('/api/products', {
  query: { filter: 'sale', limit: 24 }
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="text-center mb-12">
        <UBadge color="error" size="lg" class="mb-4">Promotions</UBadge>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Offres Spéciales
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Profitez de réductions exceptionnelles
        </p>
      </div>

      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <USkeleton v-for="i in 8" :key="i" class="h-96" />
      </div>

      <div v-else-if="products?.data?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in products.data" :key="product.id" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <p class="text-center">{{ product.name }}</p>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">Aucune promotion en cours</p>
      </div>
    </UContainer>
  </div>
</template>
