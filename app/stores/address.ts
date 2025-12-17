import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Address } from '@/types/auth'
import { API_ROUTES } from '@/utils/api-route'

export const useAddressStore = defineStore('address', () => {
    const addresses = ref<Address[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const defaultAddress = computed(() => addresses.value.find(a => a.is_default))
    const billingAddresses = computed(() => addresses.value.filter(a => a.type === 'billing'))
    const shippingAddresses = computed(() => addresses.value.filter(a => a.type === 'shipping'))

    // Actions
    async function fetchAddresses() {
        loading.value = true
        error.value = null
        try {
            const { data } = await useApi<Address[]>(API_ROUTES.customers.addresses.base)
            if (data.value) {
                addresses.value = data.value
            }
        } catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement des adresses'
        } finally {
            loading.value = false
        }
    }

    async function addAddress(address: Omit<Address, 'id'>) {
        loading.value = true
        error.value = null
        try {
            const { data } = await useApi<Address>(API_ROUTES.customers.addresses.base, {
                method: 'POST',
                body: address
            })
            if (data.value) {
                addresses.value.push(data.value)
                // Si c'est la première adresse ou marquée par défaut, on met à jour localement
                if (address.is_default || addresses.value.length === 1) {
                    addresses.value.forEach(a => {
                        if (a.id !== data.value!.id) a.is_default = false
                    })
                }
            }
            return true
        } catch (err: any) {
            error.value = err.message || "Erreur lors de l'ajout de l'adresse"
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateAddress(id: string, address: Partial<Address>) {
        loading.value = true
        error.value = null
        try {
            const { data } = await useApi<Address>(API_ROUTES.customers.addresses.single(id), {
                method: 'PUT',
                body: address
            })
            if (data.value) {
                const index = addresses.value.findIndex(a => a.id === id)
                if (index !== -1) {
                    addresses.value[index] = data.value
                    if (data.value.is_default) {
                        addresses.value.forEach(a => {
                            if (a.id !== id) a.is_default = false
                        })
                    }
                }
            }
            return true
        } catch (err: any) {
            error.value = err.message || "Erreur lors de la modification de l'adresse"
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteAddress(id: string) {
        loading.value = true
        error.value = null
        try {
            await useApi(API_ROUTES.customers.addresses.single(id), {
                method: 'DELETE'
            })
            addresses.value = addresses.value.filter(a => a.id !== id)
            return true
        } catch (err: any) {
            error.value = err.message || "Erreur lors de la suppression de l'adresse"
            throw err
        } finally {
            loading.value = false
        }
    }

    async function setDefaultAddress(id: string) {
        loading.value = true
        error.value = null
        try {
            await useApi(API_ROUTES.customers.addresses.setDefault(id), {
                method: 'PATCH'
            })
            addresses.value.forEach(a => {
                a.is_default = (a.id === id)
            })
            return true
        } catch (err: any) {
            error.value = err.message || "Erreur lors de la définition de l'adresse par défaut"
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        addresses,
        loading,
        error,
        defaultAddress,
        billingAddresses,
        shippingAddresses,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
    }
})
