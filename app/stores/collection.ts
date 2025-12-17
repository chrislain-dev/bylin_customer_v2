import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_ROUTES } from '@/utils/api-route'
import type { Collection } from '~/types/collection'


export const useCollectionStore = defineStore('collection', () => {
  const collections = ref<Collection[]>([])
  const currentCollection = ref<Collection | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => collections.value.length === 0)

  async function fetchAll(params: any = {}) {
    loading.value = true
    try {
      const { data, error: fetchError } = await useApi<any>(API_ROUTES.collections.base, { params })

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }

      collections.value = rawData
    } catch (err: any) {
      console.error('Erreur collections', err)
      error.value = "Erreur chargement collections"
    } finally {
      loading.value = false
    }
  }

  async function fetchBySlug(slug: string) {
    loading.value = true
    error.value = null
    currentCollection.value = null
    try {
      const { data, error: fetchError } = await useApi<any>(API_ROUTES.collections.single(slug))

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }

      currentCollection.value = rawData
      return currentCollection.value
    } catch (err: any) {
      error.value = "Collection introuvable"
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    collections, currentCollection, loading, error, isEmpty,
    fetchAll, fetchBySlug
  }
})