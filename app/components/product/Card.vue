<template>
  <div :class="[
    'group relative bg-white overflow-hidden transition-all duration-300 border border-gray-100',
    viewMode === 'list' ? 'flex flex-row h-48 rounded-lg' : 'block rounded-xl h-full hover:shadow-lg'
  ]">
    
    <!-- Image Container -->
    <div :class="[
      'bg-gray-100 relative overflow-hidden',
      viewMode === 'list' ? 'w-48 h-full flex-shrink-0' : 'aspect-[3/4] w-full'
    ]">
      <NuxtLink :to="`/products/${product.slug}`" class="block w-full h-full">
        <img :src="product.thumbnail_url || product.media?.[0]?.original_url || 'https://placehold.co/400x600?text=No+Image'"
          :alt="product.name"
          class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy" />
      </NuxtLink>

      <!-- Wishlist Button -->
      <button @click.prevent="toggleWishlist" 
        class="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
        :class="{ 'text-red-500 opacity-100': isInWishlist }"
        title="Ajouter aux favoris"
      >
        <Icon :name="isInWishlist ? 'heroicons:heart-solid' : 'heroicons:heart'" class="w-5 h-5" />
      </button>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
        <span v-if="product.is_new"
          class="px-2 py-1 bg-black text-white text-[10px] uppercase font-bold tracking-wider rounded-sm">
          Nouveau
        </span>
        <span v-if="product.is_on_sale"
          class="px-2 py-1 bg-[#D32F2F] text-white text-[10px] uppercase font-bold tracking-wider rounded-sm">
          -{{ discountPercentage }}%
        </span>
         <span v-if="product.stock_quantity <= 0 && !product.is_preorder_enabled"
          class="px-2 py-1 bg-gray-500 text-white text-[10px] uppercase font-bold tracking-wider rounded-sm">
          Épuisé
        </span>
      </div>

       <!-- Quick Add Button (Grid Only) -->
       <div v-if="viewMode === 'grid'" class="absolute bottom-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
        <button @click.prevent="openQuickView"
          class="bg-white text-black p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-110 flex items-center justify-center"
          title="Ajouter au panier">
          <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col" :class="viewMode === 'list' ? 'p-6 flex-1 justify-between' : 'p-4 space-y-2'">
      <div>
        <!-- Brand & Collection -->
        <div class="flex items-center justify-between text-[11px] text-gray-500 font-medium uppercase tracking-wide mb-1">
          <span>{{ product.brand?.name }}</span>
          <span v-if="product.collection_id" class="text-gray-400">Collection</span>
        </div>

        <!-- Title -->
        <NuxtLink :to="`/products/${product.slug}`">
          <h3 class="font-semibold text-gray-900 group-hover:text-[#0066bf] transition-colors"
            :class="viewMode === 'list' ? 'text-xl mb-2' : 'text-sm line-clamp-2 leading-snug'">
            {{ product.name }}
          </h3>
        </NuxtLink>
        
        <!-- Description (List Only) -->
        <p v-if="viewMode === 'list'" class="text-sm text-gray-500 line-clamp-2 mb-4">
          {{ product.short_description || product.description }}
        </p>
      </div>

      <div class="flex items-center justify-between mt-auto">
        <!-- Price -->
        <div class="flex items-baseline gap-2 pt-1">
          <span class="font-mono font-bold text-gray-900" :class="viewMode === 'list' ? 'text-xl' : 'text-base'">
            {{ formatPrice(product.price) }}
          </span>
          <span v-if="product.compare_price" class="text-xs text-gray-400 line-through font-mono">
            {{ formatPrice(product.compare_price) }}
          </span>
        </div>

         <!-- Add to Cart (List Only) -->
         <button v-if="viewMode === 'list'" 
            @click.prevent="openQuickView"
            class="px-6 py-2 bg-[#0066bf] text-white text-sm font-bold uppercase tracking-wide rounded hover:bg-[#005bb5] transition-colors">
            Ajouter au panier
         </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = withDefaults(defineProps<{
  product: Product
  viewMode?: 'grid' | 'list'
}>(), {
  viewMode: 'grid'
})

const emit = defineEmits<{
  'open-quickview': [product: Product]
}>()

const wishlist = useWishlist()

const isInWishlist = computed(() => wishlist.isInWishlist(props.product.id))

const toggleWishlist = () => {
  wishlist.toggleWishlist(props.product.id)
}

const openQuickView = () => {
  emit('open-quickview', props.product)
}



const discountPercentage = computed(() => {
  if (props.product.compare_price && props.product.compare_price > props.product.price) {
    return Math.round(((props.product.compare_price - props.product.price) / props.product.compare_price) * 100)
  }
  return 0
})
</script>