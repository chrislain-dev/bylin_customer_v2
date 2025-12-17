// stores/auth.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import type { Customer, ValidationErrors } from '@/types/auth'
import { API_ROUTES } from '@/utils/api-route'

export const useAuthStore = defineStore('auth', () => {
  // 1. Outils Sanctum
  const sanctumUser = useSanctumUser<any>() // Type any car peut contenir {success, message, data}
  const { login: sanctumLogin, logout: sanctumLogout, refreshIdentity } = useSanctumAuth()

  const client = useSanctumClient()

  // Déballer automatiquement la propriété 'data' si elle existe
  const user = computed<Customer | null>(() => {
    if (!sanctumUser.value) return null

    // Si la réponse a le format {success, message, data}, extraire 'data'
    if (
      typeof sanctumUser.value === 'object' &&
      'data' in sanctumUser.value &&
      'success' in sanctumUser.value
    ) {
      return (sanctumUser.value as any).data as Customer
    }

    // Sinon retourner tel quel
    return sanctumUser.value as Customer
  })

  // DEBUG: Watch pour vérifier la réactivité
  watch(sanctumUser, (newVal) => {
    console.log('🔄 sanctumUser changed:', newVal)
  }, { deep: true })

  watch(user, (newVal) => {
    console.log('👤 user computed changed:', newVal)
  })

  // States
  const pendingOrdersCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 2. Getters
  const isAuthenticated = computed(() => !!user.value)
  const fullName = computed(() => user.value ? `${user.value.first_name} ${user.value.last_name}` : 'Utilisateur')
  const userEmail = computed(() => user.value?.email || '')
  const isEmailVerified = computed(() => !!user.value?.email_verified_at)
  const hasPhone = computed(() => !!user.value?.phone)
  const isActive = computed(() => user.value?.status === 'active')

  const roles = computed(() => user.value?.roles || [])
  const permissions = computed(() => user.value?.permissions || [])

  // 3. Helper gestion d'erreurs (Adapté pour ofetch/Sanctum)
  function handleApiError(err: any): { message: string; errors?: ValidationErrors } {
    // ofetch met la réponse dans err.response
    const response = err.response
    const status = response?.status || 500
    const data = response?._data || {}

    // Erreur réseau pure (serveur éteint, pas d'internet)
    if (!response) {
      return { message: 'Impossible de contacter le serveur. Vérifiez votre connexion.' }
    }

    switch (status) {
      case 401:
        return { message: 'Session expirée. Veuillez vous reconnecter.' }
      case 403:
        return { message: 'Action non autorisée ou compte bloqué.' }
      case 422:
        // Laravel renvoie les erreurs de validation ici
        return {
          message: data.message || 'Veuillez vérifier les champs.',
          errors: data.errors
        }
      case 429:
        return { message: 'Trop de tentatives. Veuillez patienter.' }
      default:
        return { message: data.message || 'Une erreur inattendue est survenue.' }
    }
  }

  // 4. Actions

  // --- LOGIN CLASSIC ---
  async function login(credentials: any) {
    loading.value = true
    error.value = null
    const cartStore = useCartStore()

    try {
      // Le module gère le CSRF et l'appel /login
      await sanctumLogin(credentials)

      // Post-login : on merge le panier invité avec le panier user
      await cartStore.syncCartWithServer(false)

      return { success: true }
    } catch (err: any) {
      const handled = handleApiError(err)
      error.value = handled.message
      throw handled
    } finally {
      loading.value = false
    }
  }

  // --- REGISTER ---
  async function register(userData: any) {
    loading.value = true
    error.value = null

    try {
      // IMPORTANT : Pour une inscription, on doit initialiser le cookie CSRF manuellement
      // car on n'utilise pas la méthode 'login' du module ici.
      await client('/sanctum/csrf-cookie')

      // Appel API via le client Sanctum
      await client(API_ROUTES.auth.register, {
        method: 'POST',
        body: userData
      })

      // Une fois inscrit, on rafraîchit l'identité (Laravel connecte souvent l'user après inscription)
      // Si ton API ne connecte pas auto, tu devras peut-être appeler login() ici.
      await refreshIdentity()

      return { success: true }
    } catch (err: any) {
      const handled = handleApiError(err)
      error.value = handled.message
      throw handled
    } finally {
      loading.value = false
    }
  }

  // --- LOGOUT ---
  async function logout() {
    console.log('🚪 Logout: Début')
    if (loading.value) {
      console.log('⚠️ Logout: Déjà en cours de chargement, annulation')
      return // Anti-spam clic
    }
    loading.value = true

    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()

    try {
      console.log('🛒 Logout: Sauvegarde du panier...')
      // Sauvegarde des états avant destruction
      if (cartStore.items.length > 0) await cartStore.syncCartWithServer(false).catch(() => { })
      // Optionnel : Sauvegarder wishlist si besoin

      console.log('🧹 Logout: Reset des stores...')
      // Reset des stores locaux
      cartStore.$reset()
      wishlistStore.$reset()

      console.log('📤 Logout: Appel API logout...')
      // Appel API logout via le module
      await sanctumLogout()
      console.log('✅ Logout: API logout réussie')
    } catch (err) {
      console.error('❌ Erreur logout:', err)
      console.warn('Erreur logout (non bloquante)', err)
    } finally {
      loading.value = false
      console.log('↩️ Logout: Redirection vers /')
      // Redirection forcée
      await navigateTo('/')
    }
  }

  // --- GOOGLE OAUTH ---
  async function initGoogleAuth(redirectUrl?: string) {
    loading.value = true
    error.value = null
    try {
      // Appel pour obtenir l'URL de redirection Google (Laravel Socialite)
      const data = await client<{ url: string }>(API_ROUTES.auth.googleRedirect, {
        params: { redirect_url: redirectUrl }
      })

      if (data?.url) {
        // Redirection externe
        window.location.href = data.url
      }
    } catch (err: any) {
      error.value = handleApiError(err).message
    } finally {
      loading.value = false
    }
  }

  async function handleGoogleCallback(code: string, state?: string) {
    loading.value = true
    error.value = null
    const cartStore = useCartStore()

    try {
      // Envoi du code Google au backend pour échange contre session Laravel
      await client(API_ROUTES.auth.googleCallback, {
        method: 'GET',
        params: { code, state }
      })

      // Récupération de l'user connecté
      await refreshIdentity()
      await cartStore.syncCartWithServer(false)

      return true
    } catch (err: any) {
      const handled = handleApiError(err)
      error.value = handled.message
      throw handled
    } finally {
      loading.value = false
    }
  }

  // --- USER PROFILE & UTILS ---

  async function fetchUser() {
    try {
      await refreshIdentity()
    } catch (e) {
      // Silencieux : si on arrive pas à fetcher, c'est qu'on est pas loggé
    }
  }

  async function updateProfile(userData: Partial<Customer>) {
    loading.value = true
    error.value = null
    try {
      await client(API_ROUTES.auth.updateProfile, {
        method: 'PUT',
        body: userData
      })
      await refreshIdentity() // Mise à jour des infos locales
    } catch (err: any) {
      const handled = handleApiError(err)
      error.value = handled.message
      throw handled
    } finally {
      loading.value = false
    }
  }

  async function newsletterSubscribe(email: string) {
    // Pas besoin de loading global pour la newsletter, on retourne la promise
    try {
      return await client(API_ROUTES.auth.newsletter, {
        method: 'POST',
        body: { email }
      })
    } catch (err: any) {
      throw handleApiError(err)
    }
  }

  // Fonctions fléchées simples
  const forgotPassword = (email: string) =>
    client(API_ROUTES.auth.forgotPassword, { method: 'POST', body: { email } })

  const resetPassword = (data: any) =>
    client(API_ROUTES.auth.resetPassword, { method: 'POST', body: data })

  return {
    // State & Getters
    user,
    isAuthenticated,
    pendingOrdersCount,
    roles,
    permissions,
    loading,
    error,
    fullName,
    userEmail,
    isEmailVerified,
    hasPhone,
    isActive,

    // Actions
    login,
    register,
    logout,
    initGoogleAuth,
    handleGoogleCallback,
    fetchUser,
    updateProfile,
    newsletterSubscribe,
    forgotPassword,
    resetPassword
  }
})