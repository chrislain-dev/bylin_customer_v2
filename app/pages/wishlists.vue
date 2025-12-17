<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const wishlistStore = useWishlistStore()

useSeoMeta({
  title: 'Ma Liste de Souhaits',
  description: 'Gérez vos produits favoris'
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ma Liste de Souhaits
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ wishlistStore.count }} {{ wishlistStore.count > 1 ? 'produits' : 'produit' }}
        </p>
      </div>

      <div v-if="wishlistStore.items.length === 0" class="text-center py-16">
        <UIcon name="i-lucide-heart" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Votre liste est vide
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Ajoutez des produits à votre liste de souhaits
        </p>
        <UButton to="/shop" color="primary" size="lg">
          Découvrir nos produits
        </UButton>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Wishlist items will be rendered here -->
        <div v-for="item in wishlistStore.items" :key="item.id"
             class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <p class="text-center">{{ item.name }}</p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
