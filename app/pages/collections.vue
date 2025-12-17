<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Collections',
  description: 'Explorez nos collections thématiques'
})

const collections = ref([
  { id: 1, name: 'Nouveautés', slug: 'new', description: 'Les dernières arrivées' },
  { id: 2, name: 'Meilleures ventes', slug: 'best-sellers', description: 'Nos produits les plus populaires' },
  { id: 3, name: 'Promotions', slug: 'sale', description: 'Profitez de nos offres spéciales' }
])
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Nos Collections
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Explorez nos sélections thématiques
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="collection in collections" :key="collection.id">
          <template #header>
            <h3 class="text-xl font-semibold">{{ collection.name }}</h3>
          </template>
          
          <p class="text-gray-600 dark:text-gray-400">{{ collection.description }}</p>

          <template #footer>
            <UButton :to="`/collections/${collection.slug}`" color="primary" block>
              Découvrir
            </UButton>
          </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
