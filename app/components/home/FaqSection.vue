<script setup lang="ts">
import { ref } from 'vue'
import type { FaqItem } from '~/types/home'

const props = defineProps<{
  items: FaqItem[]
}>()

// Internal state to track open index
// We create a local state array relative to the props or just track the open index.
// Tracking by index or ID is better.
const activeIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
   activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <section class="py-24 border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#111]">
     <div class="container mx-auto px-6 max-w-4xl">
        <h3 class="font-syne font-bold text-5xl md:text-7xl uppercase mb-16 opacity-10 select-none">F.A.Q.</h3>
        
        <div class="space-y-0 border-t border-black/10 dark:border-white/10">
           <div 
              v-for="(faq, i) in items" 
              :key="i" 
              class="border-b border-black/10 dark:border-white/10 py-8 hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition-colors duration-300 group cursor-pointer hover-trigger px-4" 
              @click="toggleFaq(i)"
           >
              <div class="flex justify-between items-center">
                 <div class="flex items-baseline gap-4 md:gap-8">
                    <span class="font-mono text-xs text-[#0066bf]">0{{ i+1 }}</span>
                    <h4 class="text-xl md:text-3xl font-syne font-bold uppercase">{{ faq.q }}</h4>
                 </div>
                 <span class="text-2xl font-light transform transition-transform duration-300 text-[#0066bf]" :class="activeIndex === i ? 'rotate-45' : ''">+</span>
              </div>
              <div class="grid transition-all duration-500 ease-out overflow-hidden" :class="activeIndex === i ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'">
                 <div class="overflow-hidden">
                    <p class="font-mono text-sm opacity-70 leading-relaxed max-w-2xl ml-0 md:ml-12 border-l-2 border-[#0066bf] pl-4">
                       {{ faq.a }}
                    </p>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </section>
</template>

<style scoped>
.font-syne { font-family: 'Syne', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }
</style>
