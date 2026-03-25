<script setup lang="ts">
const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)
const showGoogleButton = ref(false)

// Lazy load the Google button when component is visible
onMounted(() => {
      // Small delay to let the page render first, then load Google button
      setTimeout(() => {
            showGoogleButton.value = true
      }, 100)
})

// Handle Google Sign-In success callback
const handleGoogleSuccess = async (response: { credential: string }) => {
      if (!response.credential) {
            toast.add({
                  title: 'Erreur',
                  description: 'Aucune réponse de Google',
                  color: 'error',
                  icon: 'i-heroicons-x-circle'
            })
            return
      }

      loading.value = true
      try {
            await authStore.loginWithGoogle(response.credential)
      } catch (error) {
            // Error handling is done in the store
      } finally {
            loading.value = false
      }
}

// Handle Google Sign-In error
const handleGoogleError = () => {
      toast.add({
            title: 'Erreur Google',
            description: 'Impossible de se connecter avec Google. Veuillez réessayer.',
            color: 'error',
            icon: 'i-heroicons-x-circle'
      })
}
</script>

<template>
      <div class="space-y-4">
            <!-- Google Sign-In Button - Lazy loaded -->
            <div v-if="showGoogleButton" class="w-full flex justify-center min-h-[44px]">
                  <GoogleSignInButton
                        @success="handleGoogleSuccess"
                        @error="handleGoogleError"
                        :button-config="{
                              type: 'standard',
                              theme: 'filled_black',
                              size: 'large',
                              text: 'continue_with',
                              shape: 'rectangular',
                              logo_alignment: 'left',
                              width: '100%'
                        }"
                        class="w-full"
                  />
            </div>
            
            <!-- Loading placeholder while Google loads -->
            <div v-else class="w-full h-[44px] bg-white/10 rounded-lg animate-pulse flex items-center justify-center">
                  <span class="text-white/40 text-sm">Chargement...</span>
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