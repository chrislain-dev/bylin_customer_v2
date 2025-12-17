<template>
    <div class="w-full max-w-md relative z-10">
        <!-- LOGO -->
        <div class="flex justify-center mb-12">
            <NuxtLink to="/">
                <img src="/images/logo-white.png" alt="bylin"
                    class="h-14 w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </NuxtLink>
        </div>

        <!-- Titre -->
        <div class="text-center mb-10">
            <h2 class="text-2xl font-bold text-white tracking-wide">Bienvenue</h2>
            <p class="text-primary-100 mt-2 text-sm">Entrez vos identifiants pour continuer.</p>
        </div>

        <!-- FORMULAIRE -->
        <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- EMAIL : Input Blanc sur fond couleur -->
            <div class="group">
                <label class="block text-xs font-bold text-white tracking-wider mb-2 ml-1">Adresse mail</label>
                <div class="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-primary-500" />
                    </div>
                    <input v-model="email" type="email" placeholder="johndoe@example.com"
                        class="block w-full pl-12 pr-4 py-2 bg-white border-none rounded text-gray-900 placeholder-gray-400 font-medium shadow-sm shadow-primary-900/10 focus:ring-1 focus:ring-primary-400 focus:outline-none transition-all" />
                </div>
                <p v-if="emailError"
                    class="mt-2 text-xs text-white bg-red-500 py-1 px-2 rounded inline-block shadow-sm">
                    {{ emailError }}
                </p>
            </div>

            <!-- PASSWORD -->
            <div class="group">
                <div class="flex justify-between items-center mb-2 ml-1">
                    <label class="block text-xs font-bold text-white tracking-wider mb-2 ml-1">Mot de passe</label>
                    <NuxtLink to="/auth/forgot-password"
                        class="text-xs text-primary-100 hover:text-white transition-colors underline decoration-primary-300 underline-offset-4">
                        Mot de passe oublié ?
                    </NuxtLink>
                </div>
                <div class="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-primary-500" />
                    </div>
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                        class="block w-full pl-12 pr-12 py-2 bg-white border-none rounded text-gray-900 placeholder-gray-400 font-medium shadow-sm shadow-primary-900/10 focus:ring-1 focus:ring-primary-400 focus:outline-none transition-all" />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-600 transition-colors">
                        <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
                    </button>
                </div>
                <p v-if="passwordError"
                    class="mt-2 text-xs text-white bg-red-500 py-1 px-2 rounded inline-block shadow-sm">
                    {{ passwordError }}
                </p>
            </div>

            <!-- Bouton Principal (Noir pour contraste Luxe) -->
            <button type="submit" :disabled="isLoading"
                class="w-full mt-6 py-2 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded shadow-sm shadow-gray-900/20 transform hover:-tr-y-0.5 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2">
                <span v-if="!isLoading">Se connecter</span>
                <UIcon v-else name="i-heroicons-arrow-path" class="animate-spin w-5 h-5" />
            </button>
        </form>

        <!-- Séparateur -->
        <div class="my-8 flex items-center gap-4 opacity-50">
            <div class="h-px bg-white flex-1"></div>
            <span class="text-white text-xs uppercase tracking-widest">Ou</span>
            <div class="h-px bg-white flex-1"></div>
        </div>

        <!-- Google Login (Transparent border) -->
        <button @click="handleGoogleLogin" :disabled="socialLoading"
            class="w-full py-1 bg-white border-1 border-gray-900 hover:bg-gray-900 hover:border-gray-900 rounded text-black hover:text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 group">
            <UIcon v-if="socialLoading" name="i-heroicons-arrow-path" class="animate-spin w-5 h-5" />
            <svg v-else class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    class="fill-current" />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    class="fill-current" />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    class="fill-current" />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    class="fill-current" />
            </svg>
            <span>Continuer avec Google</span>
        </button>

        <!-- Footer Register -->
        <p class="text-center text-primary-100 text-sm mt-8">
            Pas encore de compte ?
            <NuxtLink to="/auth/register" class="font-bold text-white hover:underline decoration-2 underline-offset-4">
                Créer un compte
            </NuxtLink>
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Pas de layout externe car on gère tout ici
definePageMeta({
    layout: 'auth',
    middleware: 'sanctum:guest'
})

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const socialLoading = ref(false)

const emailError = ref('')
const passwordError = ref('')

const handleLogin = async () => {
    emailError.value = ''
    passwordError.value = ''

    if (!email.value) { emailError.value = 'Email requis'; return }
    if (!password.value) { passwordError.value = 'Mot de passe requis'; return }

    isLoading.value = true
    try {
        const response = await authStore.login({
            email: email.value,
            password: password.value
        })
        if (response.success) {
            router.push('/dashboard')
        }
    } catch (e: any) {
        if (e.errors?.email) emailError.value = e.errors.email[0]
        if (e.errors?.password) passwordError.value = e.errors.password[0]
        // Si erreur générique, on peut l'afficher dans un toast ou alert
    } finally {
        isLoading.value = false
    }
}

const handleGoogleLogin = async () => {
    socialLoading.value = true
    try {
        await authStore.initGoogleAuth()
    } catch (e) {
        socialLoading.value = false
    }
}
</script>
