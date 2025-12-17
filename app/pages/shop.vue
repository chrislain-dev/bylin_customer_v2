<template>
  <div class="relative w-full min-h-screen bg-[#f0f0f0] text-[#1a1a1a] dark:bg-[#050505] dark:text-[#e1e1e1] selection:bg-[#0066bf] selection:text-white cursor-none font-syne">
    
    <!-- 0. EFFETS GLOBAUX -->
    <div class="fixed inset-0 pointer-events-none z-[50] opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    
    <!-- Custom Cursor -->
    <div ref="cursorRef" class="fixed top-0 left-0 w-3 h-3 bg-[#0066bf] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"></div>
    <div ref="cursorFollowerRef" class="fixed top-0 left-0 w-10 h-10 border border-[#0066bf] rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out hidden md:block"></div>

    <!-- CONTENEUR SCROLL (Lenis) -->
    <div ref="mainContainer" class="pt-32 pb-24">
      
      <!-- 1. EN-TÊTE PRINCIPAL -->
      <section class="container mx-auto px-6 mb-16 md:mb-20">
         <div>
            <h1 class="text-[12vw] md:text-[8vw] leading-[0.8] font-black uppercase tracking-tighter overflow-hidden">
               <span class="block reveal-text translate-y-full">Catalogue</span>
            </h1>
            <p class="font-mono text-xs md:text-sm mt-6 max-w-md opacity-70 reveal-opacity opacity-0 pl-1 border-l-2 border-[#0066bf]">
               Collection Confidence 2025.<br>Pièces limitées conçues à Cotonou.
            </p>
         </div>
      </section>

      <!-- 2. ZONE DE CONTENU (LAYOUT SPLIT) -->
      <section class="container mx-auto px-6">
         <!-- Bouton Mobile Toggle Filtres -->
         <button @click="showMobileFilters = !showMobileFilters" class="lg:hidden w-full mb-8 py-3 border border-black/20 dark:border-white/20 uppercase font-mono text-xs flex justify-between px-4 items-center">
            <span>Filtres & Tri</span>
            <span>{{ showMobileFilters ? '-' : '+' }}</span>
         </button>

         <div class="flex flex-col lg:flex-row gap-12 xl:gap-20">
            
            <!-- A. GAUCHE : FILTRES COMPLETS (Sidebar Sticky) -->
            <aside 
               class="lg:w-1/4 min-w-[220px] reveal-opacity opacity-0 z-30 transition-all duration-500 overflow-hidden"
               :class="showMobileFilters ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100 mb-0 lg:mb-0'"
            >
               <div class="lg:sticky lg:top-32 space-y-10 pr-4">
                  
                  <!-- 1. Catégories -->
                  <div>
                     <h3 class="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4">Catégorie</h3>
                     <div class="flex flex-col gap-2">
                        <button 
                           v-for="cat in categories" 
                           :key="cat"
                           @click="activeCategory = cat"
                           class="group flex items-center justify-between font-mono text-xs uppercase tracking-widest cursor-none hover-trigger py-1 text-left"
                           :class="activeCategory === cat ? 'text-[#0066bf] font-bold' : 'opacity-60 hover:opacity-100'"
                           @mouseenter="onHoverEnter" 
                           @mouseleave="onHoverLeave"
                        >
                           <span class="transition-transform duration-300" :class="activeCategory === cat ? 'translate-x-2' : 'group-hover:translate-x-1'">{{ cat }}</span>
                           <span v-if="activeCategory === cat" class="w-1.5 h-1.5 rounded-full bg-[#0066bf]"></span>
                        </button>
                     </div>
                  </div>

                  <!-- 2. Disponibilité (Type) -->
                  <div>
                     <h3 class="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4">Disponibilité</h3>
                     <div class="flex flex-col gap-2">
                        <label v-for="type in types" :key="type.value" class="flex items-center gap-3 cursor-none hover-trigger group">
                           <input type="checkbox" :value="type.value" v-model="selectedTypes" class="hidden">
                           <!-- Custom Checkbox -->
                           <div class="w-3 h-3 border border-current flex items-center justify-center transition-colors group-hover:border-[#0066bf]">
                              <div class="w-1.5 h-1.5 bg-[#0066bf]" v-if="selectedTypes.includes(type.value)"></div>
                           </div>
                           <span class="font-mono text-xs uppercase opacity-70 group-hover:opacity-100 transition-opacity" :class="selectedTypes.includes(type.value) ? 'font-bold text-[#1a1a1a] dark:text-white' : ''">
                              {{ type.label }}
                           </span>
                        </label>
                     </div>
                  </div>

                  <!-- 3. Marques -->
                  <div>
                     <h3 class="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4">Marques</h3>
                     <div class="flex flex-col gap-2">
                        <label v-for="brand in brands" :key="brand" class="flex items-center gap-3 cursor-none hover-trigger group">
                           <input type="checkbox" :value="brand" v-model="selectedBrands" class="hidden">
                           <div class="w-3 h-3 border border-current flex items-center justify-center transition-colors group-hover:border-[#0066bf]">
                              <div class="w-1.5 h-1.5 bg-[#0066bf]" v-if="selectedBrands.includes(brand)"></div>
                           </div>
                           <span class="font-mono text-xs uppercase opacity-70 group-hover:opacity-100 transition-opacity" :class="selectedBrands.includes(brand) ? 'font-bold text-[#1a1a1a] dark:text-white' : ''">
                              {{ brand }}
                           </span>
                        </label>
                     </div>
                  </div>

                  <!-- 4. Couleurs -->
                  <div>
                     <h3 class="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-4">Couleurs</h3>
                     <div class="flex flex-wrap gap-2">
                        <button 
                           v-for="col in colors" 
                           :key="col.name"
                           @click="toggleColor(col.name)"
                           class="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-all cursor-none hover-trigger"
                           :class="selectedColors.includes(col.name) ? 'scale-110 border-[#0066bf] dark:border-[#0066bf] ring-1 ring-[#0066bf] ring-offset-2 ring-offset-[#f0f0f0] dark:ring-offset-[#050505]' : 'opacity-70 hover:opacity-100'"
                           :title="col.name"
                           @mouseenter="onHoverEnter" @mouseleave="onHoverLeave"
                        >
                           <div class="w-full h-full rounded-full" :style="{ backgroundColor: col.hex }"></div>
                        </button>
                     </div>
                  </div>

                  <!-- Reset Button -->
                  <div v-if="hasActiveFilters" class="pt-4 border-t border-black/10 dark:border-white/10">
                     <button @click="resetFilters" class="text-[10px] uppercase font-mono underline decoration-red-500 hover:text-red-500 transition-colors cursor-none hover-trigger">
                        Réinitialiser tout
                     </button>
                  </div>

               </div>
            </aside>

            <!-- B. DROITE : PRODUITS -->
            <main class="lg:w-3/4 flex-1 min-h-[60vh]">
               
               <!-- Toolbar -->
               <div class="flex justify-between items-center mb-8 reveal-opacity opacity-0 border-b border-black/10 dark:border-white/10 pb-4 sticky top-20 bg-[#f0f0f0] dark:bg-[#050505] z-20 pt-4">
                  <div class="flex items-center gap-2">
                     <span class="font-mono text-[10px] uppercase tracking-wider opacity-50">
                        {{ filteredProducts.length }} Produit(s)
                     </span>
                     <!-- Tags des filtres actifs -->
                     <div class="hidden md:flex gap-2 ml-4">
                        <span v-for="filter in activeFilterTags" :key="filter" class="text-[8px] border border-current px-1 py-0.5 uppercase opacity-60">
                           {{ filter }}
                        </span>
                     </div>
                  </div>
                  
                  <div class="flex gap-4">
                     <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'text-[#0066bf]' : 'opacity-30'" class="hover:opacity-100 transition-opacity cursor-none hover-trigger">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                     </button>
                     <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'text-[#0066bf]' : 'opacity-30'" class="hover:opacity-100 transition-opacity cursor-none hover-trigger">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                     </button>
                  </div>
               </div>

               <!-- Grid -->
               <TransitionGroup 
                  name="product-list" 
                  tag="div" 
                  class="grid gap-x-6 gap-y-16 transition-all duration-500"
                  :class="viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'"
               >
                  <div 
                     v-for="product in filteredProducts" 
                     :key="product.id" 
                     class="group relative"
                     :class="viewMode === 'list' ? 'flex gap-6 items-start' : ''"
                  >
                     <!-- Image -->
                     <div class="relative overflow-hidden bg-gray-200 dark:bg-[#111] cursor-pointer hover-trigger" 
                          :class="viewMode === 'grid' ? 'aspect-[3/4] w-full mb-4' : 'w-24 md:w-48 aspect-[3/4] shrink-0'"
                          @mouseenter="onHoverEnter" 
                          @mouseleave="onHoverLeave"
                          @click="addToCart(product)"
                     >
                        <!-- Labels -->
                        <div class="absolute top-0 left-0 z-20 flex flex-col items-start gap-1 p-2">
                           <span v-if="product.tag" class="px-2 py-1 bg-white dark:bg-black text-[9px] font-mono uppercase tracking-wider border border-black/10 dark:border-white/10">
                              {{ product.tag }}
                           </span>
                           <span v-if="product.type === 'PRECOMMANDE'" class="px-2 py-1 bg-[#0066bf] text-white text-[9px] font-mono uppercase tracking-wider">
                              Préco
                           </span>
                        </div>

                        <img :src="product.image" class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 z-10" loading="lazy" />
                        <img :src="product.imageHover" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-10" loading="lazy" />

                        <!-- Quick Add (Grid) -->
                        <div v-if="viewMode === 'grid'" class="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <button class="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-[#0066bf] hover:text-white transition-colors">
                              +
                           </button>
                        </div>
                     </div>

                     <!-- Info -->
                     <div class="flex justify-between items-start" :class="viewMode === 'list' ? 'flex-1 py-2' : ''">
                        <div class="flex flex-col h-full">
                           <div class="mb-1">
                              <span class="text-[9px] opacity-50 uppercase tracking-widest mb-1 block">{{ product.brand }}</span>
                              <h3 class="text-lg font-bold uppercase leading-none mb-1 group-hover:text-[#0066bf] transition-colors cursor-pointer">{{ product.name }}</h3>
                           </div>
                           <p class="font-mono text-[10px] opacity-60 uppercase tracking-wide">{{ product.material }}</p>
                           
                           <!-- Description (List) -->
                           <p v-if="viewMode === 'list'" class="hidden md:block mt-3 text-xs opacity-70 max-w-lg leading-relaxed">
                              Une pièce signée {{ product.brand }}. Design intemporel et matériaux de première qualité. Disponible en édition limitée.
                           </p>
                           
                           <!-- Actions (List) -->
                           <div v-if="viewMode === 'list'" class="mt-auto pt-4 flex items-center gap-4">
                              <span class="font-mono font-bold">{{ product.price.toLocaleString() }} FCFA</span>
                              <button @click="addToCart(product)" class="text-[10px] uppercase underline hover:text-[#0066bf]">Ajouter au panier</button>
                           </div>
                        </div>
                        
                        <div v-if="viewMode === 'grid'" class="text-right">
                           <span class="font-mono text-sm font-bold block">{{ product.price.toLocaleString() }}</span>
                           <span class="text-[10px] opacity-50">FCFA</span>
                        </div>
                     </div>
                  </div>
               </TransitionGroup>

               <!-- Empty State -->
               <div v-if="filteredProducts.length === 0" class="py-32 flex flex-col items-center justify-center text-center opacity-50 font-mono border border-dashed border-black/20 dark:border-white/20">
                  <span class="text-4xl mb-4">∅</span>
                  <p>Aucun article ne correspond à vos critères.</p>
                  <button @click="resetFilters" class="mt-4 underline text-xs uppercase hover:text-[#0066bf]">Réinitialiser les filtres</button>
               </div>

            </main>
         </div>
      </section>
    </div>

    <!-- 5. CART DRAWER (Identique) -->
    <div class="fixed inset-0 z-[100] pointer-events-none">
       <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto" 
            :class="isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" 
            @click="isCartOpen = false">
       </div>
       <div class="absolute top-0 right-0 h-full w-full md:w-[450px] bg-white dark:bg-[#0a0a0a] border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-quart pointer-events-auto flex flex-col"
            :class="isCartOpen ? 'translate-x-0' : 'translate-x-full'">
            
            <div class="p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-[#f0f0f0] dark:bg-[#050505]">
               <h2 class="font-syne font-black text-2xl uppercase">Panier ({{ cartCount }})</h2>
               <button @click="isCartOpen = false" class="text-xl hover:text-[#0066bf] hover:rotate-90 transition-all cursor-none hover-trigger" @mouseenter="onHoverEnter" @mouseleave="onHoverLeave">✕</button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 space-y-6">
               <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center opacity-40">
                  <span class="font-syne text-4xl mb-2">VIDE</span>
                  <p class="font-mono text-xs">Votre style vous attend.</p>
               </div>
               <div v-for="(item, i) in cart" :key="i" class="flex gap-4 animate-in group">
                  <div class="w-20 h-24 bg-gray-200 shrink-0 overflow-hidden relative">
                     <img :src="item.image" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                     <div>
                        <h4 class="font-bold text-sm uppercase">{{ item.name }}</h4>
                        <span class="text-[10px] font-mono opacity-60">{{ item.brand }} — {{ item.material }}</span>
                     </div>
                     <div class="flex justify-between items-center">
                        <span class="font-mono text-xs">{{ item.price.toLocaleString() }} FCFA</span>
                        <button @click="removeFromCart(i)" class="text-[10px] uppercase underline hover:text-red-500">Retirer</button>
                     </div>
                  </div>
               </div>
            </div>

            <div class="p-6 border-t border-black/10 dark:border-white/10 bg-[#f0f0f0] dark:bg-[#050505]">
               <div class="flex justify-between items-end mb-6 font-syne font-bold text-xl uppercase">
                  <span>Total</span>
                  <span>{{ cartTotal.toLocaleString() }} FCFA</span>
               </div>
               <button class="w-full bg-[#1a1a1a] dark:bg-[#e1e1e1] text-white dark:text-black py-4 font-mono text-xs uppercase tracking-widest hover:bg-[#0066bf] dark:hover:bg-[#0066bf] hover:text-white transition-colors cursor-none hover-trigger" @mouseenter="onHoverEnter" @mouseleave="onHoverLeave">
                  Paiement
               </button>
            </div>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

// --- TYPES & DATA ---
type Availability = 'DISPONIBLE' | 'PRECOMMANDE'

interface Product {
  id: number
  name: string
  price: number
  category: string
  brand: string
  type: Availability
  colors: string[]
  image: string
  imageHover: string 
  material: string
  tag?: string
}

// Données de configuration
const categories = ['TOUT', 'HOMME', 'FEMME', 'ACCESSOIRES', 'EXCLUSIF']
const brands = ['ATELIER CONFIDENCE', 'NOIR STUDIOS', 'VOID', 'INDUSTRIAL']
const types = [
   { label: 'Disponible', value: 'DISPONIBLE' },
   { label: 'Précommande', value: 'PRECOMMANDE' }
]
const colors = [
   { name: 'Noir', hex: '#1a1a1a' },
   { name: 'Blanc', hex: '#ffffff' },
   { name: 'Bleu', hex: '#0066bf' },
   { name: 'Gris', hex: '#888888' },
   { name: 'Beige', hex: '#d1cbb8' }
]

// Produits enrichis
const products: Product[] = [
  { 
    id: 1, name: "Nocturne Trench", price: 245000, category: "HOMME", brand: "ATELIER CONFIDENCE", type: "DISPONIBLE", colors: ['Noir', 'Gris'],
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=987&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=987&auto=format&fit=crop",
    material: "Cuir / Laine", tag: "RUNWAY"
  },
  { 
    id: 2, name: "Cobalt Silk Dress", price: 180000, category: "FEMME", brand: "NOIR STUDIOS", type: "PRECOMMANDE", colors: ['Bleu', 'Blanc'],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop",
    material: "Soie 100%", tag: "BESTSELLER"
  },
  { 
    id: 3, name: "Void Knit Sweater", price: 120000, category: "HOMME", brand: "VOID", type: "DISPONIBLE", colors: ['Beige', 'Noir'],
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=987&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1617120799675-1dc9a0604b94?q=80&w=987&auto=format&fit=crop",
    material: "Maille Coton", tag: "NEW"
  },
  { 
    id: 4, name: "Obsidian Sunglasses", price: 45000, category: "ACCESSOIRES", brand: "INDUSTRIAL", type: "DISPONIBLE", colors: ['Noir'],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1000&auto=format&fit=crop",
    material: "Acétate", tag: "LIMITED"
  },
  { 
    id: 5, name: "Cyber Blazer", price: 310000, category: "FEMME", brand: "ATELIER CONFIDENCE", type: "PRECOMMANDE", colors: ['Gris', 'Noir'],
    image: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=1000&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop",
    material: "Tech-Nylon", tag: "NEW"
  },
  { 
    id: 6, name: "Industrial Belt", price: 35000, category: "ACCESSOIRES", brand: "INDUSTRIAL", type: "DISPONIBLE", colors: ['Noir', 'Argent'],
    image: "https://images.unsplash.com/photo-1616150638538-2753a687d143?q=80&w=1000&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1616150638538-2753a687d143?q=80&w=1000&auto=format&fit=crop",
    material: "Nylon / Acier"
  },
  { 
    id: 7, name: "Cargo V2", price: 85000, category: "HOMME", brand: "VOID", type: "DISPONIBLE", colors: ['Noir', 'Bleu'],
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077309?q=80&w=1000&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1517438476312-10d79c077309?q=80&w=1000&auto=format&fit=crop",
    material: "Denim Japonais"
  },
  { 
    id: 8, name: "Signature Hoodie", price: 95000, category: "EXCLUSIF", brand: "NOIR STUDIOS", type: "PRECOMMANDE", colors: ['Beige'],
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=1000&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=1000&auto=format&fit=crop",
    material: "Coton Lourd 500g", tag: "RARE"
  }
]

// --- STATE ---
const activeCategory = ref('TOUT')
const selectedBrands = ref<string[]>([])
const selectedTypes = ref<string[]>([])
const selectedColors = ref<string[]>([])

const viewMode = ref<'grid' | 'list'>('grid')
const isCartOpen = ref(false)
const showMobileFilters = ref(false)
const cart = ref<Product[]>([])

// --- REFS ---
const mainContainer = ref<HTMLElement | null>(null)
const cursorRef = ref<HTMLElement | null>(null)
const cursorFollowerRef = ref<HTMLElement | null>(null)

// --- COMPUTED ---
const filteredProducts = computed(() => {
   let result = products

   // 1. Filtre Categorie
   if (activeCategory.value !== 'TOUT') {
      result = result.filter(p => p.category === activeCategory.value)
   }

   // 2. Filtre Types (Disponibilité)
   if (selectedTypes.value.length > 0) {
      result = result.filter(p => selectedTypes.value.includes(p.type))
   }

   // 3. Filtre Marques
   if (selectedBrands.value.length > 0) {
      result = result.filter(p => selectedBrands.value.includes(p.brand))
   }

   // 4. Filtre Couleurs (Vérifie si le produit contient AU MOINS une des couleurs sélectionnées)
   if (selectedColors.value.length > 0) {
      result = result.filter(p => p.colors.some(c => selectedColors.value.includes(c)))
   }

   return result
})

const hasActiveFilters = computed(() => {
   return activeCategory.value !== 'TOUT' || selectedBrands.value.length > 0 || selectedTypes.value.length > 0 || selectedColors.value.length > 0
})

const activeFilterTags = computed(() => {
   const tags = []
   if(activeCategory.value !== 'TOUT') tags.push(activeCategory.value)
   tags.push(...selectedBrands.value)
   tags.push(...selectedTypes.value)
   tags.push(...selectedColors.value)
   return tags
})

const cartCount = computed(() => cart.value.length)
const cartTotal = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))

