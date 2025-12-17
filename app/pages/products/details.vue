<template>
  <div class="w-full bg-[#f0f0f0] text-[#1a1a1a] dark:bg-[#050505] dark:text-[#e1e1e1] font-syne min-h-screen">
    <div class="fixed inset-0 pointer-events-none z-[50] opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

    <div class="container mx-auto px-4 md:px-6 pt-32 pb-24">
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        <!-- GAUCHE : Galerie Images (Scroll) -->
        <div class="w-full lg:w-3/5 space-y-4">
           <div v-for="(img, i) in product.images" :key="i" class="relative w-full aspect-[4/5] bg-gray-200 overflow-hidden group">
              <img :src="img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           </div>
        </div>

        <!-- DROITE : Info Sticky -->
        <div class="w-full lg:w-2/5 relative">
           <div class="sticky top-32 space-y-8">
              
              <!-- Header -->
              <div class="border-b border-black/10 dark:border-white/10 pb-6">
                 <div class="flex justify-between items-start mb-2">
                    <h1 class="text-4xl md:text-6xl font-black uppercase leading-none">{{ product.name }}</h1>
                    <span class="font-mono text-xl font-bold text-[#0066bf]">{{ product.price }}</span>
                 </div>
                 <p class="font-mono text-xs opacity-60 uppercase">{{ product.collection }} — {{ product.ref }}</p>
              </div>

              <!-- Description -->
              <p class="font-mono text-sm leading-relaxed opacity-80 text-justify">
                 {{ product.description }}
              </p>

              <!-- Selecteur Taille -->
              <div>
                 <div class="flex justify-between mb-2 font-mono text-xs uppercase">
                    <span>Taille</span>
                    <button class="underline decoration-[#0066bf]">Guide des tailles</button>
                 </div>
                 <div class="grid grid-cols-4 gap-2">
                    <button 
                       v-for="size in ['S', 'M', 'L', 'XL']" 
                       :key="size"
                       @click="selectedSize = size"
                       class="border border-black/20 dark:border-white/20 py-3 hover:bg-[#0066bf] hover:text-white hover:border-[#0066bf] transition-all"
                       :class="selectedSize === size ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black' : ''"
                    >
                       {{ size }}
                    </button>
                 </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3 pt-4">
                 <button class="w-full bg-[#0066bf] text-white py-4 font-mono text-sm uppercase tracking-widest hover:bg-[#005bb5] transition-colors">
                    Ajouter au Panier
                 </button>
                 <p class="text-center font-mono text-[10px] opacity-50 uppercase">Expédition sous 48h depuis Cotonou</p>
              </div>

              <!-- Accordions Details -->
              <div class="border-t border-black/10 dark:border-white/10 pt-4 space-y-4">
                 <div v-for="item in details" :key="item.title" class="cursor-pointer group" @click="item.open = !item.open">
                    <div class="flex justify-between items-center py-2">
                       <span class="font-bold uppercase text-sm">{{ item.title }}</span>
                       <span class="text-xl font-light transform transition-transform" :class="item.open ? 'rotate-45 text-[#0066bf]' : ''">+</span>
                    </div>
                    <div v-show="item.open" class="pb-4 font-mono text-xs opacity-70">
                       {{ item.content }}
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedSize = ref('M')

const product = {
   name: "Nocturne Trench",
   price: "245.000 FCFA",
   collection: "Confidence 2025",
   ref: "REF-BY-001",
   description: "Une pièce maîtresse de la collection. Ce trench déstructuré en laine froide et empiècements de cuir italien incarne la vision brutaliste de Bylin. Coupe oversize, épaules marquées et finitions brutes.",
   images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
   ]
}

const details = ref([
   { title: "Composition & Entretien", content: "100% Laine Vierge. Empiècements 100% Cuir d'agneau. Nettoyage à sec uniquement.", open: false },
   { title: "Livraison & Retours", content: "Livraison offerte au Bénin. Retours sous 14 jours.", open: false }
])
</script>