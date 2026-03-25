<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'

defineProps<{
      navigation?: NavigationItem[]
}>()
</script>

<template>
      <nav class="hidden lg:block border-t border-primary-600 dark:border-primary-800">
            <ul class="flex justify-center gap-10 py-4">
                  <li v-for="(item, index) in navigation" :key="index" class="relative group">
                        <NuxtLink :to="item.url"
                              class="text-xs font-semibold uppercase tracking-wider text-white hover:text-primary-100 transition-colors pb-1 border-b-2 border-transparent hover:border-white">
                              {{ item.label }}
                        </NuxtLink>

                        <!-- Mega Menu -->
                        <AppHeaderMegaMenu v-if="item.mega_menu && item.mega_menu.length > 0"
                              :columns="item.mega_menu" />
                  </li>
            </ul>
      </nav>
</template>