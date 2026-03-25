<template>
  <div class="flex gap-4">
    <!-- Thumbnails verticaux (style Shein) -->
    <div v-if="images && images.length > 1" class="hidden md:flex flex-col gap-2 w-20 flex-shrink-0">
      <button 
        v-for="(img, i) in images" 
        :key="i"
        @click="currentIndex = i"
        class="relative w-20 h-24 overflow-hidden rounded border-2 transition-all duration-200"
        :class="currentIndex === i 
          ? 'border-[#0066bf] shadow-lg' 
          : 'border-transparent hover:border-gray-300'"
      >
        <img 
          :src="img.original_url || img.preview_url" 
          :alt="`Thumbnail ${i + 1}`"
          class="w-full h-full object-cover transition-transform duration-200"
          :class="{ 'scale-105': currentIndex === i }"
          loading="lazy" 
        />
        <!-- Indicator overlay -->
        <div 
          v-if="currentIndex === i" 
          class="absolute inset-0 bg-[#0066bf]/10 pointer-events-none"
        />
      </button>
    </div>

    <!-- Main Image Container -->
    <div class="flex-1 space-y-4">
      <!-- Main Image with Zoom -->
      <div 
        class="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden group cursor-zoom-in rounded-lg"
        @mousemove="handleMouseMove"
        @mouseleave="isZooming = false"
        @mouseenter="isZooming = true"
        @click="openLightbox"
      >
        <!-- Main product image -->
        <img 
          :src="currentImage?.original_url || currentImage?.preview_url || 'https://placehold.co/600x800?text=No+Image'" 
          :alt="`Image ${currentIndex + 1}`"
          class="w-full h-full object-cover transition-transform duration-200"
          :style="isZooming ? zoomStyle : {}"
          loading="lazy" 
        />
        
        <!-- Zoom indicator -->
        <div class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <Icon name="heroicons:magnifying-glass-plus" class="w-4 h-4" />
          <span class="hidden sm:inline">Cliquez pour agrandir</span>
        </div>

        <!-- Navigation arrows (mobile and on hover) -->
        <button 
          v-if="images && images.length > 1" 
          @click.stop="prevImage"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        >
          <Icon name="heroicons:chevron-left" class="w-5 h-5" />
        </button>
        <button 
          v-if="images && images.length > 1" 
          @click.stop="nextImage"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        >
          <Icon name="heroicons:chevron-right" class="w-5 h-5" />
        </button>

        <!-- Image counter badge -->
        <div class="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-mono">
          {{ currentIndex + 1 }} / {{ images?.length || 1 }}
        </div>

        <!-- Dots indicator (mobile) -->
        <div v-if="images && images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
          <button 
            v-for="(_, i) in images" 
            :key="i"
            @click.stop="currentIndex = i"
            class="w-2 h-2 rounded-full transition-all duration-200"
            :class="currentIndex === i ? 'bg-[#0066bf] w-4' : 'bg-white/70'"
          />
        </div>
      </div>

      <!-- Thumbnails horizontaux (mobile) -->
      <div v-if="images && images.length > 1" class="flex md:hidden gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <button 
          v-for="(img, i) in images" 
          :key="i"
          @click="currentIndex = i"
          class="flex-shrink-0 w-16 h-20 overflow-hidden rounded border-2 transition-all"
          :class="currentIndex === i ? 'border-[#0066bf]' : 'border-transparent'"
        >
          <img 
            :src="img.original_url || img.preview_url" 
            :alt="`Thumbnail ${i + 1}`"
            class="w-full h-full object-cover"
            loading="lazy" 
          />
        </button>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div 
          v-if="showLightbox" 
          class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          @click="showLightbox = false"
        >
          <!-- Close button -->
          <button 
            @click="showLightbox = false" 
            class="absolute top-6 right-6 text-white/80 hover:text-white z-10 transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-8 h-8" />
          </button>

          <!-- Counter -->
          <div class="absolute top-6 left-6 text-white/80 font-mono text-sm">
            {{ currentIndex + 1 }} / {{ images?.length || 1 }}
          </div>

          <!-- Navigation arrows -->
          <button 
            v-if="images && images.length > 1" 
            @click.stop="prevImage"
            class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <Icon name="heroicons:chevron-left" class="w-6 h-6" />
          </button>
          <button 
            v-if="images && images.length > 1" 
            @click.stop="nextImage"
            class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <Icon name="heroicons:chevron-right" class="w-6 h-6" />
          </button>

          <!-- Full image -->
          <img 
            :src="currentImage?.original_url" 
            :alt="`Image ${currentIndex + 1}`"
            class="max-w-[90vw] max-h-[85vh] object-contain"
            @click.stop
          />

          <!-- Thumbnails in lightbox -->
          <div 
            v-if="images && images.length > 1" 
            class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm"
          >
            <button 
              v-for="(img, i) in images" 
              :key="i"
              @click.stop="currentIndex = i"
              class="w-12 h-14 overflow-hidden rounded border-2 transition-all"
              :class="currentIndex === i ? 'border-[#0066bf] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img 
                :src="img.preview_url || img.original_url" 
                :alt="`Thumb ${i + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { SpatieMedia } from '~/types/shared'

const props = defineProps<{
  images?: SpatieMedia[]
}>()

const currentIndex = ref(0)
const showLightbox = ref(false)
const isZooming = ref(false)
const mousePosition = ref({ x: 50, y: 50 })

const currentImage = computed(() => {
  return props.images?.[currentIndex.value] || null
})

const zoomStyle = computed(() => ({
  transform: 'scale(2)',
  transformOrigin: `${mousePosition.value.x}% ${mousePosition.value.y}%`
}))

const handleMouseMove = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  mousePosition.value = {
    x: ((e.clientX - rect.left) / rect.width) * 100,
    y: ((e.clientY - rect.top) / rect.height) * 100
  }
}

const openLightbox = () => {
  showLightbox.value = true
}

const prevImage = () => {
  if (!props.images) return
  currentIndex.value = currentIndex.value > 0 
    ? currentIndex.value - 1 
    : props.images.length - 1
}

const nextImage = () => {
  if (!props.images) return
  currentIndex.value = currentIndex.value < props.images.length - 1 
    ? currentIndex.value + 1 
    : 0
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!showLightbox.value) return
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'Escape') showLightbox.value = false
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})

// Reset index when images change
watch(() => props.images, () => {
  currentIndex.value = 0
})
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>