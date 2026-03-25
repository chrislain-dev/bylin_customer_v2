<script setup lang="ts">
const open = defineModel<boolean>('open')
const query = ref('')
</script>

<template>
      <UModal v-model:open="open">
            <template #content>
                  <UCard>
                        <UInput v-model="query" icon="i-heroicons-magnifying-glass" size="xl"
                              placeholder="Rechercher un produit..." autofocus />

                        <div class="mt-6">
                              <p class="text-sm text-gray-500">
                                    Suggestions populaires
                              </p>
                              <div class="flex flex-wrap gap-2 mt-3">
                                    <UBadge v-for="tag in ['T-shirts', 'Parfums', 'Montres', 'Sacs']" :key="tag"
                                          variant="subtle" class="cursor-pointer" @click="query = tag">
                                          {{ tag }}
                                    </UBadge>
                              </div>
                        </div>
                  </UCard>
            </template>
      </UModal>
</template>