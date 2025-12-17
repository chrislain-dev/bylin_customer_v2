import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_ROUTES } from '@/utils/api-route'
import type { Country, City, District, DeliveryOption } from '@/types/location'

export const useLocationStore = defineStore('location', () => {
    // ----- STATE -----
    const countries = ref<Country[]>([])
    const cities = ref<City[]>([])
    const districts = ref<District[]>([])
    const deliveryOptions = ref<DeliveryOption[]>([])

    const loading = ref(false)
    const error = ref<string | null>(null)

    // ----- ACTIONS -----

    async function fetchCountries() {
        // Cache : Si on a déjà les pays, on ne rappelle pas l'API
        if (countries.value.length > 0) return countries.value

        loading.value = true
        try {
            // Adapte la route selon ton API réelle
            const { data } = await useApi<Country[]>('/api/countries')
            countries.value = data.value || []
            return countries.value
        } catch (err) {
            console.error(err)
            return []
        } finally {
            loading.value = false
        }
    }

    async function fetchCities(countryCode: string) {
        loading.value = true
        cities.value = []
        try {
            const { data } = await useApi<any>(API_ROUTES.location.cities(countryCode))
            cities.value = data.value?.cities || data.value?.data || []
        } catch (err) {
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    async function fetchDistricts(cityId: string) {
        loading.value = true
        districts.value = []
        try {
            const { data } = await useApi<any>(API_ROUTES.location.districts(cityId))
            districts.value = data.value?.districts || data.value?.data || []
        } catch (err) {
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    async function fetchDeliveryOptions(city: string, district?: string) {
        loading.value = true
        error.value = null
        deliveryOptions.value = []

        try {
            const { data } = await useApi<any>(API_ROUTES.location.deliveryOptions, {
                method: 'POST',
                body: { city, district }
            })

            if (data.value?.success) {
                deliveryOptions.value = data.value.options || []
            }
        } catch (err: any) {
            error.value = err.data?.message || "Impossible de charger les options de livraison"
        } finally {
            loading.value = false
        }
    }

    // Helper utile pour les templates
    function getCountryName(code: string) {
        const c = countries.value.find(c => c.code === code)
        return c ? c.name : code
    }

    return {
        countries, cities, districts, deliveryOptions, loading, error,
        fetchCountries, fetchCities, fetchDistricts, fetchDeliveryOptions,
        getCountryName
    }
})