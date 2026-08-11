<script setup lang="ts">
const authStore = useAuthStore()
const toast = useToast()
const { renderButton, isReady: googleSdkReady, error: googleSdkError } = useGoogleSignIn()

const loading = ref(false)
const showGoogleButton = ref(false)
const googleButtonTarget = ref<HTMLElement | null>(null)

async function handleGoogleCredential(credential: string) {
      loading.value = true
      try {
            await authStore.loginWithGoogle(credential)
      } catch (error) {
            // La gestion d'erreur (toast) est déjà faite dans le store
      } finally {
            loading.value = false
      }
}

function handleGoogleError(message: string) {
      toast.add({
            title: 'Erreur Google',
            description: message || 'Impossible de se connecter avec Google. Veuillez réessayer.',
            color: 'error',
            icon: 'i-heroicons-x-circle'
      })
}

// Chargement du bouton Google côté client uniquement, après le premier rendu
onMounted(() => {
      setTimeout(async () => {
            showGoogleButton.value = true
            await nextTick()
            if (googleButtonTarget.value) {
                  await renderButton(
                        googleButtonTarget.value,
                        handleGoogleCredential,
                        handleGoogleError
                  )
            }
      }, 100)
})
</script>

<template>
      <div class="space-y-4">
            <!-- Erreur de configuration/chargement Google -->
            <div v-if="googleSdkError" class="flex justify-center items-center min-h-11">
                  <p class="text-sm text-white/60 text-center">
                        Connexion Google momentanément indisponible.
                  </p>
            </div>

            <!-- Google Sign-In Button -->
            <div v-else-if="showGoogleButton" class="relative flex justify-center items-center min-h-11">
                  <div ref="googleButtonTarget" class="flex justify-center items-center min-h-11" />

                  <!-- Placeholder tant que le bouton officiel n'est pas encore rendu -->
                  <div v-if="!googleSdkReady" class="h-11 w-60 bg-white/10 rounded-lg animate-pulse flex items-center justify-center absolute">
                        <span class="text-white/40 text-sm">Chargement...</span>
                  </div>
            </div>

            <!-- Placeholder avant le montage différé -->
            <div v-else class="flex justify-center items-center min-h-11">
                  <div class="h-11 w-60 bg-white/10 rounded-lg animate-pulse flex items-center justify-center">
                        <span class="text-white/40 text-sm">Chargement...</span>
                  </div>
            </div>

            <!-- Divider -->
            <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-white/20" />
                  </div>
                  <div class="relative flex justify-center text-sm">
                        <span class="px-3 bg-[#0066bf] text-white/60">
                              <slot name="divider-text">Ou</slot>
                        </span>
                  </div>
            </div>
      </div>
</template>
