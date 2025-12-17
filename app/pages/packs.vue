<template>
  <div class="w-full bg-[#f0f0f0] text-[#1a1a1a] dark:bg-[#050505] dark:text-[#e1e1e1] font-syne pt-32 pb-24">
    
    <div class="container mx-auto px-6">
       <div class="text-center mb-24">
          <span class="bg-[#0066bf] text-white px-2 py-1 font-mono text-xs uppercase">Offres Limitées</span>
          <h1 class="text-6xl md:text-8xl font-black uppercase mt-4 mb-6">The Packs</h1>
          <p class="font-mono text-sm opacity-60 max-w-lg mx-auto">
             L'uniforme Bylin complet. Assemblé pour l'élite. Économisez en adoptant le look total.
          </p>
       </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- CARD PACK -->
          <div v-for="(pack, i) in packs" :key="i" class="group relative bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 hover:border-[#0066bf] transition-all duration-500 flex flex-col">
             
             <!-- Image Composite -->
             <div class="h-80 overflow-hidden relative">
                <img :src="pack.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                   <h2 class="text-3xl font-black uppercase text-white">{{ pack.name }}</h2>
                </div>
             </div>

             <!-- Contenu -->
             <div class="p-8 flex-1 flex flex-col">
                <ul class="space-y-4 mb-8 flex-1">
                   <li v-for="item in pack.items" :key="item" class="flex items-center gap-3 font-mono text-xs uppercase border-b border-dashed border-gray-700 pb-2">
                      <span class="w-1.5 h-1.5 bg-[#0066bf] rounded-full"></span>
                      {{ item }}
                   </li>
                </ul>
                
                <div class="flex justify-between items-end">
                   <div>
                      <span class="block text-xs font-mono line-through opacity-50">{{ pack.oldPrice }}</span>
                      <span class="block text-3xl font-bold text-[#0066bf]">{{ pack.price }}</span>
                   </div>
                   <button class="px-6 py-3 border border-current hover:bg-[#0066bf] hover:border-[#0066bf] hover:text-white transition-all font-mono text-xs uppercase">
                      Choisir
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const packs = [
   {
      name: "The Starter",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
      items: ["T-Shirt Signature", "Cargo Pants V1", "Casquette Logo"],
      price: "150.000 FCFA",
      oldPrice: "185.000 FCFA"
   },
   {
      name: "The Executive",
      image: "https://images.unsplash.com/photo-1550246140-29f40b909e5a?q=80&w=1000&auto=format&fit=crop",
      items: ["Cyber Blazer", "Pantalon de Costume", "Chemise Soie"],
      price: "380.000 FCFA",
      oldPrice: "450.000 FCFA"
   },
   {
      name: "Total Void",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
      items: ["Nocturne Trench", "Void Knitwear", "Bottes Cuir", "Lunettes Obsidian"],
      price: "550.000 FCFA",
      oldPrice: "680.000 FCFA"
   }
]
</script>