<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'

const props = defineProps<{
      navigation?: NavigationItem[]
}>()

const authStore = useAuthStore()
const cartStore = useCartStore()
const colorMode = useColorMode()

const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)

const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// User Dropdown
const userMenuItems = computed(() => {
      if (authStore.isAuthenticated) {
            return [
                  [{
                        label: `${authStore.user?.first_name} ${authStore.user?.last_name}`,
                        slot: 'account',
                        disabled: true
                  }],
                  [{
                        label: 'Mon compte',
                        icon: 'i-heroicons-user',
                        to: '/account'
                  }, {
                        label: 'Mes commandes',
                        icon: 'i-heroicons-shopping-bag',
                        to: '/account/orders'
                  }, {
                        label: 'Ma wishlist',
                        icon: 'i-heroicons-heart',
                        to: '/account/wishlist'
                  }, {
                        label: 'Mes adresses',
                        icon: 'i-heroicons-map-pin',
                        to: '/account/addresses'
                  }],
                  [{
                        label: 'Aide',
                        icon: 'i-heroicons-question-mark-circle',
                        to: '/faq'
                  }],
                  [{
                        label: 'Déconnexion',
                        icon: 'i-heroicons-arrow-right-on-rectangle',
                        onSelect: () => authStore.logout()
                  }]
            ]
      }

      return [
            [{
                  label: 'Se connecter',
                  icon: 'i-heroicons-arrow-right-on-rectangle',
                  to: '/auth/login'
            }],
            [{
                  label: 'Créer un compte',
                  icon: 'i-heroicons-user-plus',
                  to: '/auth/register'
            }],
            [{
                  label: 'Suivre ma commande',
                  icon: 'i-heroicons-truck',
                  to: '/track-order'
            }]
      ]
})
</script>

<template>
      <div class="w-full">
            <!-- Top Bar (Desktop only) -->
            <AppHeaderTopBar />

            <!-- Main Header -->
            <header
                  class="bg-primary-500 dark:bg-primary-900 border-b border-primary-600 dark:border-primary-800 sticky top-0 z-50 shadow-sm">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16 lg:h-20">

                              <!-- Mobile Menu Button (Left) -->
                              <UButton icon="i-heroicons-bars-3" variant="ghost" color="neutral"
                                    class="lg:hidden text-white hover:text-black" @click="toggleMobileMenu" />

                              <!-- Search (Desktop) + Hidden on mobile/tablet -->
                              <UButton icon="i-heroicons-magnifying-glass" variant="ghost" color="neutral"
                                    class="hidden lg:flex text-white hover:text-black" label="Rechercher"
                                    @click="isSearchOpen = true" />

                              <!-- Logo (Center on mobile, left on desktop) -->
                              <NuxtLink to="/"
                                    class="flex flex-col items-center text-white hover:opacity-80 transition-opacity lg:ml-0">
                                    <img src="/images/logo-white.png" alt="Bylin Logo"
                                          class="h-8 sm:h-10 lg:h-12 w-auto">
                                    <span
                                          class="text-[7px] sm:text-[8px] font-light tracking-widest uppercase mt-0.5 sm:mt-1">
                                          Cotonou
                                    </span>
                              </NuxtLink>

                              <!-- Actions (Right side) -->
                              <div class="flex items-center gap-1 sm:gap-2 lg:gap-3">
                                    <!-- Search (Mobile/Tablet) -->
                                    <UButton icon="i-heroicons-magnifying-glass" variant="ghost" color="neutral"
                                          class="lg:hidden text-white hover:text-black" @click="isSearchOpen = true" />

                                    <!-- User Menu -->
                                    <UDropdownMenu :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
                                          <!-- Desktop with label -->
                                          <UButton
                                                :icon="authStore.isAuthenticated ? 'i-heroicons-user-circle' : 'i-heroicons-user'"
                                                color="neutral" variant="ghost"
                                                :label="authStore.isAuthenticated ? authStore.user?.first_name : undefined"
                                                class="hidden lg:flex text-white hover:text-black" />
                                          <!-- Mobile/Tablet without label -->
                                          <UButton
                                                :icon="authStore.isAuthenticated ? 'i-heroicons-user-circle' : 'i-heroicons-user'"
                                                color="neutral" variant="ghost"
                                                class="lg:hidden text-white hover:text-black" />
                                    </UDropdownMenu>

                                    <!-- Dark Mode Toggle (Desktop only) -->
                                    <UButton :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
                                          color="neutral" variant="ghost"
                                          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
                                          class="hidden lg:flex text-white hover:text-black" />

                                    <!-- Cart -->
                                    <AppHeaderCart />
                              </div>
                        </div>

                        <!-- Desktop Navigation -->
                        <AppHeaderNavigation :navigation="navigation" />
                  </div>
            </header>

            <!-- Mobile Menu -->
            <AppHeaderMobileMenu v-model:open="isMobileMenuOpen" :navigation="navigation" />

            <!-- Search Modal -->
            <AppHeaderSearch v-model:open="isSearchOpen" />
      </div>
</template>