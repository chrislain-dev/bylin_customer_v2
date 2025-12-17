import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_ROUTES } from '@/utils/api-route'
import type { Brand } from '~/types/brand'


export const useBrandStore = defineStore('brand', () => {
    // ----- STATE -----
    const brands = ref<Brand[]>([])
    const currentBrand = ref<Brand | null>(null)

    const loading = ref(false)
    const error = ref<string | null>(null)

    // ----- GETTERS -----
    const count = computed(() => brands.value.length)
    const isEmpty = computed(() => brands.value.length === 0)

    // Retourne une fonction de recherche (Performance: O(n))
    const getById = computed(() => (id: string) => brands.value.find(b => b.id === id))

    // ----- ACTIONS -----

    async function fetchAll() {
        // Cache simple : si déjà chargé, on ne recharge pas (sauf force refresh)
        if (brands.value.length > 0) return

        loading.value = true
        error.value = null
        try {
            const { data, error: fetchError } = await useApi<Brand[]>(API_ROUTES.products.brands)

            if (fetchError.value) {
                throw new Error(fetchError.value.message || "Erreur API")
            }

            brands.value = Array.isArray(data.value) ? data.value : (data.value as any).data || []
        } catch (err: any) {
            error.value = error.value || 'Erreur chargement marques'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    async function fetchOne(idOrSlug: string | number) {
        loading.value = true
        error.value = null
        try {
            const { data, error: fetchError } = await useApi<Brand>(`${API_ROUTES.products.brands}/${idOrSlug}`)

            if (fetchError.value) {
                throw new Error(fetchError.value.message || "Erreur API")
            }

            currentBrand.value = (data.value as any).data || data.value
            return currentBrand.value
        } catch (err: any) {
            error.value = error.value || 'Marque introuvable'
            throw err
        } finally {
            loading.value = false
        }
    }

    function $reset() {
        brands.value = []
        currentBrand.value = null
        error.value = null
        loading.value = false
    }

    return {
        // State
        brands,
        currentBrand,
        loading,
        error,

        // Getters
        count,
        isEmpty,
        getById,

        // Actions
        fetchAll,
        fetchOne,
        $reset
    }
})