<script setup lang="ts">
import type { Category } from '~/types/category'
import type { Product } from '~/types/product'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const config = useRuntimeConfig()

const getApiUrl = (path: string) => process.server ? `${config.apiSecretUrl}${path}` : path

const { data: category, error } = await useFetch<{ success: boolean; data: Category }>(
  () => getApiUrl(`/api/v1/catalog/categories/${slug.value}`)
)

if (error.value) {
  throw createError({ statusCode: 404, message: 'Catégorie introuvable', fatal: true })
}

const { data: productsResponse } = await useFetch<{ success: boolean; data: Product[] }>(
  () => getApiUrl(`/api/v1/catalog/categories/${slug.value}/products`)
)

const categoryData = computed(() => category.value?.data)
const products = computed(() => productsResponse.value?.data || [])

useSeoMeta({
  title: () => categoryData.value?.meta_title || categoryData.value?.name || 'Catégorie',
  description: () => categoryData.value?.meta_description || categoryData.value?.description || '',
  ogTitle: () => categoryData.value?.name || 'Catégorie',
  ogDescription: () => categoryData.value?.description || '',
  ogImage: () => categoryData.value?.image_url || categoryData.value?.image || '',
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-gray-950">Accueil</NuxtLink>
      <span>/</span>
      <NuxtLink to="/categories" class="hover:text-gray-950">Catégories</NuxtLink>
      <span v-if="categoryData">/</span>
      <span v-if="categoryData" class="text-gray-950">{{ categoryData.name }}</span>
    </nav>

    <section v-if="categoryData" class="mb-12 rounded-[2rem] bg-gray-950 p-8 text-white md:p-12">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-200">Catégorie</p>
      <h1 class="mt-4 text-4xl font-black md:text-6xl">{{ categoryData.name }}</h1>
      <p class="mt-4 max-w-2xl text-gray-300">{{ categoryData.description || 'Découvrez les produits de cette catégorie.' }}</p>
    </section>

    <div v-if="categoryData?.children?.length" class="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="child in categoryData.children"
        :key="child.id"
        :to="`/categories/${child.slug}`"
        class="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:shadow-lg"
      >
        <div class="text-3xl">{{ child.icon || '•' }}</div>
        <h3 class="mt-3 font-bold">{{ child.name }}</h3>
      </NuxtLink>
    </div>

    <ProductGrid v-if="products.length" :products="products" />
    <div v-else class="rounded-3xl bg-gray-50 p-12 text-center text-gray-600">Aucun produit disponible dans cette catégorie.</div>
  </div>
</template>
