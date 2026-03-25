<script setup lang="ts">
definePageMeta({
      layout: 'default',
      sanctum: { excluded: true },
})

// ─── API ──────────────────────────────────────────────────────────────────────

const config = useRuntimeConfig()

const getApiUrl = (path: string) => {
      if (process.server) return `${config.apiSecretUrl}${path}`
      return path
}

const getImageUrl = (url: string | null): string | null => {
      if (!url) return null
      if (url.startsWith('http')) return url
      return `${config.public.apiBase}${url}`
}

const { data: homeContent, pending: homeLoading } = useAsyncData(
      'home-content',
      async () => {
            const response = await $fetch<{
                  success: boolean
                  data: {
                        latest_products: any[]
                        featured_categories: any[]
                        best_offer: any | null
                  }
            }>(getApiUrl('/api/v1/content/home'))
            return response.data
      },
      { server: true, lazy: false }
)

const latestProducts = computed(() => homeContent.value?.latest_products || [])
const featuredCategories = computed(() => homeContent.value?.featured_categories || [])
const bestOffer = computed(() => homeContent.value?.best_offer || null)

// ─── HERO SLIDER ──────────────────────────────────────────────────────────────

const heroSlides = [
      {
            id: 1,
            title: 'Collection Été 2025',
            subtitle: 'Nouvelle Arrivage',
            description: "Découvrez nos dernières créations inspirées de l'élégance africaine",
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop',
            cta: 'Découvrir',
            ctaLink: '/collections/ete-2025',
      },
      {
            id: 2,
            title: 'Tenues Traditionnelles',
            subtitle: 'Authenticité & Modernité',
            description: 'Un mariage parfait entre tradition et tendance contemporaine',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop',
            cta: 'Explorer',
            ctaLink: '/collections/traditionnelles',
      },
      {
            id: 3,
            title: "Jusqu'à -50%",
            subtitle: 'Offres Exceptionnelles',
            description: 'Profitez de nos réductions sur une sélection de produits',
            image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
            cta: 'Voir les offres',
            ctaLink: '/promotions',
      },
]

const currentSlide = ref(0)
const nextSlide = () => (currentSlide.value = (currentSlide.value + 1) % heroSlides.length)
const prevSlide = () =>
      (currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length)

let autoSlideInterval: ReturnType<typeof setInterval>
onMounted(() => {
      autoSlideInterval = setInterval(nextSlide, 5000)
})
onUnmounted(() => clearInterval(autoSlideInterval))

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────

const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })

const updateCountdown = () => {
      if (!bestOffer.value?.end_date) return
      const distance = new Date(bestOffer.value.end_date).getTime() - Date.now()
      if (distance <= 0) return
      countdown.value = {
            days: Math.floor(distance / 86400000),
            hours: Math.floor((distance % 86400000) / 3600000),
            minutes: Math.floor((distance % 3600000) / 60000),
            seconds: Math.floor((distance % 60000) / 1000),
      }
}

let countdownInterval: ReturnType<typeof setInterval>
onMounted(() => {
      updateCountdown()
      countdownInterval = setInterval(updateCountdown, 1000)
})
onUnmounted(() => clearInterval(countdownInterval))

// ─── CONTENU STATIQUE ─────────────────────────────────────────────────────────

const whyBylin = [
      {
            icon: 'i-heroicons-truck',
            title: 'Livraison Rapide',
            description: 'Livraison gratuite à Cotonou sous 24-48h pour toute commande supérieure à 25 000 FCFA',
      },
      {
            icon: 'i-heroicons-shield-check',
            title: 'Paiement Sécurisé',
            description: 'Transactions 100% sécurisées via Visa, Mastercard, MTN Money et Moov Money',
      },
      {
            icon: 'i-heroicons-arrow-path',
            title: 'Retours Faciles',
            description: 'Retours et échanges gratuits sous 14 jours si le produit ne vous convient pas',
      },
      {
            icon: 'i-heroicons-star',
            title: 'Qualité Premium',
            description: "Tissus africains authentiques et confection soignée par des artisans locaux",
      },
]

