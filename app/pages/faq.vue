<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Questions Fréquentes',
  description: 'Trouvez des réponses à vos questions'
})

const faqs = ref([
  {
    label: 'Comment passer une commande ?',
    content: 'Ajoutez vos produits au panier, puis suivez les étapes de checkout pour finaliser votre achat.',
    slot: 'faq1'
  },
  {
    label: 'Quels sont les modes de paiement acceptés ?',
    content: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et les virements bancaires.',
    slot: 'faq2'
  },
  {
    label: 'Puis-je retourner un produit ?',
    content: 'Oui, vous disposez de 14 jours pour retourner un produit non utilisé dans son emballage d\'origine.',
    slot: 'faq3'
  },
  {
    label: 'Comment suivre ma commande ?',
    content: 'Vous recevrez un email avec un lien de suivi dès l\'expédition de votre commande.',
    slot: 'faq4'
  }
])
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Questions Fréquentes
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>

        <UAccordion :items="faqs" color="primary" variant="soft">
          <template v-for="(faq, index) in faqs" :key="index" #[faq.slot]>
            <p class="text-gray-600 dark:text-gray-400">{{ faq.content }}</p>
          </template>
        </UAccordion>
      </div>
    </UContainer>
  </div>
</template>
