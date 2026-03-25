<template>
  <div class="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center space-y-8">
      <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
        <UIcon name="i-heroicons-check" class="h-12 w-12 text-green-600" />
      </div>
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 font-syne">
          Commande confirmée !
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Merci pour votre achat. Vous recevrez bientôt un email de confirmation avec les détails de votre commande.
        </p>
      </div>
      <div class="mt-8 flex justify-center">
        <UButton to="/products" size="xl" color="black" variant="solid" class="px-8">
          Continuer mes achats
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Commande Confirmée - Bylin'
})
</script>