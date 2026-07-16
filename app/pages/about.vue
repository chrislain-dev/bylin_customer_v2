<script setup lang="ts">
useHead({
  title: 'À propos — Bylin',
  meta: [{ name: 'description', content: 'Découvrez l’univers Bylin, une marque de vêtements premium pensée depuis Cotonou.' }]
})
</script>

<template>
  <div class="bg-white text-gray-950">
    <section class="relative overflow-hidden bg-gray-950 text-white">
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85" alt="Atelier mode" class="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-200">À propos</p>
        <h1 class="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">Une marque construite pour une expérience mode premium.</h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-gray-200">Bylin rassemble une ligne officielle de collections et une boutique sélective pour offrir un parcours d’achat clair, moderne et fiable.</p>
      </div>
    </section>

    <section class="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Notre vision</p>
        <h2 class="mt-3 text-4xl font-black tracking-tight">Faire simple, beau et sérieux.</h2>
      </div>
      <div class="space-y-5 text-lg leading-8 text-gray-600">
        <p>Le site est pensé comme une vraie plateforme e-commerce : accueil éditorial, page marque, collections, boutique, détail produit, panier, checkout et espace client.</p>
        <p>L’objectif est d’avoir une interface responsive, rapide et rassurante, avec une séparation claire entre les créations Bylin et les vêtements non Bylin proposés en boutique.</p>
      </div>
    </section>

    <section class="bg-gray-50 py-20">
      <div class="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <div class="rounded-3xl bg-white p-8 shadow-sm"><h3 class="text-2xl font-bold">Identité</h3><p class="mt-3 text-gray-600">Une marque avec ses collections officielles et son univers propre.</p></div>
        <div class="rounded-3xl bg-white p-8 shadow-sm"><h3 class="text-2xl font-bold">Sélection</h3><p class="mt-3 text-gray-600">Une boutique organisée pour les produits non Bylin.</p></div>
        <div class="rounded-3xl bg-white p-8 shadow-sm"><h3 class="text-2xl font-bold">Confiance</h3><p class="mt-3 text-gray-600">Panier, paiement, compte client et suivi pensés pour la conversion.</p></div>
      </div>
    </section>
  </div>
</template>
