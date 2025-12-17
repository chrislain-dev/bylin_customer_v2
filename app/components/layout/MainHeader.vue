<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { NavigationItem } from '~/types/home'
import NavigationMegaMenuOverlay from '~/components/navigation/MegaMenuOverlay.vue'

// Props
const props = withDefaults(defineProps<{
  navigation?: NavigationItem[]
}>(), {
  navigation: () => []
})

const isMobileMenuOpen = ref(false);
const colorMode = useColorMode();
const authStore = useAuthStore()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// User Dropdown Items
const items_users = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      [
        {
          label: authStore.fullName,
          avatar: {
            src: authStore.user?.avatar_url,
            alt: authStore.fullName
          },
          type: 'label'
        }
      ],
      [
        {
          label: 'Dashboard',
          icon: 'i-heroicons-home',
          to: '/dashboard'
        },
        {
          label: 'Mon profil',
          icon: 'i-lucide-user',
          to: '/dashboard/profile'
        },
        {
          label: 'Mes commandes',
          icon: 'i-heroicons-shopping-bag',
          to: '/dashboard/orders'
        },
        {
          label: 'Paramètres',
          icon: 'i-lucide-cog',
          to: '/dashboard/settings'
        }
      ],
      [
        {
          label: 'Support',
          icon: 'i-lucide-life-buoy',
          to: '/contact'
        }
      ],
      [
        {
          label: 'Déconnexion',
          icon: 'i-lucide-log-out',
          onSelect: async () => {
            await authStore.logout()
          }
        }
      ]
    ];
  }

  else {
    return [
      [
        {
          label: 'Se connecter',
          icon: 'i-heroicons-arrow-right-end-on-rectangle',
          to: '/auth/login',
          class: 'text-primary-500 font-semibold'
        }
      ],
      [
        {
          label: 'Créer un compte',
          icon: 'i-heroicons-user-plus',
          to: '/auth/register'
        }
      ],
      [
        {
          label: 'Suivre ma commande',
          icon: 'i-heroicons-truck',
          to: '/track-order'
        },
        {
          label: 'Aide & FAQ',
          icon: 'i-lucide-life-buoy',
          to: '/faq'
        }
      ]
    ];
  }
});

const isCartOpen = ref(false);

// Données du panier
const cartItems = ref([
  {
    id: 1,
    name: 'Parfum Prestigium',
    price: 45000,
    quantity: 1,
    image: 'https://api.bylin-style.com/storage/products/exemple.jpg'
  }
]);

const cartTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// const toggleCart = () => {
//   isCartOpen.value = !isCartOpen.value;
// };
</script>

