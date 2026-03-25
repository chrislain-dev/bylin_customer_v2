<template>
  <UModal v-model:open="isOpen">
      <button @click="isOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-black">
        <Icon name="heroicons:x-mark" class="w-6 h-6" />
      </button>

      <template #content>
        <div class="p-6 bg-white rounded-lg shadow-xl relative max-w-lg w-full mx-auto" v-if="product">
          <div class="flex gap-6">
            <!-- Thumbnail -->
            <div class="w-1/3 flex-shrink-0">
              <img :src="product.thumbnail_url || product.media?.[0]?.original_url || 'https://placehold.co/400x600?text=No+Image'" 
                  class="w-full h-auto object-cover rounded aspect-[3/4]" :alt="product.name">
            </div>

            <!-- Info & Options -->
            <div class="flex-1 space-y-4">
              <div>
                <h3 class="font-syne font-bold text-lg mb-1">{{ product.name }}</h3>
                <div class="flex items-baseline gap-2">
                  <span class="font-mono text-lg font-bold text-[#0066bf]">{{ formatPrice(product.price) }}</span>
                  <span v-if="product.compare_price" class="text-xs text-gray-400 line-through font-mono">
                    {{ formatPrice(product.compare_price) }}
                  </span>
                </div>
              </div>

              <!-- Variations -->
              <div v-if="availableSizes.length > 0">
                <label class="block text-xs font-bold uppercase mb-2">Taille</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="size in availableSizes" :key="size" 
                    @click="selectedSize = size"
                    class="w-10 h-10 border flex items-center justify-center text-xs transition-colors"
                    :class="selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <div v-if="availableShoeSizes.length > 0">
                <label class="block text-xs font-bold uppercase mb-2">Pointure</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="size in availableShoeSizes" :key="size" 
                    @click="selectedShoeSize = size"
                    class="w-12 h-12 border flex items-center justify-center text-sm transition-colors"
                    :class="selectedShoeSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <div v-if="availableColors.length > 0">
                <label class="block text-xs font-bold uppercase mb-2">Couleur</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="color in availableColors" :key="color" 
                    @click="selectedColor = color"
                    class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center relative"
                    :class="{ 'ring-2 ring-offset-2 ring-black': selectedColor === color }"
                  >
                    <span class="w-full h-full rounded-full border border-black/5" :style="{ backgroundColor: getColorHex(color) }"></span>
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <button @click="addToCart" :disabled="!canAddToCart"
                class="w-full py-3 bg-[#0066bf] text-white font-bold uppercase text-xs tracking-wider hover:bg-[#005bb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                {{ buttonText }}
              </button>
            </div>
          </div>
        </div>
      </template>

  </UModal>
</template>

<script setup lang="ts">
import type { Product, ProductVariation } from '~/types/product'

const props = defineProps<{
  // No props needed as we control via exposed methods/refs usually, but usually quickview acts on a product.
  // We can use a global store or expose a method to open.
  // For simplicity, let's assume parent passes down or we use defineModel if meant to be controlled by parent directly, 
  // but here we want to be triggered.
}>()

const isOpen = defineModel<boolean>('open')
const product = defineModel<Product | null>('product')

const emit = defineEmits<{
  'add-to-cart': [payload: any]
}>()

const selectedSize = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectedShoeSize = ref<string | null>(null)

// Reset selection when product changes
watch(product, (newVal) => {
  if (newVal) {
    selectedSize.value = null
    selectedColor.value = null
    selectedShoeSize.value = null
    // Auto-select defaults
    if (availableSizes.value.length > 0) selectedSize.value = availableSizes.value[0]
    if (availableColors.value.length > 0) selectedColor.value = availableColors.value[0]
    if (availableShoeSizes.value.length > 0) selectedShoeSize.value = availableShoeSizes.value[0]
  }
})

// Helpers (Same as Info.vue but simplified)
const availableSizes = computed(() => {
  if (!product.value?.variations) return []
  const sizes = new Set<string>()
  product.value.variations.forEach(v => {
    if (v.attributes?.size && v.is_active) sizes.add(v.attributes.size)
  })
  return Array.from(sizes)
})

const availableShoeSizes = computed(() => {
  if (!product.value?.variations) return []
  const sizes = new Set<string>()
  product.value.variations.forEach(v => {
    if (v.attributes?.shoe_size && v.is_active) sizes.add(v.attributes.shoe_size)
  })
  return Array.from(sizes).sort((a, b) => Number(a) - Number(b))
})

const availableColors = computed(() => {
  if (!product.value?.variations) return []
  const colors = new Set<string>()
  product.value.variations.forEach(v => {
    if (v.attributes?.color && v.is_active) colors.add(v.attributes.color)
  })
  return Array.from(colors)
})

const selectedVariation = computed(() => {
   if (!product.value?.variations) return null
   return product.value.variations.find(v => {
      const matchSize = !selectedSize.value || v.attributes?.size === selectedSize.value
      const matchColor = !selectedColor.value || v.attributes?.color === selectedColor.value
      const matchShoeSize = !selectedShoeSize.value || v.attributes?.shoe_size === selectedShoeSize.value
      return matchSize && matchColor && matchShoeSize && v.is_active
   }) || null
})

const canAddToCart = computed(() => {
  if (!product.value) return false
  if (product.value.is_variable) {
    return selectedVariation.value && selectedVariation.value.stock_quantity > 0
  }
  return product.value.stock_quantity > 0
})

const buttonText = computed(() => {
  if (!product.value) return ''
  if (product.value.is_variable && !selectedVariation.value) return 'Sélectionner une option'
   if (product.value.stock_quantity <= 0 && !product.value.is_variable) return 'Rupture de stock'
   if (product.value.is_variable && selectedVariation.value?.stock_quantity <= 0) return 'Rupture de stock'
  return 'Ajouter au panier'
})

const addToCart = () => {
    if (!product.value) return
    emit('add-to-cart', {
        product: product.value,
        variation: selectedVariation.value,
        quantity: 1
    })
    isOpen.value = false
}



// Use dynamic color hex from store when possible
const productStore = useProducts()

const getColorHex = (name: string) => {
  // First try to find from store colors
  const storeColor = productStore.allColors.value.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  )
  if (storeColor?.hex_code) return storeColor.hex_code
  
  // Fallback to common color map
  const fallbackMap: Record<string, string> = {
    'noir': '#000000', 'blanc': '#FFFFFF', 'rouge': '#FF4444', 'bleu': '#2563EB',
    'vert': '#16A34A', 'beige': '#F5F5DC', 'gris': '#6B7280', 'rose': '#EC4899',
    'jaune': '#FBBF24', 'orange': '#F97316', 'violet': '#8B5CF6', 'marron': '#92400E',
    'black': '#000000', 'white': '#FFFFFF', 'red': '#FF4444', 'blue': '#2563EB',
    'green': '#16A34A', 'gray': '#6B7280', 'pink': '#EC4899', 'yellow': '#FBBF24',
    'purple': '#8B5CF6', 'brown': '#92400E'
  }
  return fallbackMap[name.toLowerCase()] || '#CCCCCC'
}

</script>
