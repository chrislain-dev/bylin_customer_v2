import type { UseFetchOptions } from 'nuxt/app'
import type { NitroFetchRequest } from 'nitropack'

export function useApi<T>(
    // 1. On utilise le bon type pour la requête (plus large que string)
    request: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
    opts?: UseFetchOptions<T>
) {
    const config = useRuntimeConfig()

    return useFetch<T>(request, {
        baseURL: config.public.apiBase ? String(config.public.apiBase) : '/api/v1',
        ...opts,
        headers: {
            Accept: 'application/json',
            // On étale les headers existants si présents
            ...opts?.headers
        }
    // 2. On caste en 'any' ici. C'est sécurisé car la fonction useApi<T> 
    // garantit déjà que le retour sera AsyncData<T, ...>
    } as any)
}