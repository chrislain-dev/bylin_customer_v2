<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Cartes Cadeaux',
  description: 'Offrez une carte cadeau à vos proches'
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cartes Cadeaux
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Le cadeau parfait pour toutes les occasions
          </p>
        </div>

        <UCard>
          <div class="text-center py-12">
            <UIcon name="i-lucide-gift" class="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Cartes cadeaux disponibles bientôt
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Nous préparons notre système de cartes cadeaux pour vous offrir la meilleure expérience.
            </p>
            <UButton to="/shop" color="primary" size="lg">
              Découvrir nos produits
            </UButton>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
