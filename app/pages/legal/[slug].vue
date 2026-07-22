<template>
  <div class="min-h-screen bg-sable-50 dark:bg-gray-950">
    <!-- En-tête -->
    <section class="relative bg-gray-900 text-white py-16 lg:py-20 overflow-hidden motif-africain motif-africain-clair">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <nav class="flex text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <NuxtLink to="/" class="hover:text-white transition-colors">Accueil</NuxtLink>
            </li>
            <li><span class="text-gray-600">/</span></li>
            <li class="text-white font-medium">{{ page.title }}</li>
          </ol>
        </nav>
        <h1 class="text-3xl lg:text-5xl font-bold">{{ page.title }}</h1>
        <p class="mt-3 text-gray-300">Dernière mise à jour : {{ page.updated }}</p>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1.5 kente-bar" />
    </section>

    <!-- Contenu -->
    <section class="py-12 lg:py-16">
      <div
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 lg:p-12 space-y-10">
        <div v-for="(section, i) in page.sections" :key="i" class="space-y-3">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span class="w-8 h-1 kente-bar rounded-full shrink-0" />
            {{ section.heading }}
          </h2>
          <p v-for="(paragraph, j) in section.paragraphs" :key="j"
            class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ paragraph }}
          </p>
        </div>

        <div class="pt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
          Une question sur cette page ? Contactez-nous via la
          <NuxtLink to="/contact" class="text-terra-600 hover:text-terra-700 font-medium underline underline-offset-2">
            page de contact</NuxtLink>.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface LegalSection {
  heading: string
  paragraphs: string[]
}

interface LegalPage {
  title: string
  updated: string
  sections: LegalSection[]
}

const route = useRoute()

