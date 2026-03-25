<script setup lang="ts">
const { navigation } = useCategories()
const colorMode = useColorMode()

// Newsletter
const newsletterEmail = ref('')
const newsletterLoading = ref(false)
const newsletterSuccess = ref(false)

const subscribeNewsletter = async () => {
      if (!newsletterEmail.value) return

      newsletterLoading.value = true

      // Simuler l'inscription (remplacer par votre API)
      await new Promise(resolve => setTimeout(resolve, 1000))

      newsletterSuccess.value = true
      newsletterEmail.value = ''
      newsletterLoading.value = false

      setTimeout(() => {
            newsletterSuccess.value = false
      }, 3000)
}

// Liens footer
const shopLinks = computed(() =>
      navigation.value?.slice(0, 4).map(item => ({
            label: item.label,
            to: item.url
      })) || []
)

const helpLinks = [
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Livraison & Retours', to: '/shipping' },
      { label: 'Guide des tailles', to: '/size-guide' },
      { label: 'Suivi de commande', to: '/track-order' },
]

const companyLinks = [
      { label: 'À propos', to: '/about' },
      { label: 'Nos boutiques', to: '/stores' },
      { label: 'Blog', to: '/blog' },
]

const legalLinks = [
      { label: 'Conditions générales', to: '/legal/terms' },
      { label: 'Politique de confidentialité', to: '/legal/privacy' },
      { label: 'Mentions légales', to: '/legal/mentions' },
      { label: 'Cookies', to: '/legal/cookies' },
]

const socialLinks = [
      { icon: 'i-heroicons-globe-alt', label: 'Facebook', url: 'https://facebook.com' },
      { icon: 'i-heroicons-camera', label: 'Instagram', url: 'https://instagram.com' },
      { icon: 'i-heroicons-play', label: 'TikTok', url: 'https://tiktok.com' },
      { icon: 'i-heroicons-musical-note', label: 'Twitter', url: 'https://twitter.com' },
]

const paymentMethods = ['Visa', 'Mastercard', 'MTN Money', 'Moov Money']

const currentYear = new Date().getFullYear()
</script>

