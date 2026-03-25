<script setup lang="ts">
definePageMeta({
      layout: 'auth',
      sanctum: {
            excluded: true,
      },
      middleware: 'sanctum:guest'
})

function handleRegisterSuccess() {
      // Redirection gérée par le store
}
</script>

<template>
      <div class="space-y-6">
            <div class="text-center">
                  <h1 class="text-3xl font-bold text-white">
                        Rejoignez Bylin
                  </h1>
                  <p class="mt-2 text-sm text-white/60">
                        Créez votre compte en quelques étapes
                  </p>
            </div>

            <AuthSocialLogin>
                  <template #divider-text>Ou inscrivez-vous par email</template>
            </AuthSocialLogin>

            <AuthRegisterForm @success="handleRegisterSuccess" />

            <p class="text-center text-sm text-white/60">
                  Déjà un compte ?
                  <NuxtLink to="/auth/login" class="font-medium text-white hover:underline">
                        Se connecter
                  </NuxtLink>
            </p>
      </div>
</template>