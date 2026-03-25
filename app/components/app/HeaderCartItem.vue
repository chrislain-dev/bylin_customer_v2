<script setup lang="ts">
import type { CartItem } from '~/types/cart'

const props = defineProps<{
      item: CartItem
}>()

const cartStore = useCartStore()

const imageUrl = computed(() => props.item.product?.media?.[0]?.original_url)
const hasImage = computed(() => !!imageUrl.value)
</script>

<template>
      <div class="flex gap-4 py-3">
            <!-- Image avec placeholder -->
            <div class="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                        v-if="hasImage" 
                        :src="imageUrl" 
                        :alt="item.product.name"
                        class="w-full h-full object-cover"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center">
                        <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-400" />
                  </div>
            </div>

            <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium truncate">
                        {{ item.product.name }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-0.5">
                        {{ formatPrice(item.unit_price) }}
                  </p>

                  <div class="flex items-center gap-3 mt-3">
                        <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                              <UButton 
                                    icon="i-heroicons-minus"
                                    size="xs"
                                    color="neutral"
                                    variant="ghost"
                                    square
                                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                                    :disabled="item.quantity <= 1"
                                    class="rounded-none"
                              />
                              <span class="px-3 py-1.5 text-sm font-medium min-w-[40px] text-center bg-gray-50 dark:bg-gray-800">
                                    {{ item.quantity }}
                              </span>
                              <UButton 
                                    icon="i-heroicons-plus"
                                    size="xs"
                                    color="neutral"
                                    variant="ghost"
                                    square
                                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                                    class="rounded-none"
                              />
                        </div>

                        <UButton 
                              icon="i-heroicons-trash" 
                              color="error" 
                              variant="ghost" 
                              size="xs"
                              square
                              @click="cartStore.removeItem(item.id)" 
                        />
                  </div>
            </div>

            <div class="text-sm font-semibold flex-shrink-0">
                  {{ formatPrice(item.subtotal) }}
            </div>
      </div>
</template>