<template>
      <footer class="bg-primary-500 dark:bg-primary-900 text-white border-t border-primary-600 dark:border-primary-800">
            <!-- Main Footer -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

                        <!-- Brand & Newsletter -->
                        <div class="lg:col-span-2 space-y-6">
                              <!-- Logo -->
                              <NuxtLink to="/" class="inline-flex flex-col items-start group">
                                    <img src="/images/logo-white.png" alt="Bylin Logo"
                                          class="h-12 w-auto group-hover:opacity-80 transition-opacity">
                                    <span class="text-xs font-light tracking-widest uppercase mt-2">
                                          Cotonou · Bénin
                                    </span>
                              </NuxtLink>

                              <!-- Description -->
                              <p class="text-sm text-primary-100 dark:text-primary-300 leading-relaxed max-w-sm">
                                    Découvrez l'élégance africaine contemporaine.
                                    Mode authentique, qualité premium, livraison rapide à Cotonou.
                              </p>

                              <!-- Newsletter -->
                              <div class="space-y-3">
                                    <h4 class="text-sm font-bold uppercase tracking-wider">
                                          Newsletter
                                    </h4>
                                    <p class="text-xs text-primary-100 dark:text-primary-300">
                                          Inscrivez-vous et recevez -10% sur votre première commande
                                    </p>

                                    <div v-if="!newsletterSuccess" class="flex gap-2">
                                          <UInput v-model="newsletterEmail" type="email" placeholder="votre@email.com"
                                                size="md" class="flex-1" :ui="{
                                                      base: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                                }" @keyup.enter="subscribeNewsletter" />
                                          <UButton color="neutral" :loading="newsletterLoading"
                                                @click="subscribeNewsletter">
                                                S'inscrire
                                          </UButton>
                                    </div>

                                    <UAlert v-else color="success" variant="subtle" title="Merci !"
                                          description="Vous êtes inscrit à notre newsletter" />
                              </div>

                              <!-- Social Links -->
                              <div class="flex items-center gap-3">
                                    <UButton v-for="social in socialLinks" :key="social.label" :icon="social.icon"
                                          color="neutral" variant="ghost" size="sm" :to="social.url" target="_blank"
                                          :title="social.label" />
                              </div>
                        </div>

                        <!-- Shop Links -->
                        <div class="space-y-4">
                              <h4 class="text-sm font-bold uppercase tracking-wider">
                                    Shop
                              </h4>
                              <ul class="space-y-2.5">
                                    <li v-for="link in shopLinks" :key="link.label">
                                          <NuxtLink :to="link.to"
                                                class="text-sm text-primary-100 dark:text-primary-300 hover:text-white transition-colors inline-block">
                                                {{ link.label }}
                                          </NuxtLink>
                                    </li>
                              </ul>
                        </div>

                        <!-- Help Links -->
                        <div class="space-y-4">
                              <h4 class="text-sm font-bold uppercase tracking-wider">
                                    Aide
                              </h4>
                              <ul class="space-y-2.5">
                                    <li v-for="link in helpLinks" :key="link.label">
                                          <NuxtLink :to="link.to"
                                                class="text-sm text-primary-100 dark:text-primary-300 hover:text-white transition-colors inline-block">
                                                {{ link.label }}
                                          </NuxtLink>
                                    </li>
                              </ul>
                        </div>

                        <!-- Company Links -->
                        <div class="space-y-4">
                              <h4 class="text-sm font-bold uppercase tracking-wider">
                                    Bylin
                              </h4>
                              <ul class="space-y-2.5">
                                    <li v-for="link in companyLinks" :key="link.label">
                                          <NuxtLink :to="link.to"
                                                class="text-sm text-primary-100 dark:text-primary-300 hover:text-white transition-colors inline-block">
                                                {{ link.label }}
                                          </NuxtLink>
                                    </li>
                              </ul>
                        </div>
                  </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-primary-600 dark:border-primary-800">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div class="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">

                              <!-- Copyright -->
                              <p class="text-xs text-primary-100 dark:text-primary-300 text-center lg:text-left">
                                    © {{ currentYear }} Bylin. Tous droits réservés.
                              </p>

                              <!-- Legal Links -->
                              <div class="flex flex-wrap justify-center gap-4 text-xs">
                                    <NuxtLink v-for="link in legalLinks" :key="link.label" :to="link.to"
                                          class="text-primary-100 dark:text-primary-300 hover:text-white transition-colors">
                                          {{ link.label }}
                                    </NuxtLink>
                              </div>

                              <!-- Payment Methods -->
                              <div class="flex items-center gap-2">
                                    <span class="text-xs text-primary-100 dark:text-primary-300">
                                          Paiement sécurisé :
                                    </span>
                                    <div class="flex gap-1.5">
                                          <UBadge v-for="method in paymentMethods" :key="method" :label="method"
                                                color="neutral" variant="subtle" size="xs" />
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
            <!-- Creator Credit -->
            <div class="border-t border-primary-600 dark:border-primary-800 bg-primary-600 dark:bg-primary-950">
                  <div class="max-w-7xl mx-auto px-4 py-3">
                        <p class="text-xs text-center text-primary-100 dark:text-primary-300">
                              Conçu et développé avec
                              <span class="text-red-400 animate-pulse">❤️</span>
                              par
                              <NuxtLink to="https://chrislain-portfolio.vercel.app" target="_blank"
                                    class="font-semibold text-white hover:text-primary-200 transition-colors underline decoration-dotted underline-offset-2">
                                    Chrislain AVOCEGAN
                              </NuxtLink>
                        </p>
                  </div>
            </div>

      </footer>
</template>