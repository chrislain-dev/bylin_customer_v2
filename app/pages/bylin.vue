<template>
  <div class="w-full bg-[#050505] text-[#e1e1e1] font-syne overflow-hidden">
     
     <!-- HERO -->
     <section class="h-screen flex flex-col justify-center items-center relative p-6">
        <h1 class="text-[12vw] leading-[0.8] font-black uppercase text-center mix-blend-difference z-10">
           ROOTS &<br><span class="text-[#0066bf]">CONCRETE</span>
        </h1>
        <div class="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1449247666642-4f669d202f53?q=80&w=2074&auto=format&fit=crop" class="w-full h-full object-cover grayscale" />
        </div>
        <p class="absolute bottom-12 font-mono text-sm max-w-md text-center z-10">
           Né dans le chaos créatif de Cotonou. Élevé par l'exigence du luxe global.
        </p>
     </section>

     <!-- MANIFESTO -->
     <section class="py-32 px-6 container mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div class="w-full md:w-1/2">
           <h2 class="text-4xl md:text-6xl font-black uppercase mb-8">Le Manifeste</h2>
           <div class="space-y-6 font-mono text-sm md:text-base leading-relaxed opacity-80 text-justify">
              <p>
                 Bylin n'est pas juste une marque de vêtements. C'est une réponse esthétique à un environnement en mouvement perpétuel. Nous puisons notre inspiration dans l'architecture brute de nos villes et l'élégance intemporelle de nos traditions.
              </p>
              <p>
                 Chaque pièce est conçue comme une armure urbaine. Pas de compromis sur la matière. Pas de compromis sur la coupe.
              </p>
           </div>
        </div>
        <div class="w-full md:w-1/2 h-[60vh] relative">
           <img src="https://images.unsplash.com/photo-1594967836830-4c338f0d55e2?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover" />
           <div class="absolute -bottom-6 -left-6 bg-[#0066bf] text-white p-6 font-mono text-xs uppercase">
              Est. 2023 — Cotonou
           </div>
        </div>
     </section>

     <!-- L'ATELIER (Timeline) -->
     <section class="py-32 bg-[#111]">
        <div class="container mx-auto px-6">
           <h2 class="text-[10vw] font-black uppercase opacity-10 mb-16 select-none">Process</h2>
           
           <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div v-for="(step, i) in steps" :key="i" class="border-t border-white/20 pt-6 group hover:border-[#0066bf] transition-colors duration-500">
                 <span class="font-mono text-4xl text-[#0066bf] block mb-4">0{{ i+1 }}</span>
                 <h3 class="text-2xl font-bold uppercase mb-4">{{ step.title }}</h3>
                 <p class="font-mono text-xs opacity-60">{{ step.desc }}</p>
              </div>
           </div>
        </div>
     </section>

  </div>
</template>

<script setup lang="ts">
const steps = [
   { title: "Sourcing", desc: "Sélection rigoureuse des cotons africains et des laines techniques." },
   { title: "Architecture", desc: "Prototypage des coupes directement sur mannequin pour un tombé parfait." },
   { title: "Assemblage", desc: "Confection à la main dans notre atelier à Cotonou par nos maîtres tailleurs." }
]
</script>