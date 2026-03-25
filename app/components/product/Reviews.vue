<template>
      <div class="border-t border-black/10 dark:border-white/10 pt-16">
            <h2 class="text-2xl font-black uppercase mb-8">Avis clients</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <!-- Rating Summary -->
                  <div>
                        <div class="flex items-center gap-4">
                              <p class="text-4xl font-black">{{ Number(averageRating).toFixed(1) }}</p>
                              <div>
                                    <div class="flex items-center">
                                          <template v-for="i in 5" :key="i">
                                                <svg class="h-5 w-5"
                                                      :class="i <= Math.round(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-300'"
                                                      fill="currentColor" viewBox="0 0 20 20">
                                                      <path
                                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                          </template>
                                    </div>
                                    <p class="mt-1 text-sm opacity-60 font-mono">Basé sur {{ ratingsCount }} avis</p>
                              </div>
                        </div>

                        <button
                              class="mt-8 w-full py-3 border border-black/20 dark:border-white/20 font-mono text-xs uppercase hover:bg-[#0066bf] hover:text-white transition-colors">
                              Laisser un avis
                        </button>
                  </div>

                  <!-- Reviews List -->
                  <div class="md:col-span-2 space-y-8">
                        <div v-if="reviews.length === 0" class="text-center py-12 opacity-50">
                              <p class="font-mono text-sm">Aucun avis pour le moment</p>
                              <p class="text-xs mt-2">Soyez le premier à donner votre avis !</p>
                        </div>

                        <!-- Mock reviews for demo -->
                        <div v-else v-for="review in reviews" :key="review.id"
                              class="border-b border-black/5 dark:border-white/5 pb-8">
                              <div class="flex items-center gap-3 mb-3">
                                    <div
                                          class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-sm">
                                          {{ review.author[0] }}
                                    </div>
                                    <div>
                                          <p class="font-bold text-sm">{{ review.author }}</p>
                                          <div class="flex items-center gap-2">
                                                <div class="flex">
                                                      <template v-for="i in 5" :key="i">
                                                            <svg class="h-4 w-4"
                                                                  :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                                                                  fill="currentColor" viewBox="0 0 20 20">
                                                                  <path
                                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                      </template>
                                                </div>
                                                <span class="text-xs opacity-60 font-mono">{{ review.date }}</span>
                                          </div>
                                    </div>
                              </div>
                              <p class="text-sm opacity-80 leading-relaxed">{{ review.comment }}</p>
                        </div>
                  </div>
            </div>
      </div>
</template>

<script setup lang="ts">
defineProps<{
      productId: string
      averageRating: number
      ratingsCount: number
}>()

// Mock reviews - à remplacer par de vraies données
const reviews = ref([
      {
            id: 1,
            author: 'Marie D.',
            rating: 5,
            date: '12 Jan 2025',
            comment: 'Excellente qualité, la coupe est parfaite et le tissu est vraiment premium. Je recommande !'
      },
      {
            id: 2,
            author: 'Jean K.',
            rating: 4,
            date: '8 Jan 2025',
            comment: 'Très beau produit, conforme à la description. Livraison rapide à Cotonou.'
      }
])
</script>