<script setup lang="ts">
import type { MegaMenuColumn } from '~/types/home'

const props = defineProps<{
  columns: MegaMenuColumn[]
}>()
</script>

<template>
  <div class="absolute left-1/2 -translate-x-1/2 top-full mt-1 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-10 min-w-[1000px]">
        <div class="grid grid-cols-4 gap-10">
          <div v-for="(col, cIndex) in columns" :key="cIndex">
            <!-- Image Column -->
            <div v-if="col.type === 'image'" class="text-center">
              <img :src="col.image_url" :alt="col.image_label" class="w-full h-auto rounded-md mb-3" />
              <span class="text-xs uppercase text-gray-600 dark:text-gray-400">{{ col.image_label }}</span>
            </div>

            <!-- Links Column -->
            <template v-else>
              <h3 class="text-xs font-bold uppercase tracking-wide mb-5 text-gray-900 dark:text-gray-100">
                {{ col.title }}
              </h3>
              <ul v-if="col.links" class="space-y-3">
                <li v-for="link in col.links" :key="link.label">
                  <NuxtLink :to="link.url"
                    class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
              <NuxtLink v-if="col.bottom_link" :to="col.bottom_link.url"
                class="inline-block mt-3 text-xs underline text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                {{ col.bottom_link.label }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
  </div>
</template>
