<script setup lang="ts">
const { mainCategories, pending } = useCategories()

useHead({
  title: 'Catégories — Bylin',
  meta: [{ name: 'description', content: 'Explorez les catégories de vêtements disponibles sur Bylin.' }]
})
</script>

<template>
  <div class="bg-white text-gray-950">
    <section class="bg-gray-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-200">Catalogue</p>
        <h1 class="mt-4 text-5xl font-black tracking-tight">Catégories</h1>
        <p class="mt-5 max-w-2xl text-lg text-gray-300">Retrouvez rapidement les familles de produits et accédez aux pièces disponibles.</p>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="h-80 animate-pulse rounded-3xl bg-gray-100" />
      </div>
      <div v-else-if="mainCategories.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="category in mainCategories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              :src="category.image_url || category.image || 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=85'"
              :alt="category.name"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div class="absolute bottom-5 left-5 right-5 text-white">
              <h2 class="text-2xl font-bold">{{ category.name }}</h2>
              <p class="mt-1 text-sm text-white/75">{{ category.products_count || 0 }} produit(s)</p>
            </div>
          </div>
          <div class="p-6">
            <p class="line-clamp-2 text-sm text-gray-600">{{ category.description || 'Découvrir cette catégorie.' }}</p>
            <p class="mt-5 font-semibold text-primary-600">Explorer →</p>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="rounded-3xl bg-gray-50 p-12 text-center text-gray-600">Aucune catégorie visible pour le moment.</div>
    </section>
  </div>
</template>
