<!-- pages/auth/forgot-password.vue -->
<script setup lang="ts">
definePageMeta({
      layout: 'auth',
      sanctum: {
            excluded: true,
      }
})

const toast = useToast()
const client = useSanctumClient()

const email = ref('')
const loading = ref(false)
const emailSent = ref(false)

async function handleSendResetLink() {
      if (!email.value) {
            toast.add({
                  title: 'Email requis',
                  description: 'Veuillez entrer votre adresse email.',
                  color: 'warning',
                  icon: 'i-heroicons-exclamation-triangle'
            })
            return
      }

      loading.value = true

      try {
            await client('/api/v1/auth/customer/forgot-password', {
                  method: 'POST',
                  body: { email: email.value }
            })

            emailSent.value = true

            toast.add({
                  title: 'Email envoyé',
                  description: 'Si ce compte existe, vous recevrez un lien de réinitialisation.',
                  color: 'success',
                  icon: 'i-heroicons-check-circle'
            })
      } catch (error: any) {
            const message = error?.data?.message || 'Une erreur est survenue'

            toast.add({
                  title: 'Erreur',
                  description: message,
                  color: 'error',
                  icon: 'i-heroicons-x-circle'
            })
      } finally {
            loading.value = false
      }
}
</script>

<template>
      <div class="space-y-6">
            <!-- Header -->
            <div class="text-center">
                  <div
                        class="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
                        <UIcon name="i-heroicons-key" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h1 class="text-2xl font-bold text-white">
                        Mot de passe oublié ?
                  </h1>
                  <p class="mt-2 text-sm text-gray-300">
                        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
            </div>

            <!-- Success State -->
            <div v-if="emailSent"
                  class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center space-y-4">
                  <div class="flex justify-center">
                        <UIcon name="i-heroicons-envelope-open" class="w-16 h-16 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                        <h3 class="font-semibold text-green-900 dark:text-green-300 text-lg">
                              Vérifiez vos emails
                        </h3>
                        <p class="text-sm text-green-700 dark:text-green-400 mt-2">
                              Un lien de réinitialisation a été envoyé à <strong>{{ email }}</strong>
                        </p>
                        <p class="text-xs text-green-600 dark:text-green-500 mt-3">
                              Le lien expirera dans 60 minutes
                        </p>
                  </div>
                  <UButton to="/auth/login" color="success" variant="outline" block size="lg">
                        Retour à la connexion
                  </UButton>
            </div>

            <!-- Form -->
            <form v-else class="space-y-6" @submit.prevent="handleSendResetLink">
                  <UFormField label="Adresse email" name="email" required>
                        <UInput v-model="email" type="email" placeholder="vous@exemple.com" icon="i-heroicons-envelope"
                              size="lg" class="w-full" autofocus required />
                  </UFormField>

                  <UButton type="submit" color="neutral" block size="lg" :loading="loading" class="cursor-pointer">
                        Envoyer le lien de réinitialisation
                  </UButton>

                  <div class="text-center">
                        <NuxtLink to="/auth/login"
                              class="text-sm font-medium text-gray-200 inline-flex items-center gap-2">
                              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                              Retour à la connexion
                        </NuxtLink>
                  </div>
            </form>

            <!-- Help Text -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div class="flex gap-3">
                        <UIcon name="i-heroicons-information-circle"
                              class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div class="text-sm text-blue-700 dark:text-blue-300">
                              <p class="font-medium mb-1">Vous ne recevez pas l'email ?</p>
                              <ul class="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                                    <li>Vérifiez votre dossier spam</li>
                                    <li>Assurez-vous que l'adresse email est correcte</li>
                                    <li>Attendez quelques minutes avant de réessayer</li>
                              </ul>
                        </div>
                  </div>
            </div>
      </div>
</template>