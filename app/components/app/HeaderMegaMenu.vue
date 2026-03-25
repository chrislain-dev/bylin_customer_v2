<script setup lang="ts">
defineProps<{
      columns: any[]
}>()
</script>

<template>
      <div
            class="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div
                  class="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 p-8 min-w-150">
                  <div class="grid grid-cols-2 gap-8">
                        <div v-for="(col, index) in columns" :key="index">
                              <h3 class="text-sm font-bold uppercase text-gray-900 dark:text-white mb-4">
                                    {{ col.title }}
                              </h3>
                              <ul class="space-y-3">
                                    <li v-for="link in col.links" :key="link.label">
                                          <a :href="link.url"
                                                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                                {{ link.label }}
                                          </a>
                                    </li>
                              </ul>
                        </div>
                  </div>
            </div>
      </div>
</template>