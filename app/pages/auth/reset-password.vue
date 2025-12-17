<template>
    <transition name="scale-fade" appear>
        <div class="w-full h-[100vh] flex bg-white overflow-hidden">
            <!-- Left Side - Fashion Image -->
            <div class="hidden md:flex md:w-1/2 relative overflow-hidden">
                <div class="absolute inset-0 z-10"></div>
                <img src="@/assets/images/auth.webp" alt="Fashion"
                    class="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-500" />
            </div>

            <!-- Right Side - Auth Form -->
            <div class="w-full md:w-1/2 flex flex-col relative bg-indigo-700">
                <!-- Content Container -->
                <div class="flex-1 flex items-center justify-center p-8 md:p-12">
                    <div class="max-w-md w-full">
                        <div class="text-center mb-8">
                            <transition name="bounce" appear>
                                <div class="inline-flex items-center justify-center mb-4">
                                    <router-link to="/">
                                        <img src="/images/logo-white.png" alt="bylin logo"
                                            class="w-48 h-48 object-contain" />
                                    </router-link>
                                </div>
                            </transition>
                            <h1 class="text-2xl font-bold text-gray-300 mb-2">
                                Nouveau mot de passe
                            </h1>
                            <p class="text-gray-900">Choisissez un mot de passe sécurisé.</p>
                        </div>

                        <form @submit.prevent="handleResetPassword" class="space-y-6">
                            <UInput v-model="email" type="email" placeholder="Confirmez votre email"
                                autocomplete="email" size="xl" :ui="{
                                    base: 'w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200 bg-white',
                                    leading: { padding: { xl: 'pl-12' } }
                                }" :color="errors.email ? 'red' : 'white'">
                                <template #leading>
                                    <div
                                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                                    </div>
                                </template>
                            </UInput>

                            <UInput v-model="password" type="password" placeholder="Nouveau mot de passe"
                                autocomplete="new-password" size="xl" :ui="{
                                    base: 'w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200 bg-white',
                                    leading: { padding: { xl: 'pl-12' } }
                                }" :color="errors.password ? 'red' : 'white'">
                                <template #leading>
                                    <div
                                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <UIcon name="i-heroicons-lock-closed" class="w-5 h-5" />
                                    </div>
                                </template>
                            </UInput>

                            <UInput v-model="passwordConfirmation" type="password"
                                placeholder="Confirmer le mot de passe" autocomplete="new-password" size="xl" :ui="{
                                    base: 'w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200 bg-white',
                                    leading: { padding: { xl: 'pl-12' } }
                                }" :color="errors.password ? 'red' : 'white'">
                                <template #leading>
                                    <div
                                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <UIcon name="i-heroicons-lock-closed" class="w-5 h-5" />
                                    </div>
                                </template>
                            </UInput>

                            <transition name="slide-down">
                                <div v-if="Object.keys(errors).length > 0" class="text-red-500 text-sm space-y-1">
                                    <p v-for="(err, field) in errors" :key="field" class="flex items-center gap-2">
                                        <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4" />
                                        {{ Array.isArray(err) ? err[0] : err }}
                                    </p>
                                </div>
                            </transition>

                            <transition name="slide-down">
                                <p v-if="message"
                                    class="text-green-400 text-sm flex items-center gap-2 bg-green-900/20 p-3 rounded border border-green-500/30">
                                    <UIcon name="i-heroicons-check-circle" class="w-5 h-5 flex-shrink-0" />
                                    {{ message }}
                                </p>
                            </transition>

                            <UButton type="submit" :disabled="!email || !password || isLoading" :loading="isLoading"
                                block size="xl" color="white" variant="solid"
                                class="hover:bg-indigo-700 hover:text-white hover:border transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-black font-medium">
                                Réinitialiser le mot de passe
                            </UButton>
                        </form>

                        <div class="text-center mt-6">
                            <p class="text-gray-200 text-sm">
                                <router-link to="/auth/login"
                                    class="text-white hover:text-black hover:underline font-medium transition-colors flex items-center justify-center gap-2">
                                    <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                                    Retour à la connexion
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
    layout: false
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const token = ref('')

const errors = ref<Record<string, string[]>>({})
const message = ref('')
const isLoading = ref(false)

onMounted(() => {
    // Récupérer le token et l'email depuis l'URL si présents
    token.value = route.query.token as string || ''
    email.value = route.query.email as string || ''

    if (!token.value) {
        errors.value = { general: ['Lien de réinitialisation invalide ou expiré.'] }
    }
})

const handleResetPassword = async () => {
    errors.value = {}
    message.value = ''

    if (!password.value || password.value.length < 8) {
        errors.value.password = ['Le mot de passe doit contenir au moins 8 caractères.']
        return
    }

    if (password.value !== passwordConfirmation.value) {
        errors.value.password = ['Les mots de passe ne correspondent pas.']
        return
    }

    try {
        isLoading.value = true
        const { data, error: apiError } = await authStore.resetPassword({
            token: token.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value
        })

        if (apiError.value) {
            throw apiError.value
        }

        message.value = 'Votre mot de passe a été réinitialisé avec succès.'
        setTimeout(() => {
            router.push('/auth/login')
        }, 2000)
    } catch (e: any) {
        if (e.statusCode === 422) {
            errors.value = e.data?.errors || { general: ['Données invalides'] }
        } else {
            errors.value = { general: ['Une erreur est survenue. Le lien a peut-être expiré.'] }
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
/* Animations globales dans main.css */
</style>
