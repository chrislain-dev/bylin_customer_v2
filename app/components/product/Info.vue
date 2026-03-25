<template>
  <div class="sticky top-32 space-y-8">

    <!-- Header with Favorites -->
    <div class="border-b border-black/10 dark:border-white/10 pb-6">
      <div class="flex justify-between items-start mb-2">
        <h1 class="text-3xl md:text-4xl font-black uppercase leading-none">{{ product.name }}</h1>
        <div class="text-right flex items-start gap-4">
          <!-- Favorites Button -->
          <button 
            @click="toggleFavorite" 
            class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
            :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          >
            <Icon 
              :name="isFavorite ? 'heroicons:heart-solid' : 'heroicons:heart'" 
              class="w-6 h-6 transition-all"
              :class="isFavorite ? 'text-red-500 scale-110' : 'text-gray-400 group-hover:text-red-400'"
            />
          </button>
          <div>
            <span class="font-mono text-xl font-bold text-[#0066bf] block">{{
              formatPrice(product.price) }}</span>
            <span v-if="product.compare_price" class="font-mono text-sm line-through opacity-50">
              {{ formatPrice(product.compare_price) }}
            </span>
          </div>
        </div>
      </div>
      <p class="font-mono text-xs opacity-60 uppercase">{{ product.brand?.name }} — {{ product.sku }}</p>

      <!-- Badges -->
      <div class="flex items-center gap-2 mt-3 flex-wrap">
        <span v-if="product.is_featured"
          class="px-2 py-0.5 bg-[#0066bf] text-white text-[9px] font-mono uppercase">Featured</span>
        <span v-if="product.is_new"
          class="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[9px] font-mono uppercase">New</span>
        <span v-if="product.status === 'preorder'"
          class="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-mono uppercase">Précommande</span>
        <span v-if="product.rating_count > 0" class="flex items-center gap-1 text-sm">
          <span class="text-yellow-500">★</span>
          <span class="font-mono text-xs">{{ product.rating_average }} ({{ product.rating_count
            }})</span>
        </span>
      </div>
    </div>

    <!-- Description -->
    <div>
      <p v-if="product.short_description" class="font-bold text-sm mb-2">{{ product.short_description }}</p>
      <p class="font-mono text-sm leading-relaxed opacity-80 text-justify">{{ product.description }}</p>
    </div>

    <!-- Sélecteur Couleur (si variations disponibles) -->
    <div v-if="availableColors.length > 0">
      <div class="flex justify-between mb-2 font-mono text-xs uppercase">
        <span>Couleur</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-for="color in availableColors" :key="color" @click="selectedColor = color"
          class="px-4 py-2 border border-black/20 dark:border-white/20 hover:border-[#0066bf] transition-all font-mono text-xs"
          :class="selectedColor === color ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black border-[#0066bf]' : ''">
          {{ color }}
        </button>
      </div>
    </div>

    <!-- Sélecteur Taille (si variations disponibles) -->
    <div v-if="availableSizes.length > 0">
      <div class="flex justify-between mb-2 font-mono text-xs uppercase">
        <span>Taille</span>
        <button @click="showSizeGuide = true" class="underline decoration-[#0066bf]">Guide des tailles</button>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button v-for="size in availableSizes" :key="size" @click="selectedSize = size"
          class="border border-black/20 dark:border-white/20 py-3 hover:bg-[#0066bf] hover:text-white hover:border-[#0066bf] transition-all"
          :class="selectedSize === size ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black' : ''">
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Sélecteur Pointure (si variations disponibles) -->
    <div v-if="availableShoeSizes.length > 0">
      <div class="flex justify-between mb-2 font-mono text-xs uppercase">
        <span>Pointure</span>
        <button @click="showSizeGuide = true" class="underline decoration-[#0066bf]">Guide des pointures</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-for="shoeSize in availableShoeSizes" :key="shoeSize" @click="selectedShoeSize = shoeSize"
          class="w-12 h-12 border border-black/20 dark:border-white/20 hover:bg-[#0066bf] hover:text-white hover:border-[#0066bf] transition-all font-mono text-sm flex items-center justify-center"
          :class="selectedShoeSize === shoeSize ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black' : ''">
          {{ shoeSize }}
        </button>
      </div>
    </div>

    <!-- Stock Info -->
    <div v-if="selectedVariation" class="font-mono text-xs">
      <span v-if="selectedVariation.stock_quantity > 0" class="text-green-600">
        ✓ En stock ({{ selectedVariation.stock_quantity }} disponibles)
      </span>
      <span v-else class="text-red-500">
        ✗ Rupture de stock
      </span>
    </div>
    <div v-else-if="!product.is_variable && product.stock_quantity > 0" class="font-mono text-xs text-green-600">
      ✓ En stock ({{ product.stock_quantity }} disponibles)
    </div>

    <!-- Quantity Selector -->
    <div class="space-y-2">
      <span class="font-mono text-xs uppercase">Quantité</span>
      <div class="flex items-center gap-4">
        <div class="flex items-center border border-black/20 dark:border-white/20">
          <button 
            @click="decreaseQuantity"
            :disabled="quantity <= 1"
            class="w-12 h-12 flex items-center justify-center hover:bg-[#0066bf] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
          >
            <Icon name="heroicons:minus" class="w-4 h-4" />
          </button>
          <input 
            type="number" 
            v-model.number="quantity"
            @blur="validateQuantity"
            min="1"
            :max="maxStock"
            class="w-16 h-12 text-center font-mono bg-transparent border-x border-black/20 dark:border-white/20 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button 
            @click="increaseQuantity"
            :disabled="quantity >= maxStock"
            class="w-12 h-12 flex items-center justify-center hover:bg-[#0066bf] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
          >
            <Icon name="heroicons:plus" class="w-4 h-4" />
          </button>
        </div>
        <!-- Subtotal -->
        <div v-if="quantity > 1" class="font-mono text-sm">
          Sous-total: <span class="font-bold text-[#0066bf]">{{ formatPrice(subtotal) }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-3 pt-4">
      <button @click="addToCart" :disabled="!canAddToCart"
        class="w-full bg-[#0066bf] text-white py-4 font-mono text-sm uppercase tracking-widest hover:bg-[#005bb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {{ buttonText }}
      </button>
      <p class="text-center font-mono text-[10px] opacity-50 uppercase">
        Expédition sous 48h depuis Cotonou
      </p>
    </div>

    <!-- Accordéons -->
    <div class="border-t border-black/10 dark:border-white/10 pt-4 space-y-4">
      
      <!-- Spécifications -->
      <div v-if="hasSpecifications" class="cursor-pointer" @click="showSpecs = !showSpecs">
        <div class="flex justify-between items-center py-2">
          <span class="font-bold uppercase text-sm">Caractéristiques</span>
          <span class="text-xl" :class="showSpecs ? 'text-[#0066bf]' : ''">{{ showSpecs ? '−' : '+' }}</span>
        </div>
        <div v-show="showSpecs" class="pb-4">
          <table class="w-full text-sm font-mono">
            <tbody>
              <tr v-if="product.weight" class="border-b border-black/5 dark:border-white/5">
                <td class="py-2 opacity-60">Poids</td>
                <td class="py-2 text-right">{{ product.weight }} kg</td>
              </tr>
              <tr v-if="product.dimensions" class="border-b border-black/5 dark:border-white/5">
                <td class="py-2 opacity-60">Dimensions</td>
                <td class="py-2 text-right">
                  {{ product.dimensions.length }} × {{ product.dimensions.width }} × {{ product.dimensions.height }} {{ product.dimensions.unit }}
                </td>
              </tr>
              <tr v-if="product.sku" class="border-b border-black/5 dark:border-white/5">
                <td class="py-2 opacity-60">Référence</td>
                <td class="py-2 text-right">{{ product.sku }}</td>
              </tr>
              <tr v-if="product.brand" class="border-b border-black/5 dark:border-white/5">
                <td class="py-2 opacity-60">Marque</td>
                <td class="py-2 text-right">{{ product.brand.name }}</td>
              </tr>
              <tr v-if="product.requires_authenticity">
                <td class="py-2 opacity-60">Authenticité</td>
                <td class="py-2 text-right text-green-600">✓ Garantie</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="cursor-pointer" @click="showDetails = !showDetails">
        <div class="flex justify-between items-center py-2">
          <span class="font-bold uppercase text-sm">Composition & Entretien</span>
          <span class="text-xl" :class="showDetails ? 'text-[#0066bf]' : ''">{{ showDetails ? '−' :
            '+' }}</span>
        </div>
        <div v-show="showDetails" class="pb-4 font-mono text-xs opacity-70">
          <p>{{ product.description }}</p>
        </div>
      </div>

      <div class="cursor-pointer" @click="showDelivery = !showDelivery">
        <div class="flex justify-between items-center py-2">
          <span class="font-bold uppercase text-sm">Livraison & Retours</span>
          <span class="text-xl" :class="showDelivery ? 'text-[#0066bf]' : ''">{{ showDelivery ? '−'
            : '+' }}</span>
        </div>
        <div v-show="showDelivery" class="pb-4 font-mono text-xs opacity-70">
          <p>Livraison offerte au Bénin. Retours sous 14 jours.</p>
        </div>
      </div>
    </div>

    <!-- Size Guide Modal -->
    <Teleport to="body">
      <div v-if="showSizeGuide" class="fixed inset-0 z-100 flex items-center justify-center p-4" @click="showSizeGuide = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
            <h3 class="text-xl font-black uppercase">Guide des tailles</h3>
            <button @click="showSizeGuide = false" class="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6 space-y-6">
            <p class="font-mono text-sm opacity-70">Retrouvez les correspondances des tailles pour nos vêtements. En cas de doute, optez pour la taille supérieure.</p>
            
            <!-- Size Chart -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-100 dark:bg-white/5">
                    <th class="px-4 py-3 text-left font-bold">Taille</th>
                    <th class="px-4 py-3 text-center">XS</th>
                    <th class="px-4 py-3 text-center">S</th>
                    <th class="px-4 py-3 text-center">M</th>
                    <th class="px-4 py-3 text-center">L</th>
                    <th class="px-4 py-3 text-center">XL</th>
                    <th class="px-4 py-3 text-center">XXL</th>
                  </tr>
                </thead>
                <tbody class="font-mono text-xs">
                  <tr class="border-b border-black/5 dark:border-white/5">
                    <td class="px-4 py-3 font-bold">Tour de poitrine (cm)</td>
                    <td class="px-4 py-3 text-center">80-84</td>
                    <td class="px-4 py-3 text-center">84-88</td>
                    <td class="px-4 py-3 text-center">88-92</td>
                    <td class="px-4 py-3 text-center">92-96</td>
                    <td class="px-4 py-3 text-center">96-100</td>
                    <td class="px-4 py-3 text-center">100-104</td>
                  </tr>
                  <tr class="border-b border-black/5 dark:border-white/5">
                    <td class="px-4 py-3 font-bold">Tour de taille (cm)</td>
                    <td class="px-4 py-3 text-center">60-64</td>
                    <td class="px-4 py-3 text-center">64-68</td>
                    <td class="px-4 py-3 text-center">68-72</td>
                    <td class="px-4 py-3 text-center">72-76</td>
                    <td class="px-4 py-3 text-center">76-80</td>
                    <td class="px-4 py-3 text-center">80-84</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 font-bold">Tour de hanches (cm)</td>
                    <td class="px-4 py-3 text-center">86-90</td>
                    <td class="px-4 py-3 text-center">90-94</td>
                    <td class="px-4 py-3 text-center">94-98</td>
                    <td class="px-4 py-3 text-center">98-102</td>
                    <td class="px-4 py-3 text-center">102-106</td>
                    <td class="px-4 py-3 text-center">106-110</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Shoe Size Chart (if applicable) -->
            <div v-if="availableShoeSizes.length > 0" class="mt-6">
              <h4 class="font-bold uppercase text-sm mb-3">Guide des pointures</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-white/5">
                      <th class="px-4 py-3 text-left font-bold">EU</th>
                      <th class="px-4 py-3 text-center">36</th>
                      <th class="px-4 py-3 text-center">37</th>
                      <th class="px-4 py-3 text-center">38</th>
                      <th class="px-4 py-3 text-center">39</th>
                      <th class="px-4 py-3 text-center">40</th>
                      <th class="px-4 py-3 text-center">41</th>
                      <th class="px-4 py-3 text-center">42</th>
                      <th class="px-4 py-3 text-center">43</th>
                      <th class="px-4 py-3 text-center">44</th>
                    </tr>
                  </thead>
                  <tbody class="font-mono text-xs">
                    <tr>
                      <td class="px-4 py-3 font-bold">Longueur pied (cm)</td>
                      <td class="px-4 py-3 text-center">22.5</td>
                      <td class="px-4 py-3 text-center">23.5</td>
                      <td class="px-4 py-3 text-center">24</td>
                      <td class="px-4 py-3 text-center">24.5</td>
                      <td class="px-4 py-3 text-center">25</td>
                      <td class="px-4 py-3 text-center">26</td>
                      <td class="px-4 py-3 text-center">26.5</td>
                      <td class="px-4 py-3 text-center">27.5</td>
                      <td class="px-4 py-3 text-center">28</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p class="text-xs opacity-50 font-mono">Ces mesures sont données à titre indicatif et peuvent varier selon les modèles.</p>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import type { Product, ProductVariation } from '~/types/product'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  'add-to-cart': [product: Product & { selectedSize?: string; selectedColor?: string; selectedShoeSize?: string; selectedVariation?: ProductVariation; quantity: number }]
}>()