const pages: Record<string, LegalPage> = {
  terms: {
    title: 'Conditions Générales de Vente',
    updated: 'juillet 2026',
    sections: [
      {
        heading: 'Objet',
        paragraphs: [
          "Les présentes conditions générales de vente régissent les relations contractuelles entre Bylin et toute personne effectuant un achat sur le site bylin-style.com. Toute commande passée sur le site implique l'acceptation pleine et entière des présentes conditions.",
        ],
      },
      {
        heading: 'Produits et prix',
        paragraphs: [
          "Les produits proposés sont ceux figurant sur le site, dans la limite des stocks disponibles. Les prix sont indiqués en francs CFA (FCFA) toutes taxes comprises, hors frais de livraison. Bylin se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés sur la base du tarif en vigueur au moment de la validation de la commande.",
        ],
      },
      {
        heading: 'Commande et paiement',
        paragraphs: [
          "Le paiement s'effectue en ligne de manière sécurisée par carte bancaire (Visa, Mastercard) ou mobile money (MTN Money, Moov Money). La commande n'est définitive qu'après confirmation du paiement.",
        ],
      },
      {
        heading: 'Livraison',
        paragraphs: [
          "Les livraisons sont assurées à Cotonou et dans les principales villes du Bénin. La livraison est offerte à Cotonou pour toute commande supérieure à 25 000 FCFA, avec un délai indicatif de 24 à 48 heures ouvrées. Les délais peuvent varier pour les autres localités.",
        ],
      },
      {
        heading: 'Retours et échanges',
        paragraphs: [
          "Vous disposez de 14 jours à compter de la réception pour retourner ou échanger un article ne vous convenant pas, à condition qu'il soit dans son état d'origine (non porté, non lavé, étiquettes attachées). Les articles personnalisés ne sont ni repris ni échangés.",
        ],
      },
      {
        heading: 'Précommandes',
        paragraphs: [
          "Certains articles peuvent être proposés en précommande. Les délais de confection et de mise à disposition sont indiqués sur la fiche produit et sont donnés à titre indicatif.",
        ],
      },
    ],
  },
  privacy: {
    title: 'Politique de Confidentialité',
    updated: 'juillet 2026',
    sections: [
      {
        heading: 'Données collectées',
        paragraphs: [
          "Dans le cadre de votre navigation et de vos achats, nous collectons les données nécessaires au traitement de vos commandes : nom, prénom, adresse de livraison, adresse e-mail, numéro de téléphone, ainsi que l'historique de vos achats.",
        ],
      },
      {
        heading: 'Utilisation des données',
        paragraphs: [
          "Vos données sont utilisées exclusivement pour la gestion de vos commandes, la livraison, le service client et, si vous y avez consenti, l'envoi d'offres et de nouveautés Bylin. Elles ne sont jamais vendues à des tiers.",
        ],
      },
      {
        heading: 'Paiements',
        paragraphs: [
          "Les paiements sont traités par des prestataires de paiement sécurisés. Bylin ne stocke aucune donnée bancaire complète sur ses serveurs.",
        ],
      },
      {
        heading: 'Vos droits',
        paragraphs: [
          "Conformément à la législation béninoise sur la protection des données à caractère personnel (loi n°2017-20 portant code du numérique), vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez-nous via la page de contact ou depuis votre espace client.",
        ],
      },
      {
        heading: 'Conservation',
        paragraphs: [
          "Vos données sont conservées pendant la durée nécessaire à la gestion de la relation commerciale et aux obligations légales et comptables en vigueur.",
        ],
      },
    ],
  },
  mentions: {
    title: 'Mentions Légales',
    updated: 'juillet 2026',
    sections: [
      {
        heading: 'Éditeur du site',
        paragraphs: [
          "Le site bylin-style.com est édité par Bylin, marque de prêt-à-porter basée à Cotonou, République du Bénin.",
          "Contact : via la page de contact du site.",
        ],
      },
      {
        heading: 'Hébergement',
        paragraphs: [
          "Le site et son interface de gestion sont hébergés par un prestataire d'hébergement professionnel. Les données sont traitées dans le respect des réglementations applicables.",
        ],
      },
      {
        heading: 'Propriété intellectuelle',
        paragraphs: [
          "L'ensemble des éléments du site (logo, photographies, textes, créations et modèles) est la propriété exclusive de Bylin. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.",
        ],
      },
      {
        heading: 'Responsabilité',
        paragraphs: [
          "Bylin s'efforce d'assurer l'exactitude des informations diffusées sur le site mais ne saurait être tenue responsable des erreurs, omissions ou indisponibilités temporaires du service.",
        ],
      },
    ],
  },
  cookies: {
    title: 'Politique de Cookies',
    updated: 'juillet 2026',
    sections: [
      {
        heading: "Qu'est-ce qu'un cookie ?",
        paragraphs: [
          "Un cookie est un petit fichier déposé sur votre appareil lors de la consultation du site. Il permet notamment de mémoriser votre session, le contenu de votre panier et vos préférences.",
        ],
      },
      {
        heading: 'Cookies utilisés',
        paragraphs: [
          "Cookies strictement nécessaires : authentification (session sécurisée), panier d'achat et protection contre les attaques (jeton CSRF). Ils sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.",
          "Cookies de préférence : mémorisation de vos choix d'affichage (thème, devise).",
        ],
      },
      {
        heading: 'Gestion des cookies',
        paragraphs: [
          "Vous pouvez configurer votre navigateur pour refuser les cookies non essentiels. Le refus des cookies nécessaires empêchera toutefois la connexion à votre compte et la finalisation de vos commandes.",
        ],
      },
    ],
  },
}

const page = computed<LegalPage>(() => {
  const p = pages[route.params.slug as string]
  if (!p) {
    throw createError({ statusCode: 404, message: 'Page introuvable', fatal: true })
  }
  return p
})

useSeoMeta({
  title: () => `${page.value.title} — Bylin`,
  description: () => `${page.value.title} du site Bylin, prêt-à-porter créé à Cotonou.`,
})
</script>