<template>
  <div class="w-full">
    <div class="hidden lg:block bg-primary-200 dark:bg-primary-950 border-b border-primary-200 dark:border-primary-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-2 text-xs text-gray-600 dark:text-gray-400">
          <div class="flex space-x-2">
            <UIcon name="i-heroicons-truck" />
            <span>LIVRAISON OFFERTE DANS COTONOU À PARTIR DE 100 000 CFA</span>
          </div>
          <div class="flex items-center gap-6">
            <span>FR / BENIN</span>
            <NuxtLink to="/bylin" class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              A propos de bylin
            </NuxtLink>
            <NuxtLink to="/contact" class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Service client
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <header
      class="bg-primary-500 dark:bg-primary-900 border-b border-primary-200 dark:border-primary-800 sticky top-0 z-50">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 lg:h-20">
          <UButton icon="i-heroicons-bars-3" color="neutral" variant="ghost" class="lg:hidden" @click="toggleMobileMenu"
            aria-label="Menu" />

          <UButton icon="i-heroicons-magnifying-glass" variant="ghost" class="hidden lg:flex text-white cursor-pointer"
            label="Rechercher" />

          <NuxtLink to="/"
            class="flex flex-col items-center text-xl lg:text-2xl font-bold uppercase tracking-wider text-white hover:opacity-80 transition-opacity">
            <img src="~/assets/images/logo-white.png" alt="Logo bylin" class="w-[30%]">
            <span class="text-[8px] font-normal tracking-wide">Cotonou</span>
          </NuxtLink>

          <div class="flex items-center gap-2 lg:gap-4">
            <UDropdownMenu :items="items_users">
              <UButton icon="i-heroicons-user" color="neutral" variant="ghost" class="text-white hover:text-black" />
            </UDropdownMenu>
            <UButton :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              :color="colorMode.value === 'dark' ? 'neutral' : 'warning'" variant="ghost"
              @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'" />

            <!-- Slideover pour le panier -->
            <USlideover :title="cartItems.length > 0 ? 'Mon Panier' : 'Panier'"
              :description="cartItems.length > 0 ? `${cartItems.length} article${cartItems.length > 1 ? 's' : ''} dans votre panier` : 'Votre panier est actuellement vide'">
              <!-- Trigger : Bouton avec Badge -->
              <UChip :text="cartItems.length" :show="cartItems.length > 0" color="error" inset>
                <UButton icon="i-heroicons-shopping-bag" color="neutral" variant="ghost"
                  class="text-white hover:text-black" aria-label="Panier" />
              </UChip>

              <!-- Contenu du body -->
              <template #body>
                <!-- Cas : Panier avec articles -->
                <div v-if="cartItems.length > 0" class="divide-y divide-gray-200 dark:divide-gray-800 -mx-4 sm:-mx-6">
                  <div v-for="(item, index) in cartItems" :key="item.id" class="p-4 sm:px-6 flex gap-4">
                    <div
                      class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                      <img :src="item.image" :alt="item.name" class="h-full w-full object-cover object-center" />
                    </div>

                    <div class="flex flex-1 flex-col">
                      <div>
                        <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                          <h3>
                            <NuxtLink to="#">{{ item.name }}</NuxtLink>
                          </h3>
                          <p class="ml-4">{{ (item.price * item.quantity).toLocaleString() }} CFA</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Parfum</p>
                      </div>
                      <div class="flex flex-1 items-end justify-between text-sm">
                        <div class="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md">
                          <UButton icon="i-heroicons-minus" size="2xs" color="neutral" variant="ghost"
                            :disabled="item.quantity <= 1" @click="item.quantity--" />
                          <span class="w-4 text-center">{{ item.quantity }}</span>
                          <UButton icon="i-heroicons-plus" size="2xs" color="neutral" variant="ghost"
                            @click="item.quantity++" />
                        </div>

                        <UButton icon="i-heroicons-trash" color="error" variant="ghost" label="Retirer" size="xs"
                          @click="cartItems.splice(index, 1)" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Cas : Panier vide -->
                <div v-else class="flex flex-col items-center justify-center h-full py-12">
                  <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <UIcon name="i-heroicons-shopping-cart" class="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Votre panier est vide</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                    On dirait que vous n'avez pas encore ajouté d'articles. Explorez nos collections pour trouver votre
                    bonheur !
                  </p>
                </div>
              </template>

              <!-- Footer : Résumé et Action (visible uniquement si panier non vide) -->
              <template #footer="{ close }" v-if="cartItems.length > 0">
                <div class="pt-6">
                  <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                    <p>Sous-total</p>
                    <p>{{ cartTotal.toLocaleString() }} CFA</p>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Frais de port et taxes calculés à la caisse.
                  </p>
                  <UButton block size="lg" color="primary" label="Commander" />
                  <div class="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      ou
                      <UButton variant="link" color="primary" :padded="false" @click="close">
                        Continuer mes achats <span aria-hidden="true"> &rarr;</span>
                      </UButton>
                    </p>
                  </div>
                </div>
              </template>
            </USlideover>
          </div>
        </div>

        <nav class="hidden lg:block border-t border-primary-200 dark:border-primary-800">
          <ul class="flex justify-center gap-10 py-4">
            <!-- Ensure navigation is array before iterating just in case -->
            <li v-for="(item, index) in navigation" :key="index" class="relative group">
              <NuxtLink :to="item.url"
                class="text-xs font-semibold uppercase tracking-wider text-white dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors pb-1 border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100">
                {{ item.label }}
              </NuxtLink>

              <NavigationMegaMenuOverlay v-if="item.mega_menu && item.mega_menu.length > 0" 
                :columns="item.mega_menu" />
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <UModal v-model:open="isMobileMenuOpen" :ui="{ width: 'w-full sm:max-w-md' }">
      <template #body>
        <div class="p-6">
          <UInput icon="i-heroicons-magnifying-glass" size="lg" placeholder="Rechercher" class="mb-6" />

          <!-- Adaptation du Mobile Menu pour la structure API -->
          <UAccordion :items="navigation.map((item: any, index: any) => ({
            label: item.label,
            slot: `item-${index}`,
            defaultOpen: false
          }))" :ui="{ item: { base: 'border-b border-gray-200 dark:border-gray-800' } }">
            <template v-for="(item, index) in navigation" :key="index" #[`item-${index}`]>
              <NuxtLink v-if="!item.mega_menu || item.mega_menu.length === 0" :to="item.url" @click="toggleMobileMenu"
                class="block py-4 text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">
                {{ item.label }}
              </NuxtLink>

              <div v-else class="space-y-2 pb-4">
                <template v-for="(col, cIndex) in item.mega_menu" :key="cIndex">
                  <div v-if="col.type === 'links' && col.links">
                    <p class="text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2 mt-4">
                      {{ col.title }}
                    </p>
                    <ul class="space-y-2 pl-4">
                      <li v-for="link in col.links" :key="link.label">
                        <NuxtLink :to="link.url" @click="toggleMobileMenu"
                          class="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                          {{ link.label }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </template>
                <NuxtLink v-if="item.mega_menu[0]?.bottom_link" :to="item.mega_menu[0].bottom_link.url"
                  @click="toggleMobileMenu" class="block text-sm underline text-gray-700 dark:text-gray-300 mt-4">
                  {{ item.mega_menu[0].bottom_link.label }}
                </NuxtLink>
              </div>
            </template>
          </UAccordion>

          <div class="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-start gap-4">
            <UIcon name="i-heroicons-shopping-bag" class="text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
            <div class="text-xs">
              <strong class="block text-gray-900 dark:text-gray-100">Livraison offerte* à partir de 140€</strong>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>