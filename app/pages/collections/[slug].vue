<script setup lang="ts">
import type { Product } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()
const { fetchCollectionBySlug, fetchCollectionProducts, getImageUrl } = useCollections()

const page = ref(1)
const quickViewProduct = ref<Product | null>(null)
const showQuickView = ref(false)

const { data: collection, pending: collectionPending, error: collectionError } = await useAsyncData(
  `collection-${route.params.slug}`,
  () => fetchCollectionBySlug(route.params.slug as string),
  { server: true, watch: [() => route.params.slug] }
)

const { data: productsResponse, pending: productsPending, refresh } = await useAsyncData(
  `collection-products-${route.params.slug}-${page.value}`,
  () => fetchCollectionProducts(route.params.slug as string, { page: page.value, per_page: 24 }),
  { server: true, watch: [page, () => route.params.slug] }
)

if (collectionError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Collection introuvable' })
}

const products = computed(() => productsResponse.value?.data || [])
const meta = computed(() => productsResponse.value?.meta)

const openQuickView = (product: Product) => {
  quickViewProduct.value = product
  showQuickView.value = true
}

const handleAddToCart = async (payload: { product: Product; variation?: any; quantity: number }) => {
  await cartStore.addItem(payload.product, payload.quantity, payload.variation?.id)
  showQuickView.value = false
}

const changePage = async (nextPage: number) => {
  page.value = nextPage
  await refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useHead({
  title: computed(() => collection.value ? `${collection.value.name} — Collection Bylin` : 'Collection Bylin'),
  meta: [{ name: 'description', content: computed(() => collection.value?.meta_description || collection.value?.description || 'Découvrez cette collection Bylin.') }]
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-950">
    <section v-if="collectionPending" class="h-[520px] animate-pulse bg-gray-100" />
    <section v-else-if="collection" class="relative overflow-hidden bg-gray-950 text-white">
      <div class="absolute inset-0 opacity-50">
        <img
          :src="getImageUrl(collection.banner_image_url || collection.cover_image_url) || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85'"
          :alt="collection.name"
          class="h-full w-full object-cover"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <nav class="mb-10 flex items-center gap-2 text-sm text-white/70">
          <NuxtLink to="/" class="hover:text-white">Accueil</NuxtLink>
          <span>/</span>
          <NuxtLink to="/bylin" class="hover:text-white">Bylin</NuxtLink>
          <span>/</span>
          <span class="text-white">{{ collection.name }}</span>
        </nav>
        <div class="max-w-3xl">
          <p class="mb-5 text-xs font-bold uppercase tracking-[0.45em] text-primary-200">Collection Bylin</p>
          <h1 class="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">{{ collection.name }}</h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-gray-200">{{ collection.description || 'Une collection officielle Bylin.' }}</p>
          <div class="mt-8 flex flex-wrap gap-3 text-sm text-gray-200">
            <span v-if="collection.season" class="rounded-full bg-white/10 px-4 py-2">{{ collection.season }}</span>
            <span v-if="collection.theme" class="rounded-full bg-white/10 px-4 py-2">{{ collection.theme }}</span>
            <span class="rounded-full bg-white/10 px-4 py-2">{{ meta?.total || collection.active_products_count || collection.products_count || 0 }} produits</span>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Produits</p>
          <h2 class="mt-3 text-3xl font-black tracking-tight">Pièces de la collection</h2>
        </div>
        <UButton to="/bylin" variant="outline">Retour à Bylin</UButton>
      </div>

      <div v-if="productsPending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 8" :key="i" class="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
      <ProductGrid v-else-if="products.length" :products="products" :columns="4" @open-quickview="openQuickView" />
      <div v-else class="rounded-3xl bg-gray-50 p-12 text-center text-gray-600">Aucun produit actif dans cette collection.</div>

      <div v-if="meta && meta.last_page > 1" class="mt-12 flex justify-center gap-2">
        <UButton :disabled="meta.current_page <= 1" variant="outline" @click="changePage(meta.current_page - 1)">Précédent</UButton>
        <UButton v-for="p in meta.last_page" :key="p" :variant="p === meta.current_page ? 'solid' : 'outline'" @click="changePage(p)">{{ p }}</UButton>
        <UButton :disabled="meta.current_page >= meta.last_page" variant="outline" @click="changePage(meta.current_page + 1)">Suivant</UButton>
      </div>
    </section>

    <ProductQuickView v-model:open="showQuickView" v-model:product="quickViewProduct" @add-to-cart="handleAddToCart" />
  </div>
</template>
