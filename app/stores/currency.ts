import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import type { CurrencyCode, CurrencyState } from '~/types/currency'


export const useCurrencyStore = defineStore('currency', () => {
  // ----- STATE -----
  
  // Persistance automatique avec VueUse (SSR Safe)
  const selectedCurrency = useStorage<CurrencyCode>('currency-selected', 'XOF')
  
  // On groupe les taux et le timestamp pour la gestion du cache
  const rateData = useStorage<CurrencyState>('currency-rates', {
    rates: { XOF: 1, EUR: 0.00152, USD: 0.00166 }, // Valeurs par défaut sûres
    lastUpdated: null
  })

  const symbols: Record<CurrencyCode, string> = { XOF: 'F CFA', EUR: '€', USD: '$' }
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ----- GETTERS -----
  
  const symbol = computed(() => symbols[selectedCurrency.value])
  
  const currentRate = computed(() => rateData.value.rates[selectedCurrency.value] || 1)
  
  const isStale = computed(() => {
    if (!rateData.value.lastUpdated) return true
    // Cache de 24 heures
    return Date.now() - rateData.value.lastUpdated > 24 * 60 * 60 * 1000
  })

  // ----- ACTIONS -----

  function changeCurrency(newCurrency: CurrencyCode) {
    if (rateData.value.rates[newCurrency]) {
      selectedCurrency.value = newCurrency
    }
  }

  function formatPrice(amountInXOF: number): string {
    const currency = selectedCurrency.value
    // Conversion
    const converted = amountInXOF * (rateData.value.rates[currency] || 1)

    // Formatage spécifique XOF (sans décimales) vs autres
    if (currency === 'XOF') {
      return `${Math.round(converted).toLocaleString('fr-FR')} ${symbol.value}`
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(converted)
  }

  async function fetchRates() {
    // Si les données sont fraîches, on ne fait rien
    if (!isStale.value && !import.meta.server) return

    isLoading.value = true
    error.value = null

    try {
      // API Externe : On utilise $fetch (ofetch) directement, pas notre proxy interne
      // Note: Idéalement, passe par ton backend pour cacher la clé API ou éviter les CORS, 
      // mais pour une API publique, le client-side est ok.
      const response = await $fetch<any>('https://api.exchangerate-api.com/v4/latest/XOF')
      
      rateData.value = {
        rates: {
          XOF: 1,
          USD: response.rates.USD,
          EUR: response.rates.EUR
        },
        lastUpdated: Date.now()
      }
      
    } catch (err: any) {
      console.error('Erreur taux de change:', err)
      error.value = "Impossible de mettre à jour les taux de change"
      // On garde les anciens taux en cas d'erreur (fail-safe)
    } finally {
      isLoading.value = false
    }
  }

  // ----- INIT -----
  // Appel automatique côté client si nécessaire
  if (import.meta.client) {
    fetchRates()
  }

  return {
    selectedCurrency,
    isLoading,
    error,
    symbol,
    currentRate,
    changeCurrency,
    formatPrice,
    fetchRates
  }
})