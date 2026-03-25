<!-- components/auth/RegisterForm.vue -->
<script setup lang="ts">
const emit = defineEmits<{
      success: []
      error: [error: Error]
}>()

const authStore = useAuthStore()
const toast = useToast()

// État du formulaire
const currentStep = ref(1)
const totalSteps = 3

const form = reactive({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      terms: false
})

const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

// Validation de chaque étape
const step1Valid = computed(() => {
      return form.first_name.length >= 2 && form.last_name.length >= 2
})

const step2Valid = computed(() => {
      return form.email.includes('@') && form.phone.length >= 8
})

const step3Valid = computed(() => {
      return form.password.length >= 8
            && form.password === form.password_confirmation
            && form.terms
})

// Force du mot de passe
const passwordStrength = computed(() => {
      const pwd = form.password
      if (!pwd) return { level: 0, text: '', color: '' }

      let strength = 0
      if (pwd.length >= 8) strength++
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
      if (/\d/.test(pwd)) strength++
      if (/[^a-zA-Z0-9]/.test(pwd)) strength++

      const levels = [
            { level: 1, text: 'Faible', color: 'error' },
            { level: 2, text: 'Moyen', color: 'warning' },
            { level: 3, text: 'Bon', color: 'info' },
            { level: 4, text: 'Fort', color: 'success' },
      ]

      return levels[strength - 1] || { level: 0, text: '', color: '' }
})

const passwordsMatch = computed(() => {
      if (!form.password_confirmation) return null
      return form.password === form.password_confirmation
})

// Navigation
function nextStep() {
      if (currentStep.value === 1 && !step1Valid.value) {
            toast.add({
                  title: 'Champs requis',
                  description: 'Veuillez remplir votre prénom et nom',
                  color: 'warning'
            })
            return
      }

      if (currentStep.value === 2 && !step2Valid.value) {
            toast.add({
                  title: 'Informations invalides',
                  description: 'Vérifiez votre email et téléphone',
                  color: 'warning'
            })
            return
      }

      if (currentStep.value < totalSteps) {
            currentStep.value++
      }
}

function prevStep() {
      if (currentStep.value > 1) {
            currentStep.value--
      }
}

async function handleSubmit() {
      if (!step3Valid.value) {
            toast.add({
                  title: 'Formulaire incomplet',
                  description: 'Veuillez accepter les conditions et vérifier vos mots de passe',
                  color: 'warning'
            })
            return
      }

      loading.value = true
      try {
            await authStore.register(form)
            emit('success')
      } catch (error: any) {
            emit('error', error)
      } finally {
            loading.value = false
      }
}
</script>

