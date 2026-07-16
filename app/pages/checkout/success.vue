<template>
  <div class="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center space-y-8">
      <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full"
        :class="isWhatsapp ? 'bg-[#25D366]/10' : 'bg-green-100'">
        <UIcon :name="isWhatsapp ? 'i-heroicons-chat-bubble-left-right' : 'i-heroicons-check'"
          class="h-12 w-12" :class="isWhatsapp ? 'text-[#25D366]' : 'text-green-600'" />
      </div>
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 font-syne">
          {{ isWhatsapp ? 'Commande envoyée sur WhatsApp !' : 'Commande confirmée !' }}
        </h2>
        <p v-if="orderNumber" class="mt-2 text-sm font-medium text-gray-800">
          Commande n°{{ orderNumber }}
        </p>
        <p class="mt-2 text-sm text-gray-600">
          <template v-if="isWhatsapp">
            Un conseiller BYLIN va prendre le relais dans la conversation WhatsApp pour
            finaliser votre commande (questions, paiement, sur-mesure).
            Si la conversation ne s'est pas ouverte, retrouvez votre commande dans votre compte.
          </template>
          <template v-else>
            Merci pour votre achat. Vous recevrez bientôt un email de confirmation avec les détails de votre commande.
          </template>
        </p>
      </div>
      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <UButton to="/account/orders" size="xl" color="neutral" variant="outline" class="px-8 justify-center">
          Mes commandes
        </UButton>
        <UButton to="/products" size="xl" color="neutral" variant="solid" class="px-8 justify-center">
          Continuer mes achats
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const isWhatsapp = computed(() => route.query.channel === 'whatsapp')
const orderNumber = computed(() => (route.query.order as string) || '')

useHead({
  title: 'Commande Confirmée - Bylin'
})
</script>
