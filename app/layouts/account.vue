<script setup lang="ts">

const { navigation, pending } = useCategories()
const authStore = useAuthStore()

const nav = [
  { to: '/account', label: 'Tableau de bord', icon: 'heroicons:squares-2x2' },
  { to: '/account/orders', label: 'Mes commandes', icon: 'heroicons:shopping-bag' },
  { to: '/account/preorders', label: 'Précommandes', icon: 'heroicons:clock' },
  { to: '/gift-carts/my-gift-carts', label: 'Gift cards', icon: 'heroicons:gift' },
  { to: '/account/wishlist', label: 'Favoris', icon: 'heroicons:heart' },
  { to: '/account/addresses', label: 'Adresses', icon: 'heroicons:map-pin' },
  { to: '/account/profile', label: 'Profil', icon: 'heroicons:user-circle' },
  { to: '/account/security', label: 'Sécurité', icon: 'heroicons:shield-check' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f7f4ef]">
    <ClientOnly fallback-tag="div" fallback="Loading...">
      <AppHeader :navigation="navigation || []" :loading="pending" />
    </ClientOnly>

    <div class="flex-1 container mx-auto px-4 pt-28 pb-12">
      <div class="mb-8 rounded-4xl bg-black text-white p-6 md:p-8">
        <p class="font-mono text-xs uppercase tracking-[0.3em] text-white/50">Espace client</p>
        <h1 class="mt-2 text-3xl md:text-5xl font-black uppercase">Bonjour {{ authStore.user?.first_name || 'client' }}</h1>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="w-full lg:w-72 shrink-0">
          <nav class="bg-white rounded-[1.5rem] p-4 shadow-sm border border-black/5 space-y-1 sticky top-28">
            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-colors" active-class="bg-black text-white hover:bg-black">
              <Icon :name="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </NuxtLink>
            <button @click="authStore.logout" class="mt-3 flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50">
              <Icon name="heroicons:arrow-left-on-rectangle" class="w-5 h-5" />
              Déconnexion
            </button>
          </nav>
        </aside>
        <main class="flex-1 min-w-0">
          <slot />
        </main>
      </div>
    </div>
    
    <ClientOnly>
      <AppFooter />
    </ClientOnly>
  </div>
</template>
