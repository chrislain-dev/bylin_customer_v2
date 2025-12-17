<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Suivre ma commande',
  description: 'Suivez l\'état de votre commande en temps réel'
})

const orderNumber = ref('')
const email = ref('')
const loading = ref(false)

const trackOrder = async () => {
  loading.value = true
  // API call will be implemented
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Suivre ma commande
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Entrez vos informations pour suivre votre commande
          </p>
        </div>

        <UCard>
          <form @submit.prevent="trackOrder" class="space-y-6">
            <UFormGroup label="Numéro de commande" required>
              <UInput 
                v-model="orderNumber" 
                placeholder="Ex: ORD-123456"
                icon="i-lucide-package"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Email" required>
              <UInput 
                v-model="email" 
                type="email"
                placeholder="votre@email.com"
                icon="i-lucide-mail"
                size="lg"
              />
            </UFormGroup>

            <UButton 
              type="submit" 
              color="primary" 
              size="lg" 
              block
              :loading="loading"
            >
              Suivre ma commande
            </UButton>
          </form>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
