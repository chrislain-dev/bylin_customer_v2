export const API_ROUTES = {
  // -----------------------------
  // AUTHENTICATION & ACCOUNT
  // -----------------------------
  auth: {
    login: '/auth/customer/login',
    register: '/auth/customer/register',
    newsletter: '/customer/newsletter/subscribe',
    logout: '/customer/logout',
    me: '/customer/me',
    googleRedirect: '/auth/customer/google/redirect',
    googleCallback: '/auth/customer/google/callback',

    // Email Verification / OTP
    verifyOtp: '/auth/customer/verify-otp',
    resendOtp: '/auth/customer/resend-otp',
    verifyEmail: (id: string, hash: string) => `/auth/customer/email/verify/${id}/${hash}`,
    resendVerification: '/auth/customer/email/verification-notification',

    // Password management
    forgotPassword: '/auth/customer/forgot-password',
    resetPassword: '/auth/customer/reset-password',
    changePassword: '/customer/account/password',

    // Profile updates
    updateProfile: '/customer/profile',
    updateAvatar: '/customer/profile/avatar',
    deleteAvatar: '/customer/profile/avatar',
    updateBirthDate: '/customer/profile/birth-date',

    // Account management
    updateEmail: '/customer/account/email',
    verifyNewEmail: '/customer/account/email/verify',
    updatePhone: '/customer/account/phone',
    verifyNewPhone: '/customer/account/phone/verify',
  },

  // -----------------------------
  // CUSTOMERS & DASHBOARD
  // -----------------------------
  customers: {
    emailAvailable: '/auth/customer/email/available',
    dashboard: '/customer/dashboard-customer-datas',

    activities: {
      base: '/customer/activities',
      stats: '/customer/activities/stats',
      types: '/customer/activities/types',
    },

    addresses: {
      base: '/customer/profile/addresses',
      single: (id: string) => `/customer/profile/addresses/${id}`,
      default: '/customer/profile/addresses/default',
      setDefault: (id: string) => `/customer/profile/addresses/default/${id}`,
    },
  },

  // -----------------------------
  // PRODUCTS
  // -----------------------------
  products: {
    base: '/customer/products',
    single: (idOrSlug: string) => `/customer/products/${idOrSlug}`,
    newCollection: '/customer/products/new-collection',
    // categories: '/customer/products/category/${slug}',
    category: (slug: string) => `/customer/products/category/${slug}`,
    featured: '/customer/collections/featured',
    latest: '/customer/collections/latest',

    // Authenticated (CRUD)
    create: '/customer/products',
    update: (id: string) => `/customer/products/${id}`,
    delete: (id: string) => `/customer/products/${id}`,

    // Categories & Brands
    categories: '/customer/categories',
    categorySingle: (slug: string) => `/customer/categories/${slug}`,
    navBarCategories: '/customer/categories/navbar',
    brands: '/customer/brands',
  },

  // -----------------------------
  // COLLECTIONS
  // -----------------------------
  collections: {
    base: '/customer/collections',
    featured: '/customer/collections/featured',
    latest: '/customer/collections/latest',
    single: (slug: string) => `/customer/collections/${slug}`,
  },

  // -----------------------------
  // CARTS
  // -----------------------------
  cart: {
    base: '/customer/cart',
    coupon: '/customer/cart/coupon',
    check: '/customer/cart/check',
    load: '/customer/cart/load',
    destroy: '/customer/cart',

    // Shared carts
    shared: {
      publicSingle: (token: string) => `/customer/shared-cart/${token}`,
      base: '/customer/shared-carts',
      single: (id: string) => `/customer/shared-carts/${id}`,
      delete: (id: string) => `/customer/shared-carts/${id}/delete`,
      paymentMethods: '/customer/shared-carts/payment-methods',
      processPayment: (token: string) => `/customer/shared-carts/${token}/payment`,
    },
  },

  // -----------------------------
  // ORDERS
  // -----------------------------
  orders: {
    base: '/customer/orders',
    single: (orderNumber: string) => `/customer/orders/${orderNumber}`,
    place: '/customer/orders',
    history: '/customer/orders/history',
    downloadInvoice: (orderId: string) => `/customer/orders/${orderId}/invoice/download`,
  },

  // -----------------------------
  // REVIEWS
  // -----------------------------
  reviews: {
    base: '/customer/reviews',
    showForm: (orderId: string) => `/customer/reviews/order/${orderId}`,
    submit: '/customer/reviews/submit',
    submitBatch: '/customer/reviews/submit-batch',
  },

  // -----------------------------
  // TUTORIALS
  // -----------------------------
  tutorials: {
    base: '/customer/tutorials',
    free: '/customer/tutorials/free',
    premium: '/customer/tutorials/premium',
    categories: '/customer/tutorials/categories',
    byCategory: (categorySlug: string) => `/customer/tutorials/category/${categorySlug}`,
    single: (id: string) => `/customer/tutorials/${id}`,
    bySlug: (slug: string) => `/customer/tutorials/slug/${slug}`,
    purchased: '/customer/user/purchased-tutorials',
    purchase: '/customer/user/tutorials/purchase',
  },

  // -----------------------------
  // LOCATION
  // -----------------------------
  location: {
    cities: (countryCode: string) => `/customer/countries/${countryCode}/cities`,
    districts: (cityId: string) => `/customer/cities/${cityId}/districts`,
    deliveryOptions: '/customer/delivery/options',
  },

  // -----------------------------
  // PAGES
  // -----------------------------
  pages: {
    homepage: '/customer/page/homepage',
    homeCollections: '/customer/home/collections',
    latestCollection: '/customer/home/collections/latest',
  },

  // -----------------------------
  // WISHLISTS
  // -----------------------------
  wishlists: {
    base: '/customer/wishlists',
    sync: '/customer/wishlists/sync',
    single: (id: string) => `/customer/wishlists/${id}`,
  },

  // -----------------------------
  // PAYMENTS
  // -----------------------------
  payments: {
    fedapayCallback: '/customer/fedapay/callback',
    genericCallback: '/customer/payment/callback',
  },
};