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
                                Mot de passe oublié ?
                            </h1>
                            <p class="text-gray-900">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                        </div>

                        <form @submit.prevent="handleForgotPassword" class="space-y-6">
                            <UInput v-model="email" type="email" placeholder="Adresse mail" autocomplete="email"
                                autofocus size="xl" :ui="{
                                    base: 'w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200 bg-white',
                                    leading: { padding: { xl: 'pl-12' } }
                                }" :color="emailError ? 'red' : 'white'">
                                <template #leading>
                                    <div
                                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                                    </div>
                                </template>
                            </UInput>

                            <transition name="slide-down">
                                <p v-if="emailError" class="text-red-500 text-sm flex items-center gap-2">
                                    <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4" />
                                    {{ emailError }}
                                </p>
                            </transition>

                            <transition name="slide-down">
                                <p v-if="message"
                                    class="text-green-400 text-sm flex items-center gap-2 bg-green-900/20 p-3 rounded border border-green-500/30">
                                    <UIcon name="i-heroicons-check-circle" class="w-5 h-5 flex-shrink-0" />
                                    {{ message }}
                                </p>
                            </transition>

                            <transition name="slide-down">
                                <p v-if="error" class="text-red-500 text-sm flex items-center gap-2">
                                    <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4" />
                                    {{ error }}
                                </p>
                            </transition>

                            <UButton type="submit" :disabled="!email || !!emailError || isLoading" :loading="isLoading"
                                block size="xl" color="white" variant="solid"
                                class="hover:bg-indigo-700 hover:text-white hover:border transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-black font-medium">
                                Envoyer le lien
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
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
    layout: false
})

const authStore = useAuthStore()

const email = ref('')
const error = ref('')
const message = ref('')
const emailError = ref('')
const isLoading = ref(false)

const handleForgotPassword = async () => {
    error.value = ''
    message.value = ''
    emailError.value = ''

    if (!email.value || !email.value.includes('@')) {
        emailError.value = 'Veuillez entrer une adresse mail valide.'
        return
    }

    try {
        isLoading.value = true
        const { data, error: apiError } = await authStore.forgotPassword(email.value)

        if (apiError.value) {
            throw apiError.value
        }

        message.value = 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.'
        email.value = '' // Reset field on success
    } catch (e: any) {
        // On évite de révéler si l'email existe ou non pour la sécurité, sauf si c'est une erreur de validation
        if (e.statusCode === 422) {
            emailError.value = e.data?.message || 'Email invalide'
        } else {
            error.value = 'Une erreur est survenue. Veuillez réessayer plus tard.'
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
/* Animations globales dans main.css */
</style>
