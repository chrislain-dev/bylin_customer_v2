<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import type { CategoriesExplorer } from '~/types/home'

const props = defineProps<{
  data: CategoriesExplorer
}>()

const onHoverEnter = (e: MouseEvent) => {
    // Logic for cursor hover effect can be handled globally or emitted
    // For now, let's keep it simple or assume a global cursor context if needed
    // But index.vue had onHoverEnter triggering cursorFollowerRef.
    // If we want to keep the custom cursor effect efficiently, we might need a Global Cursor system.
    // For this task, I'll emit events so parent can handle if it still holds the cursor logic.
    const target = e.currentTarget as HTMLElement
    // emit('hover-enter', target) 
}

const onHoverLeave = () => {
    // emit('hover-leave')
}

// NOTE: Since the cursor logic is in the parent (index.vue), we might want to 
// 1. Move cursor logic to a global composable/component
// 2. Or Emit events
// 3. Or just trust that the CSS 'cursor-none' and global listeners work if set up right.
// The original code had specific GSAP animations on the cursor follower.
// I will keep the `hover-trigger` class which might be used later.
</script>

<template>
  <section class="py-24 px-6 relative z-20 bg-[#f0f0f0] dark:bg-[#050505]">
     <div class="container mx-auto">
        <div class="flex items-end justify-between mb-16 border-b border-black/10 dark:border-white/10 pb-6">
           <h2 class="text-4xl md:text-7xl font-syne font-black uppercase text-reveal-trigger">{{ data.display_title }}</h2>
           <span class="hidden md:block font-mono text-xs uppercase text-[#0066bf]">{{ data.subtitle }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div 
              v-for="(cat, index) in data.items" 
              :key="index" 
              class="group relative h-[50vh] md:h-[70vh] overflow-hidden border border-black/10 dark:border-white/10 cursor-none hover-trigger"
           >
              <!-- Link wrapper if URL exists -->
              <NuxtLink :to="cat.url" class="absolute inset-0 z-20"></NuxtLink>

              <!-- Image Overlay -->
              <div class="absolute inset-0 z-0 overflow-hidden">
                 <img :src="cat.image" class="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0" loading="lazy" />
                 <div class="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              
              <div class="absolute inset-0 z-10 flex flex-col justify-between p-6 mix-blend-difference text-white pointer-events-none">
                 <span class="font-mono text-xs">0{{ index + 1 }}</span>
                 <div class="overflow-hidden">
                    <h3 class="text-4xl md:text-5xl font-syne font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                       {{ cat.name }}
                    </h3>
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
.cursor-none { cursor: none; }
</style>
