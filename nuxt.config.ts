export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-sanctum',
    'nuxt-vue3-google-signin',
    '@nuxt/image'
  ],

  googleSignIn: {
    clientId: '104418748780-pqm4bevt1v6p3qag1e96tdlmn79jg5r1.apps.googleusercontent.com',
  },

  sanctum: {
    baseUrl: '/api/v1',
    mode: 'cookie',

    endpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: '/auth/customer/login',
      logout: '/customer/logout',
      user: '/customer/me',
    },
    // Note: Si le mapping de la propriété 'data' est nécessaire, nous devrons peut-être ajuster le plugin auth ou l'intercepteur,
    // car la configuration standard de ce module pourrait ne pas supporter 'property' ici.

    redirect: {
      keepRequestedRoute: true,
      onLogin: '/dashboard',
      onLogout: '/',
      onAuthOnly: '/auth/login',
      onGuestOnly: '/dashboard'
    },

    globalMiddleware: {
      enabled: false,
    },
  },

  css: ['~/assets/css/main.css'],

  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google' },
      { name: 'Inter', provider: 'google' }
    ],
    defaults: {
      fallbacks: {
        'serif': ['Georgia'],
        'sans-serif': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial']
      }
    },
    experimental: {
      processCSSVariables: true
    }
  },

  runtimeConfig: {
    apiSecretUrl: '', // Sera surchargé par NUXT_API_SECRET_URL
    public: {
      apiBase: '', // Sera surchargé par NUXT_PUBLIC_API_BASE
      siteUrl: ''
    }
  },

  routeRules: {

    // 1. Règle critique pour Sanctum :
    // Le front appelle /api/v1/sanctum/csrf-cookie -> Le proxy renvoie vers Laravel /sanctum/csrf-cookie
    '/api/v1/sanctum/**': {
      proxy: 'http://localhost:8000/sanctum/**'
    },

    // 2. Règle pour le reste de l'API :
    // Le front appelle /api/v1/auth/... -> Le proxy renvoie vers Laravel /api/v1/auth/...
    '/api/v1/**': {
      proxy: 'http://localhost:8000/api/v1/**'
    },

    '/': { swr: 3600 },

    '/products/**': { swr: 600 },

    '/about': { prerender: true },
    '/legal/**': { prerender: true },

    '/cart': { ssr: false },
    '/checkout/**': { ssr: false },
    '/account/**': { ssr: false }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'bylin Style',
      meta: [
        { name: 'description', content: 'Votre site E-commerce nouvelle génération' }
      ],
      htmlAttrs: {
        lang: 'fr'
      }
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  vite: {
    build: {
      cssMinify: 'lightningcss'
    }
  }
})