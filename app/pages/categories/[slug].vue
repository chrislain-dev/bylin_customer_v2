<script setup lang="ts">
definePageMeta({
      layout: 'default',
      middleware: 'category-exists'
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: category, error } = await useFetch(`/api/v1/categories/${slug.value}`)

if (error.value) {
      throw createError({
            statusCode: 404,
            message: 'Catégorie introuvable'
      })
}

// Récupère les produits de cette catégorie et ses sous-catégories
const { data: products } = await useFetch('/api/v1/products', {
      query: {
            category_id: category.value?.id,
            include_children: true
      }
})

useSeoMeta({
      title: category.value?.meta_title || category.value?.name,
      description: category.value?.meta_description,
      ogTitle: category.value?.name,
      ogDescription: category.value?.description,
      ogImage: category.value?.image
})
</script>

<template>
      <div>
            <!-- Breadcrumbs -->
            <UBreadcrumb :items="category?.breadcrumbs" />

            <!-- Header catégorie -->
            <div class="py-8">
                  <h1 class="text-4xl font-bold">{{ category?.name }}</h1>
                  <p class="text-gray-600 mt-2">{{ category?.description }}</p>
            </div>

            <!-- Sous-catégories (si niveau 0 ou 1) -->
            <div v-if="category?.children?.length" class="grid grid-cols-4 gap-4 mb-12">
                  <NuxtLink v-for="child in category.children" :key="child.id" :to="child.full_path"
                        class="p-4 border rounded-lg hover:shadow-lg transition">
                        <div class="text-4xl mb-2">{{ child.icon }}</div>
                        <h3 class="font-semibold">{{ child.name }}</h3>
                  </NuxtLink>
            </div>

            <!-- Produits -->
            <ProductGrid :products="products?.data" />
      </div>
</template>