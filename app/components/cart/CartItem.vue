<script setup lang="ts">
import type { CartItem } from '~/types/cart'

const props = defineProps<{
  item: CartItem
}>()

const cartStore = useCartStore()

// Computed
const imageUrl = computed(() => {
  return props.item.product.media?.[0]?.original_url || null
})

const hasImage = computed(() => !!imageUrl.value)

const variationLabel = computed(() => {
  if (!props.item.variation) return null
  const attrs = props.item.variation.attributes || {}
  const parts = []
  if (attrs.color) parts.push(attrs.color)
  if (attrs.size) parts.push(`Taille ${attrs.size}`)
  if (attrs.shoe_size) parts.push(`Pointure ${attrs.shoe_size}`)
  return parts.length > 0 ? parts.join(' • ') : null
})

const maxStock = computed(() => {
  return props.item.variation 
    ? props.item.variation.stock_quantity 
    : props.item.product.stock_quantity
})

const isLowStock = computed(() => {
  return maxStock.value <= 5 && maxStock.value > 0
})

// Discount
const hasDiscount = computed(() => {
  const product = props.item.product
  return product.compare_at_price && product.compare_at_price > product.price
})

const discountPercentage = computed(() => {
  if (!hasDiscount.value) return 0
  const original = props.item.product.compare_at_price!
  const current = props.item.unit_price
  return Math.round(((original - current) / original) * 100)
})
</script>

<template>
  <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div class="flex gap-4 md:gap-6">
      <!-- Product Image -->
      <NuxtLink 
        :to="`/products/${item.product.slug}`" 
        class="flex-shrink-0 relative">
        <div class="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100">
          <img 
            v-if="hasImage" 
            :src="imageUrl!" 
            :alt="item.product.name"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="heroicons:photo" class="w-10 h-10 text-gray-300" />
          </div>
        </div>
        <!-- Discount Badge -->
        <span 
          v-if="hasDiscount" 
          class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{{ discountPercentage }}%
        </span>
      </NuxtLink>

      <!-- Product Details -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <!-- Name & Variation -->
          <div class="min-w-0">
            <NuxtLink 
              :to="`/products/${item.product.slug}`"
              class="text-sm md:text-base font-medium text-gray-900 hover:text-black transition-colors line-clamp-2">
              {{ item.product.name }}
            </NuxtLink>
            <p v-if="variationLabel" class="text-xs text-gray-500 mt-1">
              {{ variationLabel }}
            </p>
            <!-- Low Stock Warning -->
            <p v-if="isLowStock" class="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <Icon name="heroicons:exclamation-triangle" class="w-3 h-3" />
              Plus que {{ maxStock }} en stock
            </p>
          </div>

          <!-- Unit Price -->
          <div class="flex items-center gap-2 md:text-right">
            <span v-if="hasDiscount" class="text-xs text-gray-400 line-through">
              {{ formatPrice(item.product.compare_at_price!) }}
            </span>
            <span class="text-sm font-medium text-gray-700">
              {{ formatPrice(item.unit_price) }}
            </span>
          </div>
        </div>

        <!-- Quantity & Actions Row -->
        <div class="flex items-center justify-between mt-4">
          <!-- Quantity Selector -->
          <div class="flex items-center">
            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button 
                @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <Icon name="heroicons:minus" class="w-4 h-4" />
              </button>
              <span class="w-12 text-center text-sm font-medium text-gray-800">
                {{ item.quantity }}
              </span>
              <button 
                @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                :disabled="item.quantity >= maxStock"
                class="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <Icon name="heroicons:plus" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Subtotal & Remove -->
          <div class="flex items-center gap-4">
            <span class="text-base md:text-lg font-bold text-gray-900">
              {{ formatPrice(item.subtotal) }}
            </span>
            <button 
              @click="cartStore.removeItem(item.id)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Supprimer">
              <Icon name="heroicons:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
