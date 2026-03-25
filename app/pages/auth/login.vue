<script setup lang="ts">
definePageMeta({
      layout: 'auth',
      sanctum: {
            excluded: true,
      },
      middleware: 'sanctum:guest'
})

const router = useRouter()

function handleLoginSuccess() {
      // Redirection gérée par le store
}
</script>

<template>
      <div class="space-y-6">
            <!-- Header -->
            <div class="text-center">
                  <h1 class="text-2xl font-bold text-white">
                        Connexion
                  </h1>
                  <p class="mt-2 text-sm text-gray-300">
                        Accédez à votre compte Bylin
                  </p>
            </div>

            <!-- Social Login -->
            <AuthSocialLogin>
                  <template #divider-text>Ou avec votre email</template>
            </AuthSocialLogin>

            <!-- Login Form -->
            <AuthLoginForm @success="handleLoginSuccess" />

            <!-- Register link -->
            <p class="text-center text-sm text-gray-300">
                  Pas encore de compte ?
                  <NuxtLink to="/auth/register" class="font-medium text-white hover:text-black underline underline-offset-4">
                        Créer un compte
                  </NuxtLink>
            </p>
      </div>
</template>