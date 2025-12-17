<template>
  <div class="w-full bg-[#f0f0f0] text-[#1a1a1a] dark:bg-[#050505] dark:text-[#e1e1e1] font-syne pt-32 pb-24">
    
    <div class="container mx-auto px-6">
       <!-- Header -->
       <div class="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black/10 dark:border-white/10 pb-8">
          <h1 class="text-5xl md:text-7xl font-black uppercase">Archives<br><span class="text-[#0066bf]">Visuelles</span></h1>
          <div class="flex gap-4 mt-8 md:mt-0 font-mono text-xs uppercase">
             <button class="bg-[#1a1a1a] text-white dark:bg-white dark:text-black px-4 py-2">Tout</button>
             <button class="opacity-50 hover:opacity-100 px-4 py-2">Styling</button>
             <button class="opacity-50 hover:opacity-100 px-4 py-2">Entretien</button>
          </div>
       </div>

       <!-- Grid Tutorials -->
       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Featured Large Item -->
          <div class="col-span-1 md:col-span-2 relative group cursor-pointer h-[60vh] overflow-hidden">
             <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
             
             <!-- Play Button Center -->
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-125 transition-transform">
                <div class="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
             </div>

             <div class="absolute bottom-8 left-8 text-white">
                <span class="bg-[#0066bf] px-2 py-1 font-mono text-xs uppercase mb-2 inline-block">Featured</span>
                <h2 class="text-4xl md:text-6xl font-bold uppercase">The Art of Layering</h2>
                <p class="font-mono text-sm opacity-80 mt-2">Maîtriser la superposition avec la collection Confidence.</p>
             </div>
          </div>

          <!-- Small Items -->
          <div v-for="(tuto, i) in tutorials" :key="i" class="group cursor-pointer">
             <div class="relative aspect-video bg-gray-200 overflow-hidden mb-4">
                <img :src="tuto.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute bottom-4 right-4 bg-black text-white px-2 py-1 font-mono text-xs">
                   {{ tuto.duration }}
                </div>
             </div>
             <h3 class="text-2xl font-bold uppercase group-hover:text-[#0066bf] transition-colors">{{ tuto.title }}</h3>
             <p class="font-mono text-xs opacity-60 mt-1 uppercase">{{ tuto.category }}</p>
          </div>

       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const tutorials = [
   {
      title: "Entretenir son Cuir",
      category: "Care Guide",
      duration: "02:45",
      image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop"
   },
   {
      title: "Comment porter l'Oversize ?",
      category: "Styling",
      duration: "04:12",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
   },
   {
      title: "Accessoiriser le Noir",
      category: "Tips",
      duration: "01:30",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
   }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400&display=swap');

.font-syne { font-family: 'Syne', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }
</style>