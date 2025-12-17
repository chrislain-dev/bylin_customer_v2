<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CollectionScroll } from '~/types/home'

const props = defineProps<{
  data: CollectionScroll
}>()

const collectionSection = ref<HTMLElement | null>(null)
const collectionTrack = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
     if (collectionSection.value && collectionTrack.value) {
        const getScrollAmount = () => {
           let trackWidth = collectionTrack.value!.scrollWidth;
           return -(trackWidth - window.innerWidth);
        }
   
        const tween = gsap.to(collectionTrack.value, {
           x: getScrollAmount,
           ease: "none",
        })
   
        ScrollTrigger.create({
           trigger: collectionSection.value,
           start: "top top",
           end: () => `+=${getScrollAmount() * -1}`,
           pin: true,
           animation: tween,
           scrub: 1,
           invalidateOnRefresh: true,
           onUpdate: (self) => {
              scrollProgress.value = self.progress * 100
           }
        })
     }
  }, collectionSection.value!)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section ref="collectionSection" class="relative bg-white dark:bg-[#111] overflow-hidden">
     <div class="sticky top-0 h-screen flex items-center overflow-hidden">
        
        <!-- Sidebar Fixe -->
        <div class="absolute left-0 top-0 h-full w-12 md:w-20 border-r border-black/10 dark:border-white/10 z-30 bg-white dark:bg-[#111] flex items-center justify-center">
           <div class="relative h-full w-full flex items-center justify-center">
              <span class="-rotate-90 whitespace-nowrap font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#0066bf]">
                 {{ data.sidebar_text }}
              </span>
              <!-- Progress Bar Verticale -->
              <div class="absolute left-0 bottom-0 w-1 bg-[#0066bf] transition-all duration-100 ease-linear" :style="{ height: scrollProgress + '%' }"></div>
           </div>
        </div>

        <!-- Scroll Container -->
        <div ref="collectionTrack" class="flex items-center gap-12 md:gap-24 pl-24 md:pl-48 w-max h-full will-change-transform">
           
           <!-- Intro Card -->
           <div class="w-[80vw] md:w-[35vw] shrink-0 pr-12">
              <h2 class="text-6xl md:text-9xl font-syne font-black uppercase leading-[0.8] mb-8 text-[#1a1a1a] dark:text-white">
                 {{ data.intro.title_line_1 }}<br><span class="text-transparent stroke-text stroke-text-black dark:stroke-text-white">{{ data.intro.title_line_2 }}</span>
              </h2>
              <p class="font-mono text-xs md:text-sm max-w-sm opacity-70 text-justify">
                 {{ data.intro.description }}
              </p>
           </div>

           <!-- Cards Produits -->
           <div 
              v-for="look in data.looks" 
              :key="look.id" 
              class="relative w-[85vw] md:w-[45vw] h-[60vh] md:h-[75vh] shrink-0 group grayscale hover:grayscale-0 transition-all duration-700 hover-trigger cursor-none"
           >  
              <NuxtLink :to="look.url" class="absolute inset-0 z-20"></NuxtLink>
              <div class="w-full h-full overflow-hidden relative bg-[#eee] dark:bg-[#222]">
                 <img :src="look.image" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out" loading="lazy" />
                 
                 <div class="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div class="flex justify-between items-end border-b border-white/30 pb-4 mb-2">
                       <h4 class="text-2xl md:text-4xl font-syne font-bold uppercase">{{ look.name }}</h4>
                       <span class="font-mono text-sm md:text-lg font-bold text-[#0066bf]">{{ look.price_formatted }}</span>
                    </div>
                    <div class="flex justify-between items-center font-mono text-[10px] uppercase opacity-80">
                       <span>{{ look.material }}</span>
                       <span v-if="look.tag" class="bg-white text-black px-2 py-0.5 rounded-sm">{{ look.tag }}</span>
                    </div>
                 </div>
              </div>
           </div>

           <!-- "Voir Plus" -->
           <div class="w-[50vw] shrink-0 h-[70vh] flex items-center justify-center border-l border-black/10 dark:border-white/10 hover-trigger">
              <NuxtLink :to="data.see_more_link.url" class="text-4xl md:text-6xl font-syne font-black uppercase text-transparent stroke-text stroke-text-black dark:stroke-text-white hover:text-[#0066bf] hover:stroke-0 transition-all duration-300">
                 {{ data.see_more_link.label }} ->
              </NuxtLink>
           </div>
        </div>
     </div>
  </section>
</template>

<style scoped>
.font-syne { font-family: 'Syne', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }
.stroke-text {
  -webkit-text-stroke: 1px currentColor;
  color: transparent;
}
.stroke-text-black { -webkit-text-stroke-color: #000; }
.stroke-text-white { -webkit-text-stroke-color: #fff; }
.dark .stroke-text-white { -webkit-text-stroke-color: #fff; }
.cursor-none { cursor: none; }
</style>
