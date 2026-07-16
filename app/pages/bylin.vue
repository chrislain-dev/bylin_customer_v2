<script setup lang="ts">
import type { Collection } from '~/types/collection'
import type { Product } from '~/types/product'

const { fetchCollections, getImageUrl } = useCollections()
const { fetchProducts } = useProducts()
const cartStore = useCartStore()

const { data: collectionsResponse, pending: collectionsPending } = await useAsyncData(
  'bylin-collections',
  () => fetchCollections({ per_page: 12 }),
  { server: true }
)

const { data: bylinProducts, pending: productsPending } = await useAsyncData<Product[]>(
  'bylin-products-preview',
  async () => {
    const products = await fetchProducts({ only_bylin: true, per_page: 8, sort_by: 'created_at', sort_order: 'desc' })
    return products || []
  },
  { server: false, default: () => [] }
)

const collections = computed<Collection[]>(() => collectionsResponse.value?.data || [])
const featuredCollection = computed(() => collections.value.find((item) => item.is_featured) || collections.value[0])
const otherCollections = computed(() => collections.value.filter((item) => item.id !== featuredCollection.value?.id))
const orderedCollections = computed(() => featuredCollection.value ? [featuredCollection.value, ...otherCollections.value] : collections.value)

const formatDate = (date?: string | null) => {
  if (!date) return null
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(date))
}

const addProduct = async (product: Product) => {
  await cartStore.addItem(product, 1)
}

useHead({
  title: 'Bylin — Collections officielles',
  meta: [
    { name: 'description', content: 'Découvrez les collections officielles Bylin : créations originales, séries limitées et vêtements premium.' }
  ]
})
</script>

<template>
  <div class="bg-white text-gray-950">
    <section class="relative overflow-hidden bg-gray-950 text-white">
      <div class="absolute inset-0 opacity-30">
        <img
          :src="getImageUrl(featuredCollection?.banner_image_url || featuredCollection?.cover_image_url) || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85'"
          alt="Bylin"
          class="h-full w-full object-cover"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
      <div class="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-32">
        <div class="max-w-2xl">
          <p class="mb-5 text-xs font-bold uppercase tracking-[0.45em] text-primary-200">Marque officielle</p>
          <h1 class="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">Bylin, le vestiaire signature.</h1>
          <p class="mt-6 text-lg leading-8 text-gray-200">
            Des collections pensées pour allier présence, confort et identité. Chaque pièce Bylin met en avant une silhouette forte, moderne et durable.
          </p>
          <div class="mt-10 flex flex-col gap-3 sm:flex-row">
            <UButton to="#collections" size="xl" color="primary">Voir les collections</UButton>
            <UButton to="/products" size="xl" color="neutral" variant="outline" class="bg-white/10 text-white ring-white/30 hover:bg-white hover:text-gray-950">Boutique non Bylin</UButton>
          </div>
        </div>
        <div class="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
          <p class="text-sm uppercase tracking-[0.25em] text-primary-100">Collection mise en avant</p>
          <h2 class="mt-4 text-3xl font-bold">{{ featuredCollection?.name || 'Nouvelle collection' }}</h2>
          <p class="mt-4 text-gray-200 line-clamp-4">{{ featuredCollection?.description || 'Une sélection premium bientôt disponible.' }}</p>
          <div class="mt-6 flex flex-wrap gap-3 text-sm text-gray-200">
            <span v-if="featuredCollection?.season" class="rounded-full bg-white/10 px-4 py-2">{{ featuredCollection.season }}</span>
            <span v-if="featuredCollection?.theme" class="rounded-full bg-white/10 px-4 py-2">{{ featuredCollection.theme }}</span>
            <span class="rounded-full bg-white/10 px-4 py-2">{{ featuredCollection?.active_products_count || featuredCollection?.products_count || 0 }} pièces</span>
          </div>
          <UButton v-if="featuredCollection" :to="`/collections/${featuredCollection.slug}`" class="mt-8" size="lg" color="primary">Explorer la collection</UButton>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <Icon name="heroicons:sparkles" class="h-9 w-9 text-primary-600" />
          <h3 class="mt-5 text-xl font-bold">Créations originales</h3>
          <p class="mt-3 text-gray-600">Des pièces propres à l’univers Bylin, organisées par collection.</p>
        </div>
        <div class="rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <Icon name="heroicons:shield-check" class="h-9 w-9 text-primary-600" />
          <h3 class="mt-5 text-xl font-bold">Qualité contrôlée</h3>
          <p class="mt-3 text-gray-600">Sélection, finitions et disponibilité suivies directement depuis le catalogue.</p>
        </div>
        <div class="rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <Icon name="heroicons:truck" class="h-9 w-9 text-primary-600" />
          <h3 class="mt-5 text-xl font-bold">Commande simple</h3>
          <p class="mt-3 text-gray-600">Panier, checkout, paiement et suivi client intégrés à l’expérience.</p>
        </div>
      </div>
    </section>

    <section id="collections" class="bg-gray-50 py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Collections</p>
            <h2 class="mt-3 text-4xl font-black tracking-tight">Toutes les collections Bylin</h2>
          </div>
          <p class="max-w-xl text-gray-600">Chaque collection regroupe les produits Bylin autour d’un thème, d’une saison ou d’un lancement.</p>
        </div>

        <div v-if="collectionsPending" class="grid gap-6 md:grid-cols-3">
          <div v-for="i in 6" :key="i" class="h-96 animate-pulse rounded-3xl bg-white" />
        </div>
        <div v-else-if="collections.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="collection in orderedCollections"
            :key="collection.id"
            :to="`/collections/${collection.slug}`"
            class="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="relative aspect-[4/5] overflow-hidden bg-gray-100">
              <img
                :src="getImageUrl(collection.cover_image_url || collection.banner_image_url) || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85'"
                :alt="collection.name"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div class="absolute bottom-5 left-5 right-5 text-white">
                <p class="text-xs uppercase tracking-[0.25em] text-white/75">{{ formatDate(collection.release_date) || collection.season || 'Collection' }}</p>
                <h3 class="mt-2 text-2xl font-bold">{{ collection.name }}</h3>
              </div>
            </div>
            <div class="p-6">
              <p class="line-clamp-2 text-sm text-gray-600">{{ collection.description || 'Découvrir les pièces de cette collection.' }}</p>
              <div class="mt-5 flex items-center justify-between text-sm font-semibold">
                <span>{{ collection.active_products_count || collection.products_count || 0 }} produits</span>
                <span class="text-primary-600">Découvrir →</span>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="rounded-3xl bg-white p-12 text-center text-gray-600">Aucune collection active n’est encore publiée.</div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="mb-10 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Sélection</p>
          <h2 class="mt-3 text-4xl font-black tracking-tight">Dernières pièces Bylin</h2>
        </div>
        <UButton to="/products?brand=bylin" variant="outline">Voir plus</UButton>
      </div>
      <div v-if="productsPending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 4" :key="i" class="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
      <ProductGrid v-else-if="bylinProducts.length" :products="bylinProducts" :columns="4" @open-quickview="addProduct" />
      <div v-else class="rounded-3xl bg-gray-50 p-10 text-center text-gray-600">Aucun produit Bylin disponible pour le moment.</div>
    </section>
  </div>
</template>
