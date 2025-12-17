<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Meilleures Ventes',
  description: 'Nos produits les plus populaires'
})

const { data: products, pending } = await useFetch('/api/products', {
  query: { filter: 'best-sellers', limit: 24 }
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="text-center mb-12">
        <UBadge color="warning" size="lg" class="mb-4">Best Sellers</UBadge>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Nos Meilleures Ventes
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Les produits préférés de nos clients
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
        <p class="text-gray-600 dark:text-gray-400">Aucun produit disponible</p>
      </div>
    </UContainer>
  </div>
</template>
