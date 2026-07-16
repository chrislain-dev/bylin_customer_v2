import type { Collection } from '~/types/collection'
import type { Product } from '~/types/product'

interface CollectionResponse<T> {
  success: boolean
  message?: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

export const useCollections = () => {
  const config = useRuntimeConfig()

  const getApiUrl = (path: string) => {
    if (process.server) return `${config.apiSecretUrl}${path}`
    return path
  }

  const getImageUrl = (url?: string | null) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${config.public.apiBase}${url}`
  }

  const fetchCollections = async (params?: { featured?: boolean; per_page?: number; page?: number }) => {
    const query = new URLSearchParams()
    if (params?.featured) query.append('featured', '1')
    if (params?.per_page) query.append('per_page', String(params.per_page))
    if (params?.page) query.append('page', String(params.page))

    const suffix = query.toString() ? `?${query}` : ''
    const response = await $fetch<CollectionResponse<Collection[]>>(getApiUrl(`/api/v1/catalog/collections${suffix}`))
    return response
  }

  const fetchCollectionBySlug = async (slug: string) => {
    const response = await $fetch<CollectionResponse<Collection>>(getApiUrl(`/api/v1/catalog/collections/${slug}`))
    return response.data
  }

  const fetchCollectionProducts = async (slug: string, params?: { page?: number; per_page?: number }) => {
    const query = new URLSearchParams()
    query.append('per_page', String(params?.per_page || 24))
    if (params?.page) query.append('page', String(params.page))

    const response = await $fetch<CollectionResponse<Product[]>>(getApiUrl(`/api/v1/catalog/collections/${slug}/products?${query}`))
    return response
  }

  return {
    fetchCollections,
    fetchCollectionBySlug,
    fetchCollectionProducts,
    getImageUrl,
  }
}
