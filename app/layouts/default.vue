<script setup lang="ts">
import type { HomeContentResponse } from '~/types/home'

// Fetch global navigation data
// Nuxt will deduplicate this request if it's also made in the page with the same key/URL
const { data } = await useApi<HomeContentResponse>('/content/home')
const navigation = computed(() => data.value?.navigation || [])
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-50 font-sans">
        <LayoutMainHeader :navigation="navigation" />

        <main class="flex-grow">
            <slot />
        </main>

        <LayoutMainFooter />
    </div>
</template>
