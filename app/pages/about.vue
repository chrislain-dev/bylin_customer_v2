<script setup lang="ts">
useHead({
  title: 'À propos — Bylin',
  meta: [
    {
      name: 'description',
      content:
        'BYLIN, maison de mode premium née à Cotonou. Blazers, complets en lin, chemises signatures et éditions limitées — un écosystème digital qui mêle commerce, conseil en style et communauté, du Bénin vers le monde.'
    }
  ]
})

const pillars = [
  {
    title: 'La Maison BYLIN',
    subtitle: 'Nos créations officielles',
    items: [
      'Blazers & jackets pour hommes et femmes',
      'Complets en lin, taillés pour les climats chauds',
      'Chemises à cols larges, signature de la maison',
      'Pièces signatures et éditions limitées numérotées'
    ]
  },
  {
    title: 'La Boutique',
    subtitle: 'Notre sélection complémentaire',
    items: [
      'Cardigans et chemises unies soigneusement choisis',
      'Mocassins et accessoires de mode',
      'Produits sélectionnés de marques tierces',
      'Un seul critère : la cohérence avec l’exigence BYLIN'
    ]
  }
]

const values = [
  {
    title: 'Élégance',
    text: 'Des coupes nettes, des matières nobles comme le lin, et une allure qui se remarque sans jamais forcer. Chaque pièce est pensée pour durer au-delà des tendances.'
  },
  {
    title: 'Authenticité',
    text: 'Chaque édition limitée porte un QR code unique et un numéro de série vérifiables en ligne. Ce que vous portez est traçable, garanti, incontestablement BYLIN.'
  },
  {
    title: 'Accompagnement',
    text: 'Un conseiller reste toujours à portée de message. Commande sur le site ou via WhatsApp, essayage en atelier, sur-mesure : vous choisissez le parcours qui vous ressemble.'
  },
  {
    title: 'Innovation',
    text: 'Guide intelligent des tailles, essayage virtuel, créateur de tenues, garde-robe digitale : la technologie au service du style, jamais l’inverse.'
  }
]

const ecosystem = [
  {
    title: 'Guide intelligent des tailles',
    text: 'Renseignez votre taille, votre poids et votre morphologie : le système recommande la coupe idéale avant même l’essayage.'
  },
  {
    title: 'Essayage virtuel',
    text: 'Chargez votre photo et visualisez le rendu approximatif d’un vêtement sur vous, article après article.'
  },
  {
    title: 'Créateur de tenues',
    text: 'Composez une tenue complète, visualisez son prix, sauvegardez-la, partagez-la ou ajoutez-la au panier en un clic.'
  },
  {
    title: 'Garde-robe digitale',
    text: 'Enregistrez vos pièces BYLIN et recevez des associations, des accessoires et des recommandations personnalisées.'
  },
  {
    title: 'Sur-mesure',
    text: 'Formulaire de mesures, téléversement, prise de rendez-vous à l’atelier : des pièces taillées exactement pour vous.'
  },
  {
    title: 'Cagnotte & panier cadeau',
    text: 'Offrez un panier complet à un proche, ou ouvrez une cagnotte collaborative pour financer la tenue de vos grands moments.'
  }
]

const tiers = [
  { name: 'Bronze', desc: 'Vos premiers points, vos premières réductions.' },
  { name: 'Silver', desc: 'Avantages renforcés et offres dédiées.' },
  { name: 'Gold', desc: 'Cadeaux et invitations privées.' },
  { name: 'Black Bylin', desc: 'Collections en avant-première, cercle le plus fermé de la maison.' }
]
</script>

