export default defineNuxtPlugin(() => {
    const nuxtApp = useNuxtApp()

    // Intercepter toutes les réponses $fetch pour déballer la structure Laravel
    nuxtApp.hook('app:created', () => {
        const originalFetch = globalThis.$fetch

        globalThis.$fetch = new Proxy(originalFetch, {
            apply(target, thisArg, args) {
                return Reflect.apply(target, thisArg, args).then((response: any) => {
                    // Si la réponse suit le format Laravel { success, message, data }
                    if (
                        response &&
                        typeof response === 'object' &&
                        'data' in response &&
                        'success' in response
                    ) {
                        return response.data
                    }
                    return response
                })
            }
        })
    })
})
