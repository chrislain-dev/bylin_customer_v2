<template>
  <div class="min-h-screen bg-[#FAFAFA] font-sans">
    <!-- Hero Section -->
    <section
      class="relative h-75 md:h-100 bg-linear-to-r from-[#1a1a1a] to-[#2a2a2a] overflow-hidden text-white">
      <div class="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
        <h1 class="text-4xl md:text-6xl font-light mb-4 font-syne">La Boutique</h1>
        <p class="text-xl opacity-80 font-light max-w-xl">
          Explorez notre collection exclusive de pièces minimalistes et intemporelles.
        </p>
      </div>
      <!-- Decorative background element -->
      <div
        class="absolute top-0 right-0 w-1/2 h-full bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none">
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-480 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <nav class="flex text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2">
              <li><NuxtLink to="/" class="hover:text-black transition-colors">Accueil</NuxtLink></li>
              <li><span class="text-gray-300">/</span></li>
              <li class="font-medium text-black">Boutique</li>
            </ol>
          </nav>
          <div class="flex items-baseline gap-3">
            <h2 class="text-xl font-medium text-gray-900">
              {{ pagination?.total || 0 }} produits
            </h2>
            <span v-if="selectedCategoryName" class="text-gray-500 text-sm">
              dans {{ selectedCategoryName }}
            </span>
          </div>
        </div>

        <button @click="showMobileFilters = true"
          class="lg:hidden flex items-center justify-center gap-2 w-full md:w-auto px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Icon name="bi:funnel" class="w-4 h-4" />
          Filtres & Tri
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar Filters (Desktop) -->
        <aside class="hidden lg:block w-72 shrink-0 space-y-10">
          
          <!-- Categories -->
          <div>
            <h3 class="font-syne font-bold text-lg mb-4">Catégories</h3>
            <ul class="space-y-2">
              <li v-for="cat in categories" :key="cat.id || 'all'">
                <button
                  @click="selectCategory(cat.id)"
                  class="text-sm transition-colors hover:text-[#0066bf] flex items-center justify-between w-full text-left py-1"
                  :class="selectedCategory === cat.id ? 'text-[#0066bf] font-medium' : 'text-gray-600'"
                >
                  {{ cat.name }}
                  <span v-if="selectedCategory === cat.id" class="w-1.5 h-1.5 rounded-full bg-[#0066bf]"></span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Prix -->
          <div>
            <h3 class="font-syne font-bold text-lg mb-4">Prix</h3>
            <div class="space-y-3">
              <div class="flex gap-3">
                <input v-model.number="priceRange.min" type="number" placeholder="Min"
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-black transition-colors" />
                <input v-model.number="priceRange.max" type="number" placeholder="Max"
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <button @click="applyFilters" 
                class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase tracking-wide rounded transition-colors text-gray-800">
                Appliquer
              </button>
            </div>
          </div>

          <!-- Couleurs -->
          <div v-if="colors.length > 0">
            <h3 class="font-syne font-bold text-lg mb-4">Couleurs</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="color in colors" :key="color.id"
                @click="toggleColor(color.name)"
                class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 relative"
                :class="{ 'ring-2 ring-offset-2 ring-black': selectedColors.includes(color.name) }"
                :title="color.name"
              >
                <span class="w-6 h-6 rounded-full block border border-black/5" :style="{ backgroundColor: color.hex_code }"></span>
              </button>
            </div>
          </div>

          <!-- Tailles -->
          <div v-if="sizes.length > 0">
            <h3 class="font-syne font-bold text-lg mb-4">Tailles</h3>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="size in sizes" :key="size.id"
                @click="toggleSize(size.name)"
                class="px-2 py-2 text-xs border rounded transition-all"
                :class="selectedSizes.includes(size.name) 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
              >
                {{ size.name }}
              </button>
            </div>
          </div>

          <!-- Marques -->
          <div v-if="brands.length > 0">
            <h3 class="font-syne font-bold text-lg mb-4">Marques</h3>
            <ul class="space-y-2">
              <li v-for="brand in brands" :key="brand.id || 'all-brands'">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center">
                    <input type="checkbox" 
                      :checked="selectedBrand === brand.id"
                      @change="selectBrand(brand.id)"
                      class="peer h-4 w-4 opacity-0 absolute" 
                    />
                    <div class="w-4 h-4 border border-gray-300 rounded peer-checked:bg-black peer-checked:border-black transition-all"></div>
                    <svg class="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-600 group-hover:text-black transition-colors">{{ brand.name }}</span>
                </label>
              </li>
            </ul>
          </div>
        </aside>

          <!-- Product Grid -->
        <main class="flex-1">
          <!-- Top Bar -->
          <div class="flex items-center justify-between mb-6">
             <div class="flex items-center gap-2">
              <button 
                @click="viewMode = 'grid'"
                class="p-2 rounded transition-colors"
                :class="viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:text-black'"
              >
                <Icon name="heroicons:squares-2x2" class="w-5 h-5" />
              </button>
              <button 
                @click="viewMode = 'list'"
                class="p-2 rounded transition-colors"
                :class="viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:text-black'"
              >
                <Icon name="heroicons:list-bullet" class="w-5 h-5" />
              </button>
            </div>

            <div class="relative w-48">
              <select v-model="selectedSort" 
                class="w-full appearance-none bg-transparent border-b border-gray-200 py-2 pr-8 text-sm font-medium focus:outline-none cursor-pointer">
                <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                  Tri: {{ opt.label }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Icon name="heroicons:chevron-down" class="h-4 w-4" />
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="n in 8" :key="n" class="animate-pulse">
              <div class="bg-gray-200 aspect-3/4 rounded-xl mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-8">
            <h3 class="font-bold">Erreur de chargement</h3>
            <p>{{ error }}</p>
            <button @click="fetch(1)" class="mt-2 text-sm underline hover:text-red-800">Réessayer</button>
          </div>

          <!-- Products Grid -->
          <ProductGrid 
            v-if="products.length > 0"
            :products="products"
            :view-mode="viewMode"
            :columns="4"
            @open-quickview="openQuickView"
          />

          <!-- Empty State -->
          <div v-else class="text-center py-20">
            <div class="mb-6 mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
              <Icon name="heroicons:shopping-bag" class="w-10 h-10 text-gray-300" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p class="text-gray-500 mb-8 max-w-md mx-auto">Nous n'avons trouvé aucun produit correspondant à vos critères.</p>
            <button @click="resetFilters" 
              class="px-8 py-3 bg-black text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.last_page > 1" class="mt-16 flex justify-center">
            <div class="flex items-center gap-2">
              <button 
                @click="changePage(pagination!.current_page - 1)"
                :disabled="pagination.current_page === 1"
                class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-black hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:hover:border-gray-200"
              >
                <Icon name="heroicons:chevron-left" class="w-4 h-4" />
              </button>

              <div class="flex items-center gap-1">
                <template v-for="page in getVisiblePages(pagination.current_page, pagination.last_page)" :key="page">
                  <span v-if="page === '...'" class="w-10 text-center text-gray-400">...</span>
                  <button v-else
                    @click="changePage(page as number)"
                    class="w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-colors"
                    :class="page === pagination!.current_page ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'"
                  >
                    {{ page }}
                  </button>
                </template>
              </div>

              <button 
                @click="changePage(pagination!.current_page + 1)"
                :disabled="pagination.current_page === pagination.last_page"
                class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-black hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:hover:border-gray-200"
              >
                <Icon name="heroicons:chevron-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile Filters Drawer -->
    <div v-if="showMobileFilters" class="fixed inset-0 z-50 lg:hidden font-sans">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showMobileFilters = false"></div>
      <div class="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-bold font-syne">Filtres</h3>
          <button @click="showMobileFilters = false" class="p-2 hover:bg-gray-100 rounded-full">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-8">
          <!-- Categories -->
          <div>
            <h4 class="font-bold mb-3">Catégories</h4>
            <ul class="space-y-2">
              <li v-for="cat in categories" :key="cat.id || 'mob-all'">
                <button @click="selectCategory(cat.id); showMobileFilters=false"
                  class="w-full text-left py-2 px-3 rounded text-sm"
                  :class="selectedCategory === cat.id ? 'bg-gray-100 font-medium' : 'text-gray-600'"
                >
                  {{ cat.name }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Prix -->
          <div>
            <h4 class="font-bold mb-3">Prix</h4>
            <div class="space-y-3">
              <div class="flex gap-3">
                <input v-model.number="priceRange.min" type="number" placeholder="Min"
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-black transition-colors" />
                <input v-model.number="priceRange.max" type="number" placeholder="Max"
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>
          </div>

          <!-- Couleurs -->
          <div v-if="colors.length > 0">
            <h4 class="font-bold mb-3">Couleurs</h4>
            <div class="flex flex-wrap gap-2">
              <button v-for="color in colors" :key="color.id"
                @click="toggleColor(color.name)"
                class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 relative"
                :class="{ 'ring-2 ring-offset-2 ring-black': selectedColors.includes(color.name) }"
                :title="color.name"
              >
                <span class="w-6 h-6 rounded-full block border border-black/5" :style="{ backgroundColor: color.hex_code }"></span>
              </button>
            </div>
          </div>

          <!-- Tailles -->
          <div v-if="sizes.length > 0">
            <h4 class="font-bold mb-3">Tailles</h4>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="size in sizes" :key="size.id"
                @click="toggleSize(size.name)"
                class="px-2 py-2 text-xs border rounded transition-all"
                :class="selectedSizes.includes(size.name) 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
              >
                {{ size.name }}
              </button>
            </div>
          </div>

          <!-- Marques -->
          <div v-if="brands.length > 0">
            <h4 class="font-bold mb-3">Marques</h4>
            <ul class="space-y-2">
              <li v-for="brand in brands" :key="brand.id || 'mob-all-brands'">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center">
                    <input type="checkbox" 
                      :checked="selectedBrand === brand.id"
                      @change="selectBrand(brand.id)"
                      class="peer h-4 w-4 opacity-0 absolute" 
                    />
                    <div class="w-4 h-4 border border-gray-300 rounded peer-checked:bg-black peer-checked:border-black transition-all"></div>
                    <svg class="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-600 group-hover:text-black transition-colors">{{ brand.name }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>


        <div class="p-4 border-t bg-gray-50">
          <button @click="resetFilters" class="w-full py-3 border border-black text-black rounded mb-2 text-sm font-bold uppercase">Réinitialiser</button>
          <button @click="showMobileFilters = false" class="w-full py-3 bg-black text-white rounded text-sm font-bold uppercase">Voir les résultats</button>
        </div>
      </div>
    </div>
    <!-- Quick View Modal -->
    <ProductQuickView 
      v-model:open="showQuickView"
      v-model:product="quickViewProduct"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from '~/components/product/Card.vue'
import ProductGrid from '~/components/product/Grid.vue'
import ProductQuickView from '~/components/product/QuickView.vue'
import type { Product } from '~/types/product'

// Types
interface SortOption { value: string; label: string }

const productStore = useProducts()
const categoryStore = useCategories()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()

// Refs
const showMobileFilters = ref(false)
const showQuickView = ref(false)
const quickViewProduct = ref<Product | null>(null)
const priceRange = ref({ min: null as number | null, max: null as number | null })

// State from Store
const products = computed(() => productStore.allProducts.value)
const loading = computed(() => productStore.isLoading.value)
const error = computed(() => productStore.hasError.value)
const pagination = computed(() => productStore.pagination.value)
const categories = computed(() => [
  { id: null, name: 'Tout voir' },
  ...(categoryStore.mainCategories.value || [])
])
const colors = computed(() => productStore.allColors.value)
const sizes = computed(() => productStore.allSizes.value)
const brands = computed(() => productStore.allBrands.value)

// Local Filter State
const selectedCategory = ref<string | null>(null)
const selectedBrand = ref<string | null>(null)
const selectedColors = ref<string[]>([])
const selectedSizes = ref<string[]>([])
const selectedSort = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')

const sortOptions: SortOption[] = [
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'name_asc', label: 'Nom A-Z' },
  { value: 'popularity', label: 'Populaire' }
]

// Computed
const selectedCategoryName = computed(() => {
  return categories.value.find(c => c.id === selectedCategory.value)?.name || null
})

// Methods
const fetch = async (page = 1) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // Map sort options to backend params
  let sortBy = 'created_at'
  let sortOrder = 'desc'

  switch (selectedSort.value) {
    case 'newest': sortBy = 'created_at'; sortOrder = 'desc'; break;
    case 'price_asc': sortBy = 'price'; sortOrder = 'asc'; break;
    case 'price_desc': sortBy = 'price'; sortOrder = 'desc'; break;
    case 'name_asc': sortBy = 'name'; sortOrder = 'asc'; break;
    case 'popularity': sortBy = 'rating_average'; sortOrder = 'desc'; break; // Assuming rating_average is valid
  }

  await productStore.fetchProducts({
    page,
    per_page: 20,
    category_id: selectedCategory.value || undefined,
    brand_id: selectedBrand.value || undefined,
    min_price: priceRange.value.min !== null ? priceRange.value.min : undefined,
    max_price: priceRange.value.max || undefined,
    sort_by: sortBy,
    sort_order: sortOrder as 'asc' | 'desc',
    colors: selectedColors.value,
    sizes: selectedSizes.value
  })
}

// Actions
const openQuickView = (product: Product) => {
  quickViewProduct.value = product
  showQuickView.value = true
}

const handleAddToCart = (payload: { product: Product, variation?: any, quantity: number }) => {
  cartStore.addItem(payload.product, payload.quantity, payload.variation?.id)
  showQuickView.value = false
}

const selectCategory = (id: string | null) => {
  selectedCategory.value = id
  fetch(1)
}

const selectBrand = (id: string | null) => {
  selectedBrand.value = selectedBrand.value === id ? null : id
  fetch(1)
}

const toggleColor = (name: string) => {
  const i = selectedColors.value.indexOf(name)
  if (i > -1) selectedColors.value.splice(i, 1)
  else selectedColors.value.push(name)
  fetch(1)
}

const toggleSize = (name: string) => {
  const i = selectedSizes.value.indexOf(name)
  if (i > -1) selectedSizes.value.splice(i, 1)
  else selectedSizes.value.push(name)
  fetch(1)
}

const changePage = (page: number) => {
  fetch(page)
}

const applyFilters = () => {
  fetch(1)
}

const resetFilters = () => {
  selectedCategory.value = null
  selectedBrand.value = null
  selectedColors.value = []
  selectedSizes.value = []
  priceRange.value = { min: null, max: null }
  selectedSort.value = 'newest'
  fetch(1)
}

// Pagination Logic
const getVisiblePages = (current: number, total: number) => {
  const delta = 2
  const range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  if (current - delta > 2) range.unshift('...')
  if (current + delta < total - 1) range.push('...')
  range.unshift(1)
  if (total > 1) range.push(total)
  return range
}

// Watchers
watch(selectedSort, () => fetch(1))

// Initial Load
onMounted(() => {
  const query = route.query
  if (query.category) selectedCategory.value = query.category as string
  fetch(1)
})

useHead({
  title: 'Boutique - Bylin',
  meta: [{ name: 'description', content: 'Découvrez notre collection.' }]
})
</script>

<style scoped>
.font-syne { font-family: 'Syne', sans-serif; }
</style>