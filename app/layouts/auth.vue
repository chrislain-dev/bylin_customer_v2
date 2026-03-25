<template>
      <div class="relative w-full h-screen overflow-hidden flex bg-[#0066bf] font-syne text-white">

            <!-- LEFT PANEL - Optimized with CSS animations -->
            <div ref="leftPanelRef"
                  class="hidden lg:flex w-[40%] relative overflow-hidden bg-black z-10 flex-col justify-between p-12 animate-slide-in-left">

                  <div class="absolute inset-0 z-0">
                        <div class="absolute inset-0 bg-[#0066bf]/20 mix-blend-overlay z-20 pointer-events-none"></div>
                        <div
                              class="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-30 pointer-events-none">
                        </div>

                        <Transition name="fade-img">
                              <NuxtImg :key="currentImage" :src="currentImage" format="webp" quality="75"
                                    sizes="lg:50vw xl:40vw" loading="lazy" placeholder
                                    class="absolute inset-0 w-full h-full object-cover animate-kenburns opacity-80 z-10"
                                    alt="Bylin Atmosphere" />
                        </Transition>
                  </div>

                  <div class="relative z-40">
                        <nuxt-link to="/">
                              <NuxtImg src="/images/logo-white.png" alt="Bylin Logo" width="120" class="w-24" />
                        </nuxt-link>
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

            <!-- RIGHT PANEL - Optimized -->
            <div ref="rightPanelRef"
                  class="w-full lg:w-[60%] relative flex flex-col items-center justify-center p-6 lg:p-24 z-0 animate-fade-in">
                  
                  <!-- Orbs with reduced blur for better performance -->
                  <div
                        class="absolute top-[-10%] right-[-10%] w-125 h-125 bg-[#000000]/20 rounded-full blur-[50px] pointer-events-none animate-float-slow">
                  </div>
                  <div
                        class="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-gray-900/20 rounded-full blur-[40px] pointer-events-none animate-float-slow-reverse">
                  </div>

                  <div class="relative z-10 w-full max-w-md">
                        <slot />
                  </div>

                  <div class="absolute bottom-6 w-full text-center text-white text-[10px] font-mono uppercase z-10">
                        &copy; {{ new Date().getFullYear() }} Bylin Style — Cotonou
                  </div>
            </div>

      </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

let timer: ReturnType<typeof setInterval>

onMounted(() => {
      timer = setInterval(() => {
            quoteIndex.value = (quoteIndex.value + 1) % quotes.length
            currentQuote.value = quotes[quoteIndex.value]

            imageIndex.value = (imageIndex.value + 1) % images.length
            currentImage.value = images[imageIndex.value]
      }, 5000)
})

onUnmounted(() => {
      clearInterval(timer)
})
</script>

<style scoped>
/* Slide in from left - replaces GSAP */
@keyframes slide-in-left {
      from {
            transform: translateX(-100%);
      }
      to {
            transform: translateX(0);
      }
}

.animate-slide-in-left {
      animation: slide-in-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Fade in - replaces GSAP */
@keyframes fade-in {
      from {
            opacity: 0;
      }
      to {
            opacity: 1;
      }
}

.animate-fade-in {
      animation: fade-in 0.6s ease-out 0.3s forwards;
      opacity: 0;
}

/* Floating orbs - replaces GSAP infinite animations */
@keyframes float-slow {
      0%, 100% {
            transform: translate(0, 0);
      }
      50% {
            transform: translate(30px, 30px);
      }
}

@keyframes float-slow-reverse {
      0%, 100% {
            transform: translate(0, 0);
      }
      50% {
            transform: translate(-20px, -25px);
      }
}

.animate-float-slow {
      animation: float-slow 10s ease-in-out infinite;
      will-change: transform;
}

.animate-float-slow-reverse {
      animation: float-slow-reverse 12s ease-in-out infinite;
      animation-delay: 1s;
      will-change: transform;
}

/* Ken Burns - optimized */
.animate-kenburns {
      animation: kenburns 20s ease-out infinite alternate;
      will-change: transform;
}

@keyframes kenburns {
      0% {
            transform: scale(1);
      }
      100% {
            transform: scale(1.1);
      }
}

/* Fade slide transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
      transition: all 0.4s ease;
}

.fade-slide-enter-from {
      opacity: 0;
      transform: translateY(15px);
}

.fade-slide-leave-to {
      opacity: 0;
      transform: translateY(-15px);
}

/* Image fade transition */
.fade-img-enter-active,
.fade-img-leave-active {
      transition: opacity 1s ease-in-out;
}

.fade-img-enter-from,
.fade-img-leave-to {
      opacity: 0;
}

.fade-img-leave-active {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
}
</style>