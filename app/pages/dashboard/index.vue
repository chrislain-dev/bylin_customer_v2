<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900">
          Bonjour {{ authStore.fullName }} 👋
        </h1>
        <p class="mt-2 text-neutral-600">
          Bienvenue dans votre espace personnel
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Orders -->
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-neutral-600">Total Commandes</p>
              <p class="mt-2 text-3xl font-semibold text-neutral-900">{{ stats.totalOrders }}</p>
            </div>
            <div class="p-3 bg-brand-50 rounded-lg">
              <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6 text-brand-600" />
            </div>
          </div>
        </UCard>

        <!-- Total Spent -->
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-neutral-600">Total Dépensé</p>
              <p class="mt-2 text-3xl font-semibold text-neutral-900">{{ formatCurrency(stats.totalSpent) }}</p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </UCard>

        <!-- Loyalty Points -->
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-neutral-600">Points Fidélité</p>
              <p class="mt-2 text-3xl font-semibold text-neutral-900">{{ stats.loyaltyPoints }}</p>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <UIcon name="i-heroicons-star" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </UCard>

        <!-- Pending Orders -->
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-neutral-600">En Cours</p>
              <p class="mt-2 text-3xl font-semibold text-neutral-900">{{ stats.pendingOrders }}</p>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </UCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Recent Orders -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-neutral-900">Dernières Commandes</h2>
              <UButton variant="ghost" color="neutral" to="/dashboard/orders" size="sm">
                Voir tout
              </UButton>
            </div>
          </template>

          <div v-if="recentOrders.length > 0" class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id"
              class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div class="flex-1">
                <p class="font-medium text-neutral-900">Commande #{{ order.number }}</p>
                <p class="text-sm text-neutral-600">{{ order.date }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-neutral-900">{{ formatCurrency(order.total) }}</p>
                <UBadge :color="getOrderStatusColor(order.status)" variant="subtle" size="sm">
                  {{ order.status }}
                </UBadge>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <UIcon name="i-heroicons-shopping-bag" class="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p class="text-neutral-600">Aucune commande pour le moment</p>
            <UButton to="/shop" color="brand" class="mt-4">
              Découvrir la boutique
            </UButton>
          </div>
        </UCard>

        <!-- Wishlist -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-neutral-900">Mes Favoris</h2>
              <UButton variant="ghost" color="neutral" to="/wishlists" size="sm">
                Voir tout
              </UButton>
            </div>
          </template>

          <div v-if="wishlistItems.length > 0" class="space-y-4">
            <div v-for="item in wishlistItems.slice(0, 3)" :key="item.id"
              class="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-neutral-900 truncate">{{ item.name }}</p>
                <p class="text-sm font-semibold text-brand-600">{{ formatCurrency(item.price) }}</p>
              </div>
              <UButton icon="i-heroicons-shopping-cart" size="sm" color="brand" square />
            </div>
          </div>

          <div v-else class="text-center py-12">
            <UIcon name="i-heroicons-heart" class="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p class="text-neutral-600">Aucun favori pour le moment</p>
            <UButton to="/shop" color="brand" class="mt-4">
              Parcourir la boutique
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Quick Actions -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold text-neutral-900">Actions Rapides</h2>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UButton to="/shop" color="brand" size="lg" block>
            <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5" />
            Parcourir la boutique
          </UButton>
          <UButton to="/dashboard/orders" color="neutral" variant="soft" size="lg" block>
            <UIcon name="i-heroicons-list-bullet" class="w-5 h-5" />
            Mes commandes
          </UButton>
          <UButton to="/dashboard/profile" color="neutral" variant="soft" size="lg" block>
            <UIcon name="i-heroicons-user" class="w-5 h-5" />
            Mon profil
          </UButton>
          <UButton to="/contact" color="neutral" variant="soft" size="lg" block>
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" />
            Support
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: 'sanctum:auth'
})

const authStore = useAuthStore()

// Stats (à remplacer par de vraies données d'API plus tard)
const stats = ref({
  totalOrders: 12,
  totalSpent: 1250.50,
  loyaltyPoints: 340,
  pendingOrders: 2
})

// Recent orders (données mockées - à remplacer par API)
const recentOrders = ref([
  {
    id: '1',
    number: '10023',
    date: '8 Dec 2025',
    total: 89.99,
    status: 'Livrée'
  },
  {
    id: '2',
    number: '10022',
    date: '5 Dec 2025',
    total: 149.99,
    status: 'En cours'
  },
  {
    id: '3',
    number: '10021',
    date: '1 Dec 2025',
    total: 59.99,
    status: 'Livrée'
  }
])

// Wishlist items (données mockées - à remplacer par le store wishlist)
const wishlistItems = ref([
  {
    id: '1',
    name: 'Robe d\'été fleurie',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200'
  },
  {
    id: '2',
    name: 'Sac à main cuir',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200'
  },
  {
    id: '3',
    name: 'Sandales compensées',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200'
  }
])

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount)
}

const getOrderStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Livrée': 'success',
    'En cours': 'warning',
    'En préparation': 'info',
    'Annulée': 'error'
  }
  return colors[status] || 'neutral'
}
</script>