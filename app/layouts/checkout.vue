<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#FAFAFA]">
    <!-- Minimal Header for Checkout -->
    <header class="bg-white border-b border-gray-200 py-4">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-syne font-bold text-2xl tracking-tight">
          BYLIN
        </NuxtLink>
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <Icon name="heroicons:lock-closed" class="w-4 h-4" />
          <span>Paiement sécurisé</span>
        </div>
      </div>
    </header>

    <!-- Checkout Content -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Minimal Footer -->
    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Bylin. Tous droits réservés.</p>
        <div class="mt-2 flex justify-center gap-4">
          <NuxtLink to="/terms" class="hover:text-black">Conditions générales</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-black">Confidentialité</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
