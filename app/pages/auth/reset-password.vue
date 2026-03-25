<!-- pages/auth/reset-password.vue -->
<script setup lang="ts">
definePageMeta({
      layout: 'auth',
      sanctum: {
            excluded: true,
      }
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const client = useSanctumClient()

// Récupérer token et email depuis l'URL
const token = computed(() => route.query.token as string)
const email = computed(() => route.query.email as string)

const form = reactive({
      password: '',
      password_confirmation: ''
})

const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

// Validation en temps réel
const passwordStrength = computed(() => {
      const pwd = form.password
      if (!pwd) return { level: 0, text: '', color: '' }

      let strength = 0
      if (pwd.length >= 8) strength++
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
      if (/\d/.test(pwd)) strength++
      if (/[^a-zA-Z0-9]/.test(pwd)) strength++

      const levels = [
            { level: 1, text: 'Faible', color: 'red' },
            { level: 2, text: 'Moyen', color: 'orange' },
            { level: 3, text: 'Bon', color: 'yellow' },
            { level: 4, text: 'Fort', color: 'green' },
      ]

      return levels[strength - 1] || { level: 0, text: '', color: '' }
})

const passwordsMatch = computed(() => {
      if (!form.password_confirmation) return null
      return form.password === form.password_confirmation
})

const isValidLink = computed(() => !!token.value && !!email.value)

async function handleResetPassword() {
      // Validations côté client
      if (!form.password || !form.password_confirmation) {
            toast.add({
                  title: 'Champs requis',
                  description: 'Veuillez remplir tous les champs.',
                  color: 'warning',
                  icon: 'i-heroicons-exclamation-triangle'
            })
            return
      }

      if (form.password.length < 8) {
            toast.add({
                  title: 'Mot de passe trop court',
                  description: 'Le mot de passe doit contenir au moins 8 caractères.',
                  color: 'warning',
                  icon: 'i-heroicons-exclamation-triangle'
            })
            return
      }

      if (form.password !== form.password_confirmation) {
            toast.add({
                  title: 'Erreur',
                  description: 'Les mots de passe ne correspondent pas.',
                  color: 'error',
                  icon: 'i-heroicons-x-circle'
            })
            return
      }

      loading.value = true

      try {
            await client('/api/v1/auth/customer/reset-password', {
                  method: 'POST',
                  body: {
                        token: token.value,
                        email: email.value,
                        password: form.password,
                        password_confirmation: form.password_confirmation
                  }
            })

            toast.add({
                  title: 'Succès !',
                  description: 'Votre mot de passe a été réinitialisé avec succès.',
                  color: 'success',
                  icon: 'i-heroicons-check-circle',
                  duration: 5000
            })

            // Redirection vers login après 1.5s
            setTimeout(() => {
                  router.push('/auth/login')
            }, 1500)

      } catch (error: any) {
            const message = error?.data?.message || 'Une erreur est survenue'

            toast.add({
                  title: 'Erreur',
                  description: message,
                  color: 'error',
                  icon: 'i-heroicons-x-circle',
                  duration: 7000
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
                        <UIcon name="i-heroicons-lock-closed" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                        Nouveau mot de passe
                  </h1>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Créez un mot de passe sécurisé pour votre compte.
                  </p>
            </div>

            <!-- Invalid Link -->
            <div v-if="!isValidLink"
                  class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center space-y-4">
                  <div class="flex justify-center">
                        <UIcon name="i-heroicons-exclamation-triangle"
                              class="w-16 h-16 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                        <h3 class="font-semibold text-red-900 dark:text-red-300 text-lg">
                              Lien invalide
                        </h3>
                        <p class="text-sm text-red-700 dark:text-red-400 mt-2">
                              Le lien de réinitialisation est invalide ou incomplet.
                        </p>
                  </div>
                  <UButton to="/auth/forgot-password" color="error" variant="outline" block size="lg">
                        Demander un nouveau lien
                  </UButton>
            </div>

            <!-- Form -->
            <form v-else class="space-y-6" @submit.prevent="handleResetPassword">
                  <!-- Email (lecture seule) -->
                  <UFormField label="Adresse email" name="email">
                        <UInput :model-value="email" type="email" icon="i-heroicons-envelope" size="lg" disabled
                              class="opacity-75" />
                  </UFormField>

                  <!-- Nouveau mot de passe -->
                  <UFormField label="Nouveau mot de passe" name="password">
                        <div class="space-y-3">
                              <div class="relative">
                                    <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                          icon="i-heroicons-lock-closed" placeholder="••••••••" size="lg" autofocus
                                          class="pr-12" />
                                    <button type="button" @click="showPassword = !showPassword"
                                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                          <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                                class="w-5 h-5" />
                                    </button>
                              </div>

                              <!-- Indicateur de force -->
                              <div v-if="form.password" class="space-y-2">
                                    <div class="flex items-center justify-between text-xs">
                                          <span class="text-gray-500 dark:text-gray-400">Force du mot de passe</span>
                                          <span :class="{
                                                'text-red-600 dark:text-red-400': passwordStrength.color === 'red',
                                                'text-orange-600 dark:text-orange-400': passwordStrength.color === 'orange',
                                                'text-yellow-600 dark:text-yellow-400': passwordStrength.color === 'yellow',
                                                'text-green-600 dark:text-green-400': passwordStrength.color === 'green',
                                          }" class="font-medium">
                                                {{ passwordStrength.text }}
                                          </span>
                                    </div>
                                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                          <div :class="{
                                                'bg-red-500': passwordStrength.color === 'red',
                                                'bg-orange-500': passwordStrength.color === 'orange',
                                                'bg-yellow-500': passwordStrength.color === 'yellow',
                                                'bg-green-500': passwordStrength.color === 'green',
                                          }" class="h-full transition-all duration-300"
                                                :style="{ width: `${(passwordStrength.level / 4) * 100}%` }" />
                                    </div>
                              </div>

                              <!-- Critères de sécurité -->
                              <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                    <li :class="form.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''">
                                          <UIcon :name="form.password.length >= 8 ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                                                class="w-3.5 h-3.5 inline mr-1" />
                                          Au moins 8 caractères
                                    </li>
                                    <li
                                          :class="(/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) ? 'text-green-600 dark:text-green-400' : ''">
                                          <UIcon :name="(/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                                                class="w-3.5 h-3.5 inline mr-1" />
                                          Majuscules et minuscules
                                    </li>
                                    <li :class="/\d/.test(form.password) ? 'text-green-600 dark:text-green-400' : ''">
                                          <UIcon :name="/\d/.test(form.password) ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                                                class="w-3.5 h-3.5 inline mr-1" />
                                          Au moins un chiffre
                                    </li>
                                    <li
                                          :class="/[^a-zA-Z0-9]/.test(form.password) ? 'text-green-600 dark:text-green-400' : ''">
                                          <UIcon :name="/[^a-zA-Z0-9]/.test(form.password) ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                                                class="w-3.5 h-3.5 inline mr-1" />
                                          Au moins un caractère spécial
                                    </li>
                              </ul>
                        </div>
                  </UFormField>

                  <!-- Confirmation du mot de passe -->
                  <UFormField label="Confirmer le mot de passe" name="password_confirmation">
                        <div class="space-y-3">
                              <div class="relative">
                                    <UInput v-model="form.password_confirmation"
                                          :type="showPasswordConfirmation ? 'text' : 'password'"
                                          icon="i-heroicons-lock-closed" placeholder="••••••••" size="lg"
                                          class="pr-12" />
                                    <button type="button" @click="showPasswordConfirmation = !showPasswordConfirmation"
                                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                          <UIcon :name="showPasswordConfirmation ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                                class="w-5 h-5" />
                                    </button>
                              </div>

                              <!-- Indicateur de correspondance -->
                              <div v-if="form.password_confirmation" class="flex items-center gap-2 text-xs">
                                    <UIcon :name="passwordsMatch ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                                          :class="passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                                          class="w-4 h-4" />
                                    <span
                                          :class="passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                          {{ passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas' }}
                                    </span>
                              </div>
                        </div>
                  </UFormField>

                  <!-- Submit Button -->
                  <UButton type="submit" color="primary" block size="lg" :loading="loading"
                        :disabled="!form.password || !form.password_confirmation || !passwordsMatch">
                        <template #leading>
                              <UIcon name="i-heroicons-check" class="w-5 h-5" />
                        </template>
                        Réinitialiser le mot de passe
                  </UButton>

                  <!-- Back to login -->
                  <div class="text-center">
                        <NuxtLink to="/auth/login"
                              class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white inline-flex items-center gap-2">
                              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                              Retour à la connexion
                        </NuxtLink>
                  </div>
            </form>
      </div>
</template>