import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCartStore } from './cart'
import { API_ROUTES } from '@/utils/api-route'
import type { CreateOrderResponse, Order } from '@/types/order'


export const useOrderStore = defineStore('order', () => {
  // ----- STATE -----
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const successMessage = ref<string | null>(null)

  const paymentRedirectUrl = ref<string | null>(null)

  // ----- GETTERS -----
  const sortedOrders = computed(() => 
    [...orders.value].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  )
  
  // Helpers de statut
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
  
  // ----- ACTIONS -----

  async function createOrder(orderData: any) {
    loading.value = true
    error.value = null
    successMessage.value = null
    paymentRedirectUrl.value = null
    
    const cartStore = useCartStore()

    try {
      // useApi gère le baseURL
      const { data, error: fetchError } = await useApi<CreateOrderResponse>(API_ROUTES.orders.place, {
        method: 'POST',
        body: orderData
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }

    // Extraction URL de paiement (FedaPay)
    const url = rawData.redirect_url || 
                rawData.payment_token?.payment_url ||
                rawData.payment_token?.url

    if (url) {
        paymentRedirectUrl.value = url
    }

        if (rawData.order) currentOrder.value = rawData.order
        orders.value.unshift(currentOrder.value!) // Ajout en haut de liste localement
        successMessage.value = rawData.message || 'Commande enregistrée !'

        // On vide le panier car la commande est créée côté serveur
        cartStore.clearCart()

        return {
          success: true,
          order: currentOrder.value,
          redirectUrl: url
        }

    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Erreur lors de la commande'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserOrders() {
    loading.value = true
    try {
      const { data, error: fetchError } = await useApi<Order[]>(API_ROUTES.orders.base)

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }

      orders.value = rawData
    } catch (err: any) {
      console.error('Erreur chargement commandes', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(orderId: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await useApi<any>(API_ROUTES.orders.single(orderId))

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }

      currentOrder.value = rawData
      return currentOrder.value
    } catch (err: any) {
      error.value = "Impossible de récupérer la commande"
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Télécharge la facture
   * Note: On ne met PAS d'alert() ici. On throw l'erreur, le composant affichera le toast.
   */
  async function downloadInvoice(orderId: string) {
    if (!import.meta.client) return

    try {
      // On demande un Blob explicitement
      const { data: blobData, error: fetchError } = await useApi<Blob>(API_ROUTES.orders.downloadInvoice(orderId), {
        responseType: 'blob'
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const blob = blobData.value

      if (!(blob instanceof Blob)) throw new Error('Format de fichier invalide')

      // Création du lien temporaire
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `facture-${orderId}.pdf`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      
      // Nettoyage
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)

      return true

    } catch (err: any) {
      const status = err.statusCode || err.response?.status
      if (status === 404) throw new Error("La facture n'est pas encore disponible.")
      if (status === 403) throw new Error("Accès interdit à cette facture.")
      throw new Error("Erreur lors du téléchargement.")
    }
  }

  function resetState() {
    successMessage.value = null
    error.value = null
    paymentRedirectUrl.value = null
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    successMessage,
    paymentRedirectUrl,
    sortedOrders,
    pendingOrders,
    createOrder,
    fetchUserOrders,
    fetchOrderById,
    downloadInvoice,
    resetState
  }
})