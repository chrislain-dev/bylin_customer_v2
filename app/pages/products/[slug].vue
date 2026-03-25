<template>
  <div v-if="pending" class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-500">Chargement du produit...</p>
    </div>
  </div>

  <div v-else-if="product"
    class="w-full bg-[#f0f0f0] text-[#1a1a1a] dark:bg-[#050505] dark:text-[#e1e1e1] font-syne min-h-screen">
    <div
      class="fixed inset-0 pointer-events-none z-50 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
    </div>

    <div class="container mx-auto px-4 md:px-6 pt-32 pb-24">
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-24">

        <!-- Galerie Images -->
        <ProductGallery :images="product.media" class="w-full lg:w-3/5" />

        <!-- Info Produit -->
        <ProductInfo :product="product" @add-to-cart="handleAddToCart" class="w-full lg:w-3/5" />

      </div>

      <!-- Reviews -->
      <ProductReviews :product-id="product.id" :average-rating="product.rating_average"
        :ratings-count="product.rating_count" class="mt-32" />

      <!-- Produits Similaires -->
      <section v-if="similarProducts.length > 0" class="mt-32">
        <h2 class="text-3xl md:text-5xl font-black uppercase mb-12">Produits Similaires</h2>
        <ProductGrid :products="similarProducts" :columns="4" />
      </section>
    </div>
  </div>

  <!-- 404 State -->
  <div v-else class="min-h-screen flex items-center justify-center font-syne">
    <div class="text-center">
      <h1 class="text-6xl font-black mb-4">404</h1>
      <p class="font-mono mb-8">Produit introuvable</p>
      <NuxtLink to="/products" class="underline text-[#0066bf]">Retour au catalogue</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import ProductGallery from '~/components/product/Gallery.vue'
import ProductInfo from '~/components/product/Info.vue'
import ProductReviews from '~/components/product/Reviews.vue'
import ProductGrid from '~/components/product/Grid.vue'

const route = useRoute()
const { fetchProductBySlug, fetchProducts, allProducts } = useProducts()
const cartStore = useCartStore()
const toast = useToast()

// Fetch product data
const { data: product, pending, error } = await useAsyncData<Product | null>(
  `product-${route.params.slug}`,
  () => fetchProductBySlug(route.params.slug as string),
  {
    watch: [() => route.params.slug]
  }
)

// Fetch similar products based on category
const similarProducts = ref<Product[]>([])

watch(product, async (newProduct) => {
  if (newProduct && newProduct.categories && newProduct.categories.length > 0) {
    try {
      const categoryId = newProduct.categories[0]?.id
      if (categoryId) {
        await fetchProducts({ category_id: categoryId, per_page: 5 })
        // Filter out current product
        similarProducts.value = allProducts.value
          .filter((p: Product) => p.id !== newProduct.id)
          .slice(0, 4)
      }
    } catch (err) {
      console.error('Error fetching similar products:', err)
    }
  }
}, { immediate: true })

// Handle add to cart
const handleAddToCart = (productData: any) => {
  if (!product.value) return

  // Find variation if selected
  const variationId = productData.selectedVariation?.id || null
  const qty = productData.quantity || 1

  cartStore.addItem(productData, qty, variationId)
}

// SEO
useHead({
  title: computed(() => product.value ? `${product.value.name} - Bylin` : 'Produit Introuvable'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.short_description || product.value?.description || '')
    }
  ]
})

// Structured data for SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => product.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value.name,
        description: product.value.description,
        sku: product.value.sku,
        image: product.value.thumbnail_url,
        brand: {
          '@type': 'Brand',
          name: product.value.brand?.name
        },
        offers: {
          '@type': 'Offer',
          price: product.value.price,
          priceCurrency: 'XOF',
          availability: product.value.status === 'active'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock'
        },
        aggregateRating: product.value.rating_count > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: product.value.rating_average,
          reviewCount: product.value.rating_count
        } : undefined
      }) : '{}')
    }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400&display=swap');

.font-syne {
  font-family: 'Syne', sans-serif;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
</style>