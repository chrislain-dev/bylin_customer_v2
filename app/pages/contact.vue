<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Contact',
  description: 'Contactez notre équipe'
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)

const submitForm = async () => {
  loading.value = true
  // API call will be implemented
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contactez-nous
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Une question ? Notre équipe est là pour vous aider
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Envoyez-nous un message</h2>
            </template>

            <form @submit.prevent="submitForm" class="space-y-4">
              <UFormGroup label="Nom" required>
                <UInput v-model="form.name" placeholder="Votre nom" />
              </UFormGroup>

              <UFormGroup label="Email" required>
                <UInput v-model="form.email" type="email" placeholder="votre@email.com" />
              </UFormGroup>

              <UFormGroup label="Sujet" required>
                <UInput v-model="form.subject" placeholder="Objet de votre message" />
              </UFormGroup>

              <UFormGroup label="Message" required>
                <UTextarea v-model="form.message" :rows="5" placeholder="Votre message..." />
              </UFormGroup>

              <UButton type="submit" color="primary" size="lg" block :loading="loading">
                Envoyer
              </UButton>
            </form>
          </UCard>

          <div class="space-y-6">
            <UCard>
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-mail" class="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                  <p class="text-gray-600 dark:text-gray-400">contact@bylin.com</p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-phone" class="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Téléphone</h3>
                  <p class="text-gray-600 dark:text-gray-400">+33 1 23 45 67 89</p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-map-pin" class="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Adresse</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    123 Rue de la Mode<br>
                    75001 Paris, France
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
