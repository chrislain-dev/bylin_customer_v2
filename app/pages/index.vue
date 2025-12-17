<template>
  <div
    class="relative w-full bg-[#f0f0f0] text-[#1a1a1a] dark:bg-[#050505] dark:text-[#e1e1e1] selection:bg-[#0066bf] selection:text-white cursor-none">

    <!-- 0. EFFETS GLOBAUX -->
    <!-- Grain Overlay -->
    <div
      class="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
    </div>

    <!-- Custom Cursor -->
    <div ref="cursorRef"
      class="fixed top-0 left-0 w-4 h-4 bg-[#0066bf] rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out hidden md:block">
    </div>
    <div ref="cursorFollowerRef"
      class="fixed top-0 left-0 w-12 h-12 border border-[#0066bf] rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out hidden md:block">
    </div>

    <!-- CONTENEUR SCROLL (Lenis) -->
    <div ref="mainContainer">

      <template v-if="content">
        <!-- 1. HERO SECTION -->
        <homeHeroSection :data="content.hero" />

        <!-- 2. SECTION CATÉGORIES -->
        <homeCategoryExplorer :data="content.categories_explorer" />

        <!-- 3. HORIZONTAL SCROLL -->
        <homeLookScroll :data="content.new_collection_scroll" />

        <!-- 4. SECTION BOUTIQUE GRID -->
        <homeProductGrid :title="content.shop_selection.title" :items="content.shop_selection.items" />

        <!-- 5. FAQ -->
        <homeFaqSection :items="content.faq" />
      </template>

      <div v-else-if="pending" class="h-screen w-full flex items-center justify-center">
        <span class="font-syne font-bold text-xl animate-pulse">LOADING...</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import Lenis from '@studio-freight/lenis'
import type { HomeContentResponse } from '~/types/home'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'default'
})

// --- DATA FETCHING ---
const { data, pending } = await useApi<HomeContentResponse>('/content/home')
const content = computed(() => data.value?.home_content)

// --- REFS ---
const mainContainer = ref<HTMLElement | null>(null)
const cursorRef = ref<HTMLElement | null>(null)
const cursorFollowerRef = ref<HTMLElement | null>(null)

// --- LIFECYCLE ---
let lenis: Lenis | null = null

onMounted(() => {
  // Custom Cursor Movement
  const moveCursor = (e: MouseEvent) => {
    if (cursorRef.value && cursorFollowerRef.value) {
      gsap.to(cursorRef.value, { x: e.clientX - 8, y: e.clientY - 8, duration: 0 })
      gsap.to(cursorFollowerRef.value, { x: e.clientX - 24, y: e.clientY - 24, duration: 0.15 })

      // Check for hover trigger manually since components are now separated
      const target = e.target as HTMLElement
      const isHoverTrigger = target.closest('.hover-trigger')

      if (isHoverTrigger) {
        gsap.to(cursorFollowerRef.value, { scale: 1.5, borderColor: 'transparent', backgroundColor: 'rgba(0, 102, 191, 0.2)', duration: 0.3 })
      } else {
        gsap.to(cursorFollowerRef.value, { scale: 1, borderColor: '#0066bf', backgroundColor: 'transparent', duration: 0.3 })
      }
    }
  }
  window.addEventListener('mousemove', moveCursor)

  // Init Lenis
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  function raf(time: number) {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', () => { })
  lenis?.destroy()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400&display=swap');

.font-syne {
  font-family: 'Syne', sans-serif;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

/* Utilitaires custom */
.cursor-none {
  cursor: none;
}
</style>