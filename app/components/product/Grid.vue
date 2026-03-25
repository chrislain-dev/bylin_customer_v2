<template>
  <div :class="[
    viewMode === 'list' 
      ? 'space-y-4' 
      : 'grid gap-6',
    viewMode === 'grid' && {
      'grid-cols-1 sm:grid-cols-2': columns === 2,
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': columns === 3,
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': columns === 4
    }
  ]">
    <ProductCard 
      v-for="product in products" 
      :key="product.id" 
      :product="product" 
      :view-mode="viewMode"
      @open-quickview="$emit('open-quickview', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import ProductCard from './Card.vue'

withDefaults(defineProps<{
  products: Product[]
  columns?: 2 | 3 | 4
  viewMode?: 'grid' | 'list'
}>(), {
  columns: 4,
  viewMode: 'grid'
})

defineEmits<{
  'open-quickview': [product: Product]
}>()
</script>