<template>
  <div class="relative w-full h-screen overflow-hidden flex bg-[#0066bf] font-syne text-white">
    
    <!-- 1. GAUCHE -->
    <div ref="leftPanelRef" class="hidden lg:flex w-[40%] relative overflow-hidden bg-black z-10 flex-col justify-between p-12">
      
      <!-- BACKGROUND -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-[#0066bf]/20 mix-blend-overlay z-20 pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-30 pointer-events-none"></div>
        
        <Transition name="fade-img">
          <!-- UTILISATION DE NUXT IMAGE ICI -->
          <NuxtImg 
            :key="currentImage"
            :src="currentImage"
            
            format="webp" 
            quality="80"
            sizes="lg:50vw xl:40vw"
            
            class="absolute inset-0 w-full h-full object-cover animate-kenburns opacity-80 z-10" 
            alt="Bylin Atmosphere"
          />
        </Transition>
      </div>

      <!-- Le reste du code ne change pas -->
      <div class="relative z-40">
        <!-- Vous pouvez aussi optimiser le logo -->
        <NuxtImg src="/images/logo-white.png" alt="Bylin Logo" width="96" class="w-24" />
      </div>

      <div class="relative z-40 max-w-md">
        <div class="h-1 w-12 bg-[#0066bf] mb-6"></div>
        <div class="h-24">
          <Transition name="fade-slide" mode="out-in">
            <p :key="currentQuote" class="text-2xl font-bold leading-tight tracking-tight">
              "{{ currentQuote }}"
            </p>
          </Transition>
        </div>
        <div class="flex gap-2 mt-8">
           <div v-for="(_, i) in quotes" :key="i" 
                class="h-1 rounded-full transition-all duration-500"
                :class="i === quoteIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'"></div>
        </div>
      </div>
    </div>

    <!-- 2. DROITE -->
    <div ref="rightPanelRef" class="w-full lg:w-[60%] relative flex flex-col items-center justify-center p-6 lg:p-24 z-0">
      <div class="absolute inset-0 opacity-[50] pointer-events-none z-50"></div>
      <div ref="orb1" class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#000000]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div ref="orb2" class="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gray-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <slot />
      </div>

      <div class="absolute bottom-6 w-full text-center text-white/20 text-[10px] font-mono uppercase z-10">
        &copy; 2025 Bylin Style — Cotonou
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
// Le script reste IDENTIQUE à celui que je vous ai donné précédemment
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const images = [
  "/images/IMG_0027_1.jpg",
  "/images/IMG_0062.jpg",
  "/images/IMG_0090.jpg"
]
const currentImage = ref(images[0])
const imageIndex = ref(0)

const quotes = [
  "L'élégance n'est pas une option, c'est une discipline.",
  "Conçu à Cotonou. Porté par le monde.",
  "Le silence du style fait plus de bruit que les mots.",
  "Une armure urbaine pour l'esprit moderne."
]
const currentQuote = ref(quotes[0])
const quoteIndex = ref(0)

const leftPanelRef = ref(null)
const rightPanelRef = ref(null)
const orb1 = ref(null)
const orb2 = ref(null)

let timer: ReturnType<typeof setInterval>
let ctx: gsap.Context

onMounted(() => {
  timer = setInterval(() => {
    quoteIndex.value = (quoteIndex.value + 1) % quotes.length
    currentQuote.value = quotes[quoteIndex.value]

    imageIndex.value = (imageIndex.value + 1) % images.length
    currentImage.value = images[imageIndex.value]
  }, 5000)

  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    tl.from(leftPanelRef.value, { xPercent: -100, duration: 1.2, ease: "power4.out" })
      .from(rightPanelRef.value, { opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8")

    gsap.to(orb1.value, { x: 50, y: 50, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" })
    gsap.to(orb2.value, { x: -30, y: -40, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 })
  })
})

onUnmounted(() => {
  clearInterval(timer)
  if(ctx) ctx.revert()
})
</script>

<style scoped>
/* Les styles restent IDENTIQUES */
.animate-kenburns {
  animation: kenburns 20s ease-out infinite alternate;
  will-change: transform;
}

@keyframes kenburns {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.5s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-20px); }

.fade-img-enter-active, .fade-img-leave-active { transition: opacity 1.5s ease-in-out; }
.fade-img-enter-from, .fade-img-leave-to { opacity: 0; }
.fade-img-leave-active { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
</style>