export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@nuxt/ui",
    "@nuxt/icon",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-sanctum",
    "nuxt-vue3-google-signin",
    "@nuxt/image",
  ],

  icon: {
    provider: "server",
    serverBundle: {
      collections: ["heroicons", "lucide"],
    },
    clientBundle: {
      scan: true,
      icons: [
        "heroicons:check-circle",
        "heroicons:exclamation-triangle",
        "heroicons:exclamation-circle",
        "heroicons:trash",
        "lucide:x",
      ],
    },
  },

  googleSignIn: {
    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  },

  sanctum: {
    baseUrl: process.env.NUXT_SANCTUM_BASE_URL || "http://localhost:8000",
    mode: "cookie",
    userStateKey: "sanctum.user.identity",
    redirectIfAuthenticated: false,
    redirectIfUnauthenticated: false,

    endpoints: {
      csrf: "/sanctum/csrf-cookie",
      login: "/api/v1/auth/customer/login",
      logout: "/api/v1/customer/logout",
      user: "/api/v1/customer/me",
    },

    csrf: {
      cookie: "XSRF-TOKEN",
      header: "X-XSRF-TOKEN",
    },

    client: {
      retry: false,
      initialRequest: true,
    },

    redirect: {
      keepRequestedRoute: true,
      onLogin: "/account",
      onLogout: "/",
      onAuthOnly: "/auth/login",
      onGuestOnly: "/",
    },

    globalMiddleware: {
      enabled: false,
      allow404WithoutAuth: true,
    },

    origin: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001",
  },

  css: ["~/assets/css/main.css"],

  fonts: {
    families: [
      { name: "Plus Jakarta Sans", provider: "google" },
      { name: "Inter", provider: "google" },
    ],
    defaults: {
      fallbacks: {
        serif: ["Georgia"],
        "sans-serif": [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Arial",
        ],
      },
    },
    experimental: {
      processCSSVariables: true,
    },
  },

  runtimeConfig: {
    // Privée : URL interne directe vers Laravel (SSR uniquement)
    apiSecretUrl: process.env.NUXT_API_SECRET_URL || "http://localhost:8000",

    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || "Bylin",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001",
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    },
  },

  routeRules: {
    // Home : SSR classique sans cache statique
    "/": { ssr: true },
    "/about": { prerender: true },
    "/legal/**": { prerender: true },

    // Pages dynamiques avec cache court
    "/products/**": { swr: 600 },
    "/categories/**": { swr: 600 },

    // Pages client uniquement
    "/cart": { ssr: false },
    "/checkout/**": { ssr: false },
    "/account/**": { ssr: false },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Bylin Style",
      meta: [
        {
          name: "description",
          content: "Votre site E-commerce nouvelle génération",
        },
      ],
      htmlAttrs: {
        lang: "fr",
      },
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },

  devServer: {
    port: 3001,
    host: "localhost",
  },

  nitro: {
    devProxy: {
      "/api": {
        target: process.env.NUXT_API_SECRET_URL || "http://localhost:8000",
        changeOrigin: true,
        prependPath: true,
      },
      "/sanctum": {
        target: process.env.NUXT_API_SECRET_URL || "http://localhost:8000",
        changeOrigin: true,
        prependPath: true,
      },
    },

    routeRules: {
      "/api/**": {
        proxy:
          process.env.NODE_ENV === "production"
            ? `${process.env.NUXT_API_SECRET_URL}/**`
            : undefined,
        headers: {
          Accept: "application/json",
        },
      },
      "/sanctum/**": {
        proxy:
          process.env.NODE_ENV === "production"
            ? `${process.env.NUXT_API_SECRET_URL}/sanctum/**`
            : undefined,
      },
    },
  },
});
