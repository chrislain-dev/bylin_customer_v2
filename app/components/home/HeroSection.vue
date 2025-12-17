<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { HeroSection } from '~/types/home'

const props = defineProps<{
  data: HeroSection
}>()

const heroImageContainer = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
     // 1. Hero Reveal
     const tl = gsap.timeline()
     tl.to(".reveal-text", { y: 0, duration: 1.5, ease: "power4.out", stagger: 0.1 })
       .to(".reveal-opacity", { opacity: 1, duration: 1, stagger: 0.2 }, "-=1")

     // 2. Parallax Hero Image
     if(heroImageContainer.value) {
        gsap.to(heroImageContainer.value.querySelector('img'), {
           yPercent: 30,
           ease: "none",
           scrollTrigger: {
              trigger: heroImageContainer.value,
              start: "top top",
              end: "bottom top",
              scrub: true
           }
        })
     }
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section class="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#0066bf]">
      <!-- Image Parallaxe -->
      <div ref="heroImageContainer" class="absolute inset-0 z-0 opacity-80 mix-blend-normal">
         <img 
           :src="data.background_image" 
           class="w-full h-full object-cover grayscale brightness-20 scale-110 will-change-transform" 
           alt="Hero Background"
         />
      </div>
      
      <!-- Textes -->
      <div class="relative z-10 text-center w-full select-none pointer-events-none mix-blend-difference text-[#0066bf] px-4">
        <h1 class="hero-title text-[15vw] md:text-[18vw] leading-[0.8] font-black tracking-tighter font-syne uppercase z-20 relative overflow-hidden">
           <span class="block translate-y-full reveal-text">{{ data.title_line_1 }}</span>
        </h1>
        <h1 class="hero-title text-[15vw] md:text-[18vw] leading-[0.8] font-black tracking-tighter font-syne uppercase ml-[10vw] md:ml-[15vw] -mt-[2vw] md:-mt-[4vw] z-10 relative overflow-hidden">
           <span class="block translate-y-full reveal-text text-transparent stroke-text stroke-text-white">{{ data.title_line_2 }}</span>
        </h1>
      </div>
      
      <div class="absolute bottom-8 left-6 md:bottom-12 md:left-24 text-xs font-mono uppercase tracking-widest z-20 flex flex-col gap-2 text-white reveal-opacity opacity-0">
        <span class="bg-[#0066bf] px-3 py-1 w-max">{{ data.collection_tag }}</span>
        <span class="font-bold">{{ data.location }}</span>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 right-6 md:right-12 animate-bounce z-20 reveal-opacity opacity-0">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
      </div>
  </section>
</template>

<style scoped>
.font-syne { font-family: 'Syne', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

/* Text Stroke Effect */
.stroke-text {
  -webkit-text-stroke: 1px currentColor;
  color: transparent;
}
.stroke-text-white { -webkit-text-stroke-color: #fff; }
</style>