// --- ACTIONS ---
const addToCart = (product: Product) => {
   cart.value.push(product)
   isCartOpen.value = true
}

const removeFromCart = (index: number) => {
   cart.value.splice(index, 1)
}

const toggleColor = (color: string) => {
   if (selectedColors.value.includes(color)) {
      selectedColors.value = selectedColors.value.filter(c => c !== color)
   } else {
      selectedColors.value.push(color)
   }
}

const resetFilters = () => {
   activeCategory.value = 'TOUT'
   selectedBrands.value = []
   selectedTypes.value = []
   selectedColors.value = []
}

// Cursor Animations
const onHoverEnter = () => {
   if(cursorFollowerRef.value) {
      gsap.to(cursorFollowerRef.value, { scale: 1.5, borderColor: 'transparent', backgroundColor: 'rgba(0, 102, 191, 0.2)', duration: 0.3 })
   }
}
const onHoverLeave = () => {
   if(cursorFollowerRef.value) {
      gsap.to(cursorFollowerRef.value, { scale: 1, borderColor: '#0066bf', backgroundColor: 'transparent', duration: 0.3 })
   }
}

// --- SETUP ---
onMounted(() => {
   gsap.registerPlugin(ScrollTrigger)
   
   // 1. Cursor Logic
   const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.value, { x: e.clientX - 6, y: e.clientY - 6, duration: 0 })
      gsap.to(cursorFollowerRef.value, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 })
   }
   window.addEventListener('mousemove', moveCursor)

   // 2. Lenis
   const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
   const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
   requestAnimationFrame(raf)

   // 3. Intro Animations
   const tl = gsap.timeline()
   tl.to(".reveal-text", { y: 0, duration: 1.2, ease: "power4.out" })
     .to(".reveal-opacity", { opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.5")
     .from(".group", { 
        y: 60, 
        opacity: 0, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out" 
     }, "-=0.5")

   onUnmounted(() => {
      window.removeEventListener('mousemove', moveCursor)
      lenis.destroy()
   })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400&display=swap');

.font-syne { font-family: 'Syne', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

/* Transition List */
.product-list-move,
.product-list-enter-active,
.product-list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.product-list-enter-from,
.product-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.product-list-leave-active {
  position: absolute;
  width: 100%;
}

/* Animations Custom */
.ease-quart { transition-timing-function: cubic-bezier(0.76, 0, 0.24, 1); }

.animate-in {
   animation: slideIn 0.4s ease-out forwards;
}

@keyframes slideIn {
   from { opacity: 0; transform: translateX(20px); }
   to { opacity: 1; transform: translateX(0); }
}

input[type="checkbox"]:checked + div {
   border-color: #0066bf;
}
</style>