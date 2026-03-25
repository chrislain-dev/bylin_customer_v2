<template>
      <div
            class="hidden lg:block bg-primary-50 dark:bg-primary-950 border-b border-primary-100 dark:border-primary-900">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="flex justify-between items-center py-2 text-xs">
                        <div class="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                              <UIcon name="i-heroicons-truck" class="w-4 h-4" />
                              <span class="font-medium">Livraison offerte à Cotonou dès 100 000 CFA</span>
                        </div>

                        <div class="flex items-center gap-6 text-primary-600 dark:text-primary-400">
                              <span class="font-medium">FR / Bénin</span>
                              <NuxtLink to="/about"
                                    class="hover:text-primary-900 dark:hover:text-primary-100 transition-colors">
                                    À propos
                              </NuxtLink>
                              <NuxtLink to="/contact"
                                    class="hover:text-primary-900 dark:hover:text-primary-100 transition-colors">
                                    Service client
                              </NuxtLink>
                        </div>
                  </div>
            </div>
      </div>
</template>