const toast = useToast()
const { isInWishlist, toggleWishlist } = useWishlist()

const selectedSize = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectedShoeSize = ref<string | null>(null)
const quantity = ref(1)
const showDetails = ref(false)
const showDelivery = ref(false)
const showSpecs = ref(false)
const showSizeGuide = ref(false)

// Favorites
const isFavorite = computed(() => isInWishlist(props.product.id))

const toggleFavorite = () => {
  toggleWishlist(props.product.id)
  toast.add({
    title: isFavorite.value ? 'Retiré des favoris' : 'Ajouté aux favoris',
    description: isFavorite.value 
      ? `${props.product.name} a été retiré de vos favoris`
      : `${props.product.name} a été ajouté à vos favoris`,
    color: isFavorite.value ? 'info' : 'success',
    icon: isFavorite.value ? 'heroicons:heart' : 'heroicons:heart-solid',
  })
}

// Extraire les tailles disponibles des variations
const availableSizes = computed(() => {
  if (!props.product.variations || props.product.variations.length === 0) {
    return []
  }
  const sizes = new Set<string>()
  props.product.variations.forEach(v => {
    if (v.attributes?.size) {
      sizes.add(v.attributes.size)
    }
  })
  return Array.from(sizes)
})

// Extraire les couleurs disponibles des variations
const availableColors = computed(() => {
  if (!props.product.variations || props.product.variations.length === 0) {
    return []
  }
  const colors = new Set<string>()
  props.product.variations.forEach(v => {
    if (v.attributes?.color) {
      colors.add(v.attributes.color)
    }
  })
  return Array.from(colors)
})

