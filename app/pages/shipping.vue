<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Expédition & Livraison',
  description: 'Informations sur nos modes de livraison et délais'
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Expédition & Livraison
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Tout savoir sur nos modes de livraison
          </p>
        </div>

        <div class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-truck" class="w-6 h-6 text-primary" />
                <h2 class="text-xl font-semibold">Livraison Standard</h2>
              </div>
            </template>
            <p class="text-gray-600 dark:text-gray-400">
              Délai de 3 à 5 jours ouvrés. Gratuite pour toute commande supérieure à 50€.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-zap" class="w-6 h-6 text-primary" />
                <h2 class="text-xl font-semibold">Livraison Express</h2>
              </div>
            </template>
            <p class="text-gray-600 dark:text-gray-400">
              Délai de 24 à 48 heures. Tarif fixe de 9,99€.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-map-pin" class="w-6 h-6 text-primary" />
                <h2 class="text-xl font-semibold">Point Relais</h2>
              </div>
            </template>
            <p class="text-gray-600 dark:text-gray-400">
              Retrait en point relais sous 3 à 5 jours. Tarif de 4,99€.
            </p>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