<template>
  <div class="bg-white text-gray-950">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gray-950 text-white">
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85"
        alt="Atelier de mode BYLIN" class="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-200">À propos — Cotonou, Bénin</p>
        <h1 class="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
          Une maison de mode premium née en Afrique, pensée pour le monde.
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-gray-200">
          BYLIN n’est pas une simple boutique en ligne. C’est un écosystème de mode qui mêle création, conseil en style,
          communauté et technologie — au service d’une élégance exigeante, du Bénin vers l’international.
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <NuxtLink to="/collections"
            class="rounded-full bg-white px-7 py-3 text-sm font-bold text-gray-950 transition hover:bg-primary-100">
            Découvrir les collections
          </NuxtLink>
          <NuxtLink to="/contact"
            class="rounded-full border border-white/40 px-7 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10">
            Prendre rendez-vous
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Histoire -->
    <section class="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Notre histoire</p>
        <h2 class="mt-3 text-4xl font-black tracking-tight">Du blazer signature à l’écosystème digital.</h2>
      </div>
      <div class="space-y-5 text-lg leading-8 text-gray-600">
        <p>
          BYLIN est né à Cotonou d’une conviction simple : l’élégance premium peut se créer, se produire et se vivre
          depuis l’Afrique. La maison s’est d’abord fait connaître par ses blazers et jackets, ses complets en lin et
          ses chemises à cols larges — des pièces devenues sa signature.
        </p>
        <p>
          Aujourd’hui, BYLIN habille des professionnels, des entrepreneurs, des artistes et des personnalités publiques
          qui partagent le même goût du détail. La marque livre au Bénin et à travers l’Afrique, avec une ambition
          claire : porter cette exigence à l’international.
        </p>
      </div>
    </section>

    <!-- Deux univers -->
    <section class="bg-gray-50 py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Deux univers, une exigence</p>
          <h2 class="mt-3 text-4xl font-black tracking-tight">Les créations BYLIN et la sélection boutique.</h2>
          <p class="mt-4 text-lg leading-8 text-gray-600">
            Sur la plateforme, la distinction est toujours claire : d’un côté les collections officielles de la maison,
            de l’autre une boutique complémentaire soigneusement organisée.
          </p>
        </div>
        <div class="mt-12 grid gap-6 md:grid-cols-2">
          <div v-for="pillar in pillars" :key="pillar.title" class="rounded-3xl bg-white p-10 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-primary-600">{{ pillar.subtitle }}</p>
            <h3 class="mt-3 text-2xl font-bold">{{ pillar.title }}</h3>
            <ul class="mt-6 space-y-3 text-gray-600">
              <li v-for="item in pillar.items" :key="item" class="flex gap-3">
                <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Valeurs -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Nos valeurs</p>
        <h2 class="mt-3 text-4xl font-black tracking-tight">Ce qui guide chaque décision de la maison.</h2>
      </div>
      <div class="mt-12 grid gap-6 sm:grid-cols-2">
        <div v-for="value in values" :key="value.title" class="rounded-3xl border border-gray-100 p-8">
          <h3 class="text-2xl font-bold">{{ value.title }}</h3>
          <p class="mt-3 leading-7 text-gray-600">{{ value.text }}</p>
        </div>
      </div>
    </section>

    <!-- Vision / écosystème -->
    <section class="bg-gray-950 py-20 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-200">Notre vision</p>
          <h2 class="mt-3 text-4xl font-black tracking-tight">Plus qu’une boutique : un assistant de style.</h2>
          <p class="mt-4 text-lg leading-8 text-gray-300">
            BYLIN construit un écosystème digital de mode premium — site vitrine, boutique, catalogue, conseil et
            communauté réunis dans une même expérience simple, fluide et rapide, conçue pour évoluer vers une
            application mobile.
          </p>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="feature in ecosystem" :key="feature.title"
            class="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
            <h3 class="text-xl font-bold">{{ feature.title }}</h3>
            <p class="mt-3 leading-7 text-gray-300">{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Expérience d'achat -->
    <section class="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Une expérience à votre rythme</p>
        <h2 class="mt-3 text-4xl font-black tracking-tight">Payer en ligne, ou finaliser avec un conseiller.</h2>
      </div>
      <div class="space-y-5 text-lg leading-8 text-gray-600">
        <p>
          Chacun achète comme il le souhaite. Paiement direct sur le site — Mobile Money ou carte bancaire — avec
          confirmation immédiate et suivi de commande. Ou finalisation via WhatsApp, avec un conseiller BYLIN qui vous
          accompagne, répond à vos questions et prend en charge le sur-mesure.
        </p>
        <p>
          Cette double approche est au cœur de notre vision : accompagner chaque client vers l’achat en ligne sans
          jamais sacrifier le contact humain qui fait la force du commerce en Afrique.
        </p>
      </div>
    </section>

    <!-- Fidélité -->
    <section class="bg-gray-50 py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-600">Le cercle BYLIN</p>
          <h2 class="mt-3 text-4xl font-black tracking-tight">Une fidélité qui se vit comme un privilège.</h2>
          <p class="mt-4 text-lg leading-8 text-gray-600">
            Chaque achat rapporte des points et vous rapproche d’un cercle plus exclusif : réductions, cadeaux,
            invitations privées et accès en avant-première aux collections.
          </p>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(tier, index) in tiers" :key="tier.name" class="rounded-3xl bg-white p-8 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Niveau {{ index + 1 }}</p>
            <h3 class="mt-3 text-2xl font-bold">{{ tier.name }}</h3>
            <p class="mt-3 text-gray-600">{{ tier.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Communauté / CTA -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-gray-950 px-8 py-16 text-white sm:px-16">
        <div class="max-w-3xl">
          <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-200">BYLIN Stars & communauté</p>
          <h2 class="mt-3 text-4xl font-black tracking-tight">Rejoignez celles et ceux qui portent BYLIN.</h2>
          <p class="mt-4 text-lg leading-8 text-gray-300">
            Artistes, célébrités, entrepreneurs et passionnés de mode : découvrez leurs looks dans nos lookbooks,
            suivez nos conseils de style sur le blog, et faites partie de la communauté qui écrit l’histoire de la
            marque.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <NuxtLink to="/boutique"
              class="rounded-full bg-white px-7 py-3 text-sm font-bold text-gray-950 transition hover:bg-primary-100">
              Explorer la boutique
            </NuxtLink>
            <NuxtLink to="/blog"
              class="rounded-full border border-white/40 px-7 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10">
              Lire le blog
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>