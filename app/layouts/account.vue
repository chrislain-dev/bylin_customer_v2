<script setup lang="ts">
const { navigation, pending } = useCategories()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#FAFAFA]">
    <!-- Header -->
    <ClientOnly fallback-tag="div" fallback="Loading...">
      <AppHeader :navigation="navigation || []" :loading="pending" />
    </ClientOnly>

    <!-- Main Content with Account Sidebar -->
    <div class="flex-1 container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Account Sidebar -->
        <aside class="w-full lg:w-64 flex-shrink-0">
          <nav class="bg-white rounded-xl p-6 shadow-sm space-y-2">
            <h2 class="font-syne font-bold text-lg mb-4">Mon Compte</h2>
            <NuxtLink to="/account" class="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Tableau de bord
            </NuxtLink>
            <NuxtLink to="/account/orders" class="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Mes commandes
            </NuxtLink>
            <NuxtLink to="/account/wishlist" class="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Favoris
            </NuxtLink>
            <NuxtLink to="/account/addresses" class="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Adresses
            </NuxtLink>
            <NuxtLink to="/account/settings" class="block px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Paramètres
            </NuxtLink>
          </nav>
        </aside>

        <!-- Page Content -->
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>

    <!-- Footer -->
    <ClientOnly>
      <AppFooter />
    </ClientOnly>
  </div>
</template>