const reviews = [
      {
            id: 1,
            name: 'Aminata Diallo',
            avatar: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            date: '15 Déc 2024',
            comment: 'Qualité exceptionnelle ! Les tissus sont magnifiques et la coupe parfaite. Je recommande vivement Bylin.',
      },
      {
            id: 2,
            name: 'Jean-Baptiste Koffi',
            avatar: 'https://i.pravatar.cc/150?img=12',
            rating: 5,
            date: '10 Déc 2024',
            comment: "Service impeccable, livraison rapide à Cotonou. Les vêtements sont encore plus beaux en vrai !",
      },
      {
            id: 3,
            name: 'Fatima Touré',
            avatar: 'https://i.pravatar.cc/150?img=5',
            rating: 4,
            date: '5 Déc 2024',
            comment: 'Très satisfaite de mon achat. Le style est unique et authentique. Parfait pour les grandes occasions.',
      },
]

// ─── UTILS ────────────────────────────────────────────────────────────────────

const formatPrice = (price: number) =>
      new Intl.NumberFormat('fr-BJ', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
      }).format(price)
</script>

<template>
      <div>
            <!-- Loading splash -->
            <Transition name="splash">
                  <div v-if="homeLoading"
                        class="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex items-center justify-center">
                        <div class="text-center space-y-6">
                              <img src="/images/logo-white.png" alt="Bylin" class="h-20 w-auto mx-auto animate-pulse" />
                              <div class="flex gap-2 justify-center">
                                    <div v-for="i in 3" :key="i"
                                          class="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
                                          :style="`animation-delay: ${(i - 1) * 150}ms`" />
                              </div>
                              <p class="text-sm text-gray-500 tracking-wide">Chargement...</p>
                        </div>
                  </div>
            </Transition>

            <!-- ═══ HERO SLIDER ═══════════════════════════════════════════════════════ -->
            <section class="relative h-[600px] lg:h-[700px] overflow-hidden">
                  <TransitionGroup name="fade">
                        <div v-for="(slide, index) in heroSlides" v-show="currentSlide === index" :key="slide.id"
                              class="absolute inset-0">
                              <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
                              <div
                                    class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                              <div class="absolute inset-0 flex items-center">
                                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                          <div class="max-w-2xl space-y-6">
                                                <UBadge color="primary" variant="solid" size="lg"
                                                      class="uppercase tracking-wider">
                                                      {{ slide.subtitle }}
                                                </UBadge>
                                                <h1 class="text-5xl lg:text-7xl font-bold text-white leading-tight">
                                                      {{ slide.title }}
                                                </h1>
                                                <p class="text-xl text-gray-200 leading-relaxed">{{ slide.description }}
                                                </p>
                                                <UButton :to="slide.ctaLink" size="xl" color="primary"
                                                      class="font-semibold">
                                                      {{ slide.cta }}
                                                      <UIcon name="i-heroicons-arrow-right" class="ml-2" />
                                                </UButton>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </TransitionGroup>

                  <button
                        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
                        @click="prevSlide">
                        <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
                  </button>
                  <button
                        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
                        @click="nextSlide">
                        <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
                  </button>

                  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        <button v-for="(slide, index) in heroSlides" :key="slide.id" :class="[
                              'h-2 rounded-full transition-all',
                              currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50',
                        ]" @click="currentSlide = index" />
                  </div>
            </section>

            <!-- ═══ DERNIÈRE COLLECTION ═══════════════════════════════════════════════ -->
            <section class="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center space-y-4 mb-12">
                              <UBadge color="primary" variant="subtle" size="lg" class="uppercase tracking-wider">
                                    Nouveautés
                              </UBadge>
                              <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                                    Dernière Collection
                              </h2>
                              <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Découvrez nos dernières créations, un mélange parfait d'authenticité africaine et de
                                    modernité
                              </p>
                        </div>

                        <!-- Skeleton loader -->
                        <div v-if="homeLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div v-for="i in 4" :key="i"
                                    class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                                    <div class="aspect-[3/4] bg-gray-200 dark:bg-gray-700" />
                                    <div class="p-5 space-y-3">
                                          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                    </div>
                              </div>
                        </div>

                        <!-- Produits réels -->
                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              <NuxtLink v-for="product in latestProducts" :key="product.id"
                                    :to="`/products/${product.slug}`"
                                    class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    <div class="aspect-[3/4] overflow-hidden relative bg-gray-100 dark:bg-gray-700">
                                          <img v-if="getImageUrl(product.image_url)"
                                                :src="getImageUrl(product.image_url)!" :alt="product.name"
                                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                          <div v-else class="w-full h-full flex items-center justify-center">
                                                <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-300" />
                                          </div>

                                          <UBadge v-if="product.badge" color="primary" variant="solid"
                                                class="absolute top-4 left-4">
                                                {{ product.badge }}
                                          </UBadge>

                                          <div
                                                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <UButton icon="i-heroicons-eye" color="neutral" variant="solid"
                                                      size="lg" />
                                                <UButton icon="i-heroicons-heart" color="neutral" variant="solid"
                                                      size="lg" />
                                          </div>
                                    </div>

                                    <div class="p-5 space-y-3">
                                          <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                                                {{ product.name }}
                                          </h3>
                                          <div class="flex items-center justify-between gap-2">
                                                <div>
                                                      <p
                                                            class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                                            {{ formatPrice(product.price) }}
                                                      </p>
                                                      <p v-if="product.compare_price"
                                                            class="text-sm text-gray-400 line-through">
                                                            {{ formatPrice(product.compare_price) }}
                                                      </p>
                                                </div>
                                                <UButton icon="i-heroicons-shopping-cart" color="primary"
                                                      variant="soft" />
                                          </div>
                                    </div>
                              </NuxtLink>
                        </div>

                        <div class="text-center mt-12">
                              <UButton to="/collections" size="xl" color="primary" variant="outline">
                                    Voir toute la collection
                                    <UIcon name="i-heroicons-arrow-right" class="ml-2" />
                              </UButton>
                        </div>
                  </div>
            </section>

            <!-- ═══ CATÉGORIES ════════════════════════════════════════════════════════ -->
            <section class="py-16 lg:py-24">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center space-y-4 mb-12">
                              <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                                    Explorez par Catégorie
                              </h2>
                              <p class="text-lg text-gray-600 dark:text-gray-400">
                                    Trouvez exactement ce que vous cherchez
                              </p>
                        </div>

                        <!-- Skeleton -->
                        <div v-if="homeLoading" class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                              <div v-for="i in 4" :key="i"
                                    class="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                        </div>

                        <!-- Catégories réelles -->
                        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                              <NuxtLink v-for="category in featuredCategories" :key="category.id" :to="category.link"
                                    class="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <!-- Image ou placeholder coloré avec nom de catégorie -->
                                    <img v-if="getImageUrl(category.image_url)" :src="getImageUrl(category.image_url)!"
                                          :alt="category.name"
                                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div v-else
                                          class="w-full h-full bg-linear-to-br from-primary-400 to-primary-700 flex items-center justify-center">
                                          <span class="text-5xl font-black text-white/30 uppercase tracking-widest">
                                                {{ category.name.charAt(0) }}
                                          </span>
                                    </div>

                                    <div
                                          class="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                                    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                                          <h3 class="text-2xl font-bold mb-1">{{ category.name }}</h3>
                                          <p class="text-sm text-gray-200">{{ category.products_count }} produits</p>
                                    </div>

                                    <div
                                          class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <UIcon name="i-heroicons-arrow-right" class="w-6 h-6 text-white" />
                                    </div>
                              </NuxtLink>
                        </div>
                  </div>
            </section>

            <!-- ═══ MEILLEURE OFFRE (masquée si null) ═════════════════════════════════ -->
            <section v-if="!homeLoading && bestOffer"
                  class="py-16 lg:py-24 bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="grid lg:grid-cols-2 gap-12 items-center">
                              <div class="relative">
                                    <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                                          <img v-if="getImageUrl(bestOffer.image_url)"
                                                :src="getImageUrl(bestOffer.image_url)!" :alt="bestOffer.name"
                                                class="w-full h-auto" />
                                          <div v-else class="aspect-3/4 bg-primary-200 dark:bg-primary-800" />
                                          <UBadge color="error" variant="solid" size="lg"
                                                class="absolute top-6 right-6 text-xl px-4 py-2">
                                                -{{ bestOffer.discount_percentage }}%
                                          </UBadge>
                                    </div>
                              </div>

                              <div class="space-y-8">
                                    <div>
                                          <UBadge color="error" variant="subtle" size="lg"
                                                class="mb-4 uppercase tracking-wider">
                                                🔥 Offre Exceptionnelle
                                          </UBadge>
                                          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                                {{ bestOffer.name }}
                                          </h2>
                                          <p class="text-lg text-gray-600 dark:text-gray-300">{{ bestOffer.description
                                                }}</p>
                                    </div>

                                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                          <p
                                                class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wider">
                                                ⏱️ L'offre se termine dans :
                                          </p>
                                          <div class="grid grid-cols-4 gap-4 text-center">
                                                <div v-for="(val, unit) in countdown" :key="unit">
                                                      <div
                                                            class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                                            {{ val }}
                                                      </div>
                                                      <div class="text-xs text-gray-500 uppercase">
                                                            {{
                                                                  unit === 'days'
                                                                        ? 'Jours'
                                                                        : unit === 'hours'
                                                                              ? 'Heures'
                                                            : unit === 'minutes'
                                                            ? 'Min'
                                                            : 'Sec'
                                                            }}
                                                      </div>
                                                </div>
                                          </div>
                                    </div>

                                    <div class="flex items-end gap-4">
                                          <div class="text-5xl font-bold text-primary-600 dark:text-primary-400">
                                                {{ formatPrice(bestOffer.discount_price) }}
                                          </div>
                                          <div class="text-2xl text-gray-400 line-through mb-2">
                                                {{ formatPrice(bestOffer.original_price) }}
                                          </div>
                                    </div>

                                    <ul class="space-y-3">
                                          <li v-for="feature in bestOffer.features" :key="feature"
                                                class="flex items-center gap-3">
                                                <UIcon name="i-heroicons-check-circle"
                                                      class="w-6 h-6 text-green-500 shrink-0" />
                                                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                                          </li>
                                    </ul>

                                    <div class="flex gap-4">
                                          <UButton :to="`/products/${bestOffer.slug}`" size="xl" color="primary"
                                                class="flex-1 font-semibold">
                                                <UIcon name="i-heroicons-shopping-cart" class="mr-2" />
                                                Voir le produit
                                          </UButton>
                                          <UButton size="xl" color="neutral" variant="outline">
                                                <UIcon name="i-heroicons-heart" />
                                          </UButton>
                                    </div>
                              </div>
                        </div>
                  </div>
            </section>

            <!-- ═══ AVIS CLIENTS ══════════════════════════════════════════════════════ -->
            <section class="py-16 lg:py-24">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center space-y-4 mb-12">
                              <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                                    Ce que disent nos clients
                              </h2>
                              <div class="flex items-center justify-center gap-2">
                                    <div class="flex">
                                          <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                                                class="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <span class="text-lg text-gray-600 dark:text-gray-400">4.9/5 sur 1 247 avis</span>
                              </div>
                        </div>

                        <div class="grid md:grid-cols-3 gap-8">
                              <div v-for="review in reviews" :key="review.id"
                                    class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                    <div class="flex items-center gap-4 mb-6">
                                          <img :src="review.avatar" :alt="review.name" class="w-14 h-14 rounded-full" />
                                          <div>
                                                <h4 class="font-semibold text-gray-900 dark:text-white">{{ review.name
                                                      }}</h4>
                                                <p class="text-sm text-gray-500">{{ review.date }}</p>
                                          </div>
                                    </div>
                                    <div class="flex gap-1 mb-4">
                                          <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" :class="[
                                                'w-5 h-5',
                                                i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600',
                                          ]" />
                                    </div>
                                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">"{{ review.comment }}"
                                    </p>
                              </div>
                        </div>
                  </div>
            </section>

            <!-- ═══ POURQUOI BYLIN ════════════════════════════════════════════════════ -->
            <section class="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center mb-12">
                              <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                                    Pourquoi Choisir Bylin ?
                              </h2>
                        </div>
                        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                              <div v-for="item in whyBylin" :key="item.title"
                                    class="text-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-xl transition-shadow">
                                    <div
                                          class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full">
                                          <UIcon :name="item.icon"
                                                class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ item.title }}</h3>
                                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ item.description }}
                                    </p>
                              </div>
                        </div>
                  </div>
            </section>
      </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
      transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
      opacity: 0;
}

.splash-leave-active {
      transition: opacity 0.4s ease;
}

.splash-leave-to {
      opacity: 0;
}
</style>