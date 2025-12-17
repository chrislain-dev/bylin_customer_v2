import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_ROUTES } from '@/utils/api-route'
import type { Product, Reviews } from '~/types/product'


export const useProductStore = defineStore('product', () => {
    // ----- STATE -----
    const products = ref<Product[]>([])
    const currentProduct = ref<Product | null>(null)
    const reviews = ref<Reviews[]>([])

    // Filtres & Métadonnées
    const colors = ref<any[]>([])
    const sizes = ref<any[]>([])
    const brands = ref<any[]>([])

    const loading = ref(false)
    const error = ref<string | null>(null)

    // ----- GETTERS -----
    const hasProducts = computed(() => products.value.length > 0)
    const productImages = computed(() => currentProduct.value?.images || [])

    // ----- ACTIONS -----

    async function fetchAll(params: any = {}) {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await useApi<any>(API_ROUTES.products.base, { params })

            if (fetchError.value) {
                throw new Error(fetchError.value.message || "Erreur API")
            }

            const rawData = data.value

            if (!rawData) {
                products.value = []
                return
            }

            if (Array.isArray(rawData)) {
                products.value = rawData
            } else {
                products.value = rawData.products || rawData.data || []

                if (rawData.colors) colors.value = rawData.colors
                if (rawData.sizes) sizes.value = rawData.sizes
                if (rawData.brands) brands.value = rawData.brands
            }

        } catch (err: any) {
            console.error(err)
            error.value = err.message || "Erreur chargement produits"
            products.value = []
        } finally {
            loading.value = false
        }
    }

    async function fetchBySlug(slug: string) {
        loading.value = true
        error.value = null
        currentProduct.value = null

        try {
            const { data, error: fetchError } = await useApi<Product>(API_ROUTES.products.single(slug))

            if (fetchError.value) {
                throw new Error(fetchError.value.message)
            }

            if (data.value) {
                currentProduct.value = data.value

                reviews.value = data.value.reviews || []
            } else {
                throw new Error("Produit introuvable")
            }

            return currentProduct.value

        } catch (err: any) {
            error.value = err.message || "Produit introuvable"
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        products, currentProduct, colors, sizes, brands, reviews, loading, error,
        hasProducts, productImages,
        fetchAll, fetchBySlug
    }
})