<template>
      <div class="space-y-6">
            <!-- Progress Bar -->
            <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                        <span class="text-white/80 font-medium">Étape {{ currentStep }} sur {{ totalSteps }}</span>
                        <span class="text-white/60">{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
                  </div>
                  <div class="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div class="h-full bg-white rounded-full transition-all duration-500 ease-out"
                              :style="{ width: `${(currentStep / totalSteps) * 100}%` }" />
                  </div>
            </div>

            <!-- Steps -->
            <form @submit.prevent="handleSubmit" class="space-y-6">

                  <!-- Step 1: Identité -->
                  <div v-show="currentStep === 1" class="space-y-4 animate-fade-in">
                        <div class="text-center mb-6">
                              <div
                                    class="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                                    <UIcon name="i-heroicons-user" class="w-7 h-7 text-white" />
                              </div>
                              <h3 class="text-xl font-bold text-white">Qui êtes-vous ?</h3>
                              <p class="text-sm text-white/60 mt-1">Commençons par votre identité</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                              <UFormField label="Prénom" name="first_name" required>
                                    <UInput v-model="form.first_name" placeholder="Jean" size="lg" :ui="{
                                          base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40',
                                    }" required />
                              </UFormField>

                              <UFormField label="Nom" name="last_name" required>
                                    <UInput v-model="form.last_name" placeholder="Dupont" size="lg" :ui="{
                                          base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40'
                                    }" required />
                              </UFormField>
                        </div>
                  </div>

                  <!-- Step 2: Contact -->
                  <div v-show="currentStep === 2" class="space-y-4 animate-fade-in">
                        <div class="text-center mb-6">
                              <div
                                    class="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                                    <UIcon name="i-heroicons-envelope" class="w-7 h-7 text-white" />
                              </div>
                              <h3 class="text-xl font-bold text-white">Vos coordonnées</h3>
                              <p class="text-sm text-white/60 mt-1">Comment vous contacter ?</p>
                        </div>

                        <UFormField label="Email" name="email" required>
                              <UInput v-model="form.email" type="email" placeholder="vous@exemple.com"
                                    icon="i-heroicons-envelope" size="lg" :ui="{
                                          base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40'
                                    }" class="w-full" required />
                        </UFormField>

                        <UFormField label="Téléphone" name="phone">
                              <UInput v-model="form.phone" type="tel" placeholder="+229 XX XX XX XX XX"
                                    icon="i-heroicons-phone" size="lg" :ui="{
                                          base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40'
                                    }" class="w-full" />
                        </UFormField>
                  </div>

                  <!-- Step 3: Sécurité -->
                  <div v-show="currentStep === 3" class="space-y-4 animate-fade-in">
                        <div class="text-center mb-6">
                              <div
                                    class="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                                    <UIcon name="i-heroicons-lock-closed" class="w-7 h-7 text-white" />
                              </div>
                              <h3 class="text-xl font-bold text-white">Sécurité</h3>
                              <p class="text-sm text-white/60 mt-1">Protégez votre compte</p>
                        </div>

                        <UFormField label="Mot de passe" name="password" required>
                              <div class="space-y-3">
                                    <div class="relative">
                                          <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                                icon="i-heroicons-lock-closed" placeholder="••••••••" size="lg" :ui="{
                                                      base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40 pr-12'
                                                }" class="w-full" required />
                                          <button type="button" @click="showPassword = !showPassword"
                                                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                                                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                                      class="w-5 h-5" />
                                          </button>
                                    </div>

                                    <!-- Force du mot de passe -->
                                    <div v-if="form.password" class="space-y-2">
                                          <div class="flex items-center justify-between text-xs">
                                                <span class="text-white/80">Force</span>
                                                <span :class="{
                                                      'text-red-400': passwordStrength.color === 'error',
                                                      'text-orange-400': passwordStrength.color === 'warning',
                                                      'text-blue-400': passwordStrength.color === 'info',
                                                      'text-green-400': passwordStrength.color === 'success',
                                                }" class="font-medium">
                                                      {{ passwordStrength.text }}
                                                </span>
                                          </div>
                                          <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div :class="{
                                                      'bg-red-500': passwordStrength.color === 'error',
                                                      'bg-orange-500': passwordStrength.color === 'warning',
                                                      'bg-blue-500': passwordStrength.color === 'info',
                                                      'bg-green-500': passwordStrength.color === 'success',
                                                }" class="h-full transition-all duration-300"
                                                      :style="{ width: `${(passwordStrength.level / 4) * 100}%` }" />
                                          </div>
                                    </div>
                              </div>
                        </UFormField>

                        <UFormField label="Confirmer le mot de passe" name="password_confirmation" required>
                              <div class="space-y-3">
                                    <div class="relative">
                                          <UInput v-model="form.password_confirmation"
                                                :type="showPasswordConfirmation ? 'text' : 'password'"
                                                icon="i-heroicons-lock-closed" placeholder="••••••••" size="lg" :ui="{
                                                      base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40 pr-12'
                                                }" class="w-full" required />
                                          <button type="button"
                                                @click="showPasswordConfirmation = !showPasswordConfirmation"
                                                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                                                <UIcon :name="showPasswordConfirmation ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                                      class="w-5 h-5" />
                                          </button>
                                    </div>

                                    <!-- Match indicator -->
                                    <div v-if="form.password_confirmation" class="flex items-center gap-2 text-xs">
                                          <UIcon :name="passwordsMatch ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                                                :class="passwordsMatch ? 'text-green-400' : 'text-red-400'"
                                                class="w-4 h-4" />
                                          <span :class="passwordsMatch ? 'text-green-400' : 'text-red-400'">
                                                {{ passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas' }}
                                          </span>
                                    </div>
                              </div>
                        </UFormField>

                        <!-- Terms -->
                        <div class="pt-4">
                              <label class="flex items-start gap-3 cursor-pointer group">
                                    <input v-model="form.terms" type="checkbox"
                                          class="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-white/50"
                                          required />
                                    <span class="text-sm text-white/80 group-hover:text-white transition-colors">
                                          J'accepte les
                                          <NuxtLink to="/legal/terms" class="underline hover:text-white"
                                                target="_blank">
                                                conditions d'utilisation
                                          </NuxtLink>
                                          et la
                                          <NuxtLink to="/legal/privacy" class="underline hover:text-white"
                                                target="_blank">
                                                politique de confidentialité
                                          </NuxtLink>
                                    </span>
                              </label>
                        </div>
                  </div>

                  <!-- Navigation Buttons -->
                  <div class="flex gap-3 pt-4">
                        <UButton v-if="currentStep > 1" type="button" @click="prevStep" color="neutral" variant="outline"
                              size="lg" class="flex-1" :ui="{
                                    base: 'ring-white/20 text-white bg-black hover:bg-white/10'
                              }">
                              <template #leading>
                                    <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
                              </template>
                              Retour
                        </UButton>

                        <UButton v-if="currentStep < totalSteps" type="button" @click="nextStep" color="neutral" size="lg"
                              class="flex-1">
                              Suivant
                              <template #trailing>
                                    <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
                              </template>
                        </UButton>

                        <UButton v-else type="submit" color="neutral" size="lg" class="flex-1" :loading="loading"
                              :disabled="!step3Valid">
                              <template #leading>
                                    <UIcon name="i-heroicons-check" class="w-5 h-5" />
                              </template>
                              Créer mon compte
                        </UButton>
                  </div>
            </form>
      </div>
</template>

<style scoped>
.animate-fade-in {
      animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
      from {
            opacity: 0;
            transform: translateY(10px);
      }

      to {
            opacity: 1;
            transform: translateY(0);
      }
}
</style>