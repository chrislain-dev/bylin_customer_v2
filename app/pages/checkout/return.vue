<template>
      <div class="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full text-center space-y-8">

                  <!-- Loading : on vérifie le vrai statut auprès de l'API -->
                  <template v-if="state === 'loading'">
                        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
                              <UIcon name="i-heroicons-arrow-path" class="h-10 w-10 text-gray-500 animate-spin" />
                        </div>
                        <div>
                              <h2 class="mt-6 text-2xl font-bold text-gray-900 font-syne">Vérification du paiement…</h2>
                              <p class="mt-2 text-sm text-gray-600">
                                    Merci de patienter, nous confirmons votre paiement auprès de notre prestataire.
                              </p>
                        </div>
                  </template>

                  <!-- Paiement confirmé -->
                  <template v-else-if="state === 'paid'">
                        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                              <UIcon name="i-heroicons-check" class="h-12 w-12 text-green-600" />
                        </div>
                        <div>
                              <h2 class="mt-6 text-3xl font-extrabold text-gray-900 font-syne">Paiement confirmé !</h2>
                              <p v-if="order" class="mt-2 text-sm font-medium text-gray-800">
                                    Commande n°{{ order.order_number }}
                              </p>
                              <p class="mt-2 text-sm text-gray-600">
                                    Merci pour votre achat. Vous recevrez bientôt un email de confirmation avec les
                                    détails de votre commande.
                              </p>
                        </div>
                        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                              <UButton to="/account/orders" size="xl" color="neutral" variant="outline"
                                    class="px-8 justify-center">
                                    Mes commandes
                              </UButton>
                              <UButton to="/products" size="xl" color="neutral" variant="solid"
                                    class="px-8 justify-center">
                                    Continuer mes achats
                              </UButton>
                        </div>
                  </template>

                  <!-- Paiement encore en attente côté prestataire (webhook pas encore reçu) -->
                  <template v-else-if="state === 'pending'">
                        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-amber-100">
                              <UIcon name="i-heroicons-clock" class="h-12 w-12 text-amber-600" />
                        </div>
                        <div>
                              <h2 class="mt-6 text-2xl font-bold text-gray-900 font-syne">Paiement en cours de
                                    traitement</h2>
                              <p v-if="order" class="mt-2 text-sm font-medium text-gray-800">
                                    Commande n°{{ order.order_number }}
                              </p>
                              <p class="mt-2 text-sm text-gray-600">
                                    La confirmation peut prendre quelques instants. Vous recevrez un email dès que le
                                    paiement
                                    sera validé — vous pouvez aussi suivre le statut depuis votre compte.
                              </p>
                        </div>
                        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                              <UButton :loading="checking" size="xl" color="primary" class="px-8 justify-center"
                                    @click="checkStatus">
                                    Vérifier à nouveau
                              </UButton>
                              <UButton to="/account/orders" size="xl" color="neutral" variant="outline"
                                    class="px-8 justify-center">
                                    Mes commandes
                              </UButton>
                        </div>
                  </template>

                  <!-- Paiement échoué / annulé -->
                  <template v-else-if="state === 'failed'">
                        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
                              <UIcon name="i-heroicons-x-mark" class="h-12 w-12 text-red-600" />
                        </div>
                        <div>
                              <h2 class="mt-6 text-2xl font-bold text-gray-900 font-syne">Le paiement n'a pas abouti
                              </h2>
                              <p v-if="order" class="mt-2 text-sm font-medium text-gray-800">
                                    Commande n°{{ order.order_number }}
                              </p>
                              <p class="mt-2 text-sm text-gray-600">
                                    Le paiement a été refusé ou annulé. Aucun montant n'a été débité de façon
                                    définitive.
                                    Vous pouvez réessayer ou finaliser votre commande via WhatsApp avec un conseiller
                                    BYLIN.
                              </p>
                        </div>
                        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                              <UButton to="/checkout/payment" size="xl" color="primary" class="px-8 justify-center">
                                    Réessayer le paiement
                              </UButton>
                              <UButton to="/account/orders" size="xl" color="neutral" variant="outline"
                                    class="px-8 justify-center">
                                    Mes commandes
                              </UButton>
                        </div>
                  </template>

                  <!-- Erreur technique (commande introuvable, etc.) -->
                  <template v-else>
                        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
                              <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-gray-500" />
                        </div>
                        <div>
                              <h2 class="mt-6 text-2xl font-bold text-gray-900 font-syne">Impossible de vérifier la
                                    commande</h2>
                              <p class="mt-2 text-sm text-gray-600">
                                    Retrouvez le statut de votre commande directement dans votre compte.
                              </p>
                        </div>
                        <UButton to="/account/orders" size="xl" color="primary" class="px-8">
                              Mes commandes
                        </UButton>
                  </template>

            </div>
      </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'sanctum:auth' })

const route = useRoute()
const orderStore = useOrderStore()

type ViewState = 'loading' | 'paid' | 'pending' | 'failed' | 'error'

const state = ref<ViewState>('loading')
const checking = ref(false)
const order = computed(() => orderStore.currentOrder)

// Combien de fois on retente automatiquement si le paiement est encore "pending"
// (le webhook FedaPay peut arriver quelques secondes après la redirection navigateur).
const MAX_AUTO_RETRIES = 3
let autoRetries = 0

function resolveState(paymentStatus: string | undefined): ViewState {
      if (paymentStatus === 'paid') return 'paid'
      if (paymentStatus === 'failed' || paymentStatus === 'refunded') return 'failed'
      return 'pending'
}

async function checkStatus() {
      const orderId = route.query.order_id as string
      if (!orderId) {
            state.value = 'error'
            return
      }

      checking.value = true
      try {
            const fetched = await orderStore.fetchOrder(orderId)
            state.value = resolveState(fetched?.payment_status)

            // Si toujours "pending", on retente automatiquement quelques fois avec un
            // court délai, au cas où le webhook FedaPay serait juste en train d'arriver.
            if (state.value === 'pending' && autoRetries < MAX_AUTO_RETRIES) {
                  autoRetries++
                  setTimeout(checkStatus, 3000)
            }
      } catch (e) {
            console.error('Order status check failed:', e)
            state.value = 'error'
      } finally {
            checking.value = false
      }
}

onMounted(() => {
      checkStatus()
})

useHead({
      title: 'Vérification du paiement - Bylin'
})
</script>