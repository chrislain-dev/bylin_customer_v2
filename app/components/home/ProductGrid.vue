<script setup lang="ts">
import type { ProductLook } from '~/types/home'

const props = defineProps<{
  title: string
  items: ProductLook[]
}>()
</script>

<template>
  <section class="py-32 px-6 bg-[#f0f0f0] dark:bg-[#050505]">
     <div class="container mx-auto">
        <h3 class="font-syne font-bold text-3xl md:text-5xl uppercase mb-16 text-center">
           {{ title }}
        </h3>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
           <div v-for="item in items" :key="item.id + 'grid'" class="group cursor-pointer hover-trigger">
              <NuxtLink :to="item.url" class="block">
                  <div class="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-200 dark:bg-gray-900">
                     <img :src="item.image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" loading="lazy" />
                     
                     <!-- Tag New -->
                     <div v-if="item.tag === 'NEW'" class="absolute top-2 left-2 bg-[#0066bf] text-white text-[10px] font-mono px-2 py-1 uppercase">
                        Nouveau
                     </div>

                     <!-- Quick Add - Prevent Default Link Action maybe? Or just link to product -->
                     <button class="absolute bottom-0 right-0 w-12 h-12 bg-white dark:bg-black text-[#0066bf] flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <span class="text-2xl font-light">+</span>
                     </button>
                  </div>
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-end">
                     <div>
                        <h4 class="text-xs md:text-sm font-syne font-bold uppercase tracking-wide">{{ item.name }}</h4>
                        <span class="text-[10px] font-mono text-gray-500 uppercase">{{ item.tag }}</span>
                     </div>
                     <span class="text-xs font-mono font-bold mt-1 md:mt-0">{{ item.price_formatted }}</span>
                  </div>
              </NuxtLink>
           </div>
        </div>
     </div>
  </section>
</template>

<style scoped>
.font-syne { font-family: 'Syne', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }
</style>
