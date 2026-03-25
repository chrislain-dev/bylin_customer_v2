<script setup lang="ts">
const { navigation, pending } = useCategories()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader :navigation="navigation || []" :loading="pending" />

    <main class="flex-1">
      <slot />
    </main>

    <ClientOnly>
      <AppFooter />
    </ClientOnly>
  </div>
</template>