// Extraire les pointures disponibles des variations
const availableShoeSizes = computed(() => {
  if (!props.product.variations || props.product.variations.length === 0) {
    return []
  }
  const shoeSizes = new Set<string>()
  props.product.variations.forEach(v => {
    if (v.attributes?.shoe_size) {
      shoeSizes.add(v.attributes.shoe_size)
    }
  })
  return Array.from(shoeSizes).sort((a, b) => Number(a) - Number(b))
})

// Trouver la variation sélectionnée
const selectedVariation = computed((): ProductVariation | null => {
  if (!props.product.variations || props.product.variations.length === 0) {
    return null
  }

  return props.product.variations.find(v => {
    const matchesSize = !selectedSize.value || v.attributes?.size === selectedSize.value
    const matchesColor = !selectedColor.value || v.attributes?.color === selectedColor.value
    const matchesShoeSize = !selectedShoeSize.value || v.attributes?.shoe_size === selectedShoeSize.value
    return matchesSize && matchesColor && matchesShoeSize && v.is_active
  }) || null
})

// Max stock available
const maxStock = computed(() => {
  if (selectedVariation.value) {
    return selectedVariation.value.stock_quantity
  }
  return props.product.stock_quantity || 99
})

// Subtotal
const subtotal = computed(() => {
  const price = selectedVariation.value?.price || props.product.price
  return price * quantity.value
})

// Has specifications to show
const hasSpecifications = computed(() => {
  return props.product.weight || props.product.dimensions || props.product.requires_authenticity
})

// Quantity controls
const increaseQuantity = () => {
  if (quantity.value < maxStock.value) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const validateQuantity = () => {
  if (quantity.value < 1) quantity.value = 1
  if (quantity.value > maxStock.value) quantity.value = maxStock.value
}

// Sélectionner automatiquement la première option si disponible
onMounted(() => {
  if (availableSizes.value.length > 0 && !selectedSize.value) {
    selectedSize.value = availableSizes.value[0] || null
  }
  if (availableColors.value.length > 0 && !selectedColor.value) {
    selectedColor.value = availableColors.value[0] || null
  }
  if (availableShoeSizes.value.length > 0 && !selectedShoeSize.value) {
    selectedShoeSize.value = availableShoeSizes.value[0] || null
  }
})

const canAddToCart = computed(() => {
  // Précommande toujours possible
  if (props.product.is_preorder_enabled) return true

  // Produit épuisé
  if (props.product.status === 'out_of_stock') return false

  // Produit avec variations : vérifier la variation sélectionnée
  if (props.product.is_variable) {
    return selectedVariation.value !== null && selectedVariation.value.stock_quantity > 0
  }

  // Produit simple : vérifier le stock
  return props.product.stock_quantity > 0
})

const buttonText = computed(() => {
  if (props.product.status === 'out_of_stock') return 'Épuisé'
  if (props.product.is_preorder_enabled) return 'Précommander'
  if (props.product.is_variable && !selectedVariation.value) return 'Sélectionner une option'
  if (props.product.is_variable && selectedVariation.value?.stock_quantity === 0) return 'Épuisé'
  return 'Ajouter au panier'
})

const addToCart = () => {
  emit('add-to-cart', {
    ...props.product,
    selectedSize: selectedSize.value || undefined,
    selectedColor: selectedColor.value || undefined,
    selectedShoeSize: selectedShoeSize.value || undefined,
    selectedVariation: selectedVariation.value || undefined,
    quantity: quantity.value
  })
}
</script>