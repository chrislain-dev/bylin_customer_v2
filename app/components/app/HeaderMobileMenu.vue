<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'

const props = defineProps<{
      navigation?: NavigationItem[]
}>()

const open = defineModel<boolean>('open')
</script>

<template>
      <USlideover v-model:open="open" side="left">
            <UButton icon="i-heroicons-bars-3" color="neutral" variant="ghost" @click="open = false" class="lg:hidden" />
            <template #content>
                  <UCard>
      
                        <div class="space-y-6">
                              <!-- Search -->
                              <UInput icon="i-heroicons-magnifying-glass" size="lg" placeholder="Rechercher..." />
      
                              <!-- Navigation -->
                              <UAccordion :items="navigation?.map((item, index) => ({
                                    label: item.label,
                                    slot: `item-${index}`,
                                    defaultOpen: false
                              })) || []">
                                    <template v-for="(item, index) in navigation" :key="index" #[`item-${index}`]>
                                          <div class="space-y-3 pb-4">
                                                <NuxtLink :to="item.url" @click="open = false"
                                                      class="block text-sm font-medium">
                                                      Voir tout
                                                </NuxtLink>
      
                                                <div v-for="col in item.mega_menu" :key="col.title" class="space-y-2">
                                                      <p class="text-xs font-bold uppercase text-gray-500">
                                                            {{ col.title }}
                                                      </p>
                                                      <ul class="space-y-2 pl-3">
                                                            <li v-for="link in col.links" :key="link.label">
                                                                  <NuxtLink :to="link.url" @click="open = false"
                                                                        class="text-sm text-gray-600 hover:text-gray-900">
                                                                        {{ link.label }}
                                                                  </NuxtLink>
                                                            </li>
                                                      </ul>
                                                </div>
                                          </div>
                                    </template>
                              </UAccordion>
                        </div>
                  </UCard>
            </template>
      </USlideover>
</template>