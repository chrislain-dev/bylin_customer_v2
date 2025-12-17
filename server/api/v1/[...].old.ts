import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  // 1. Configuration
  const config = useRuntimeConfig()
  const laravelUrl = config.apiSecretUrl || 'http://localhost:8000'
  const apiPrefix = '/api/v1'

  // 2. Extraction du chemin (on retire '/api/v1' de l'URL entrante)
  // Ex: '/api/v1/sanctum/csrf-cookie' devient '/sanctum/csrf-cookie'
  const path = event.path.replace(new RegExp(`^${apiPrefix}`), '')

  // 3. Construction intelligente de l'URL Cible
  let target: string

  // CORRECTION ICI : 
  // Si c'est une route Sanctum native (comme csrf-cookie), elle est souvent à la racine de Laravel.
  // Sinon, on rajoute le préfixe /api/v1 pour tes routes custom.
  if (path.startsWith('/sanctum/')) {
     target = joinURL(laravelUrl, path) // http://localhost:8000/sanctum/csrf-cookie
  } else {
     target = joinURL(laravelUrl, apiPrefix, path) // http://localhost:8000/api/v1/auth/register
  }

  // 4. Gestion des Headers (Sécurité & IP)
  const headers = getRequestHeaders(event)
  const proxyHeaders = { ...headers }

  delete proxyHeaders['host']
  delete proxyHeaders['content-length']

  const xForwardedFor = getHeader(event, 'x-forwarded-for')
  const reqIp = getRequestIP(event, { xForwardedFor: true })

  if (reqIp) {
    proxyHeaders['x-forwarded-for'] = xForwardedFor 
      ? `${xForwardedFor}, ${reqIp}` 
      : reqIp
  }

  // 5. Proxying
  return proxyRequest(event, target, {
    headers: proxyHeaders,
    fetchOptions: {
      redirect: 'manual',
    },
    onResponse(outputEvent, response) {
      const cookies = response.headers.getSetCookie()
      if (cookies) {
        for (const cookie of cookies) {
          appendResponseHeader(outputEvent, 'set-cookie', cookie)
        }
      }
    }
  })
})