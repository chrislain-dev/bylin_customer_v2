<script setup lang="ts">
import type { CurrencyCode } from '~/types/currency'

const currencyStore = useCurrencyStore()

// Liste des devises (Données inchangées)
const currencies = [
    { code: 'XOF', name: 'Franc CFA', symbol: 'CFA', flag: '🇧🇯' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'USD', name: 'Dollar US', symbol: '$', flag: '🇺🇸' },
    { code: 'GBP', name: 'Livre Sterling', symbol: '£', flag: '🇬🇧' }
]

// Devise actuelle
const currentCurrency = computed(() =>
    currencies.find(c => c.code === currencyStore.selectedCurrency) || currencies[0]
)

// Items formatés pour Nuxt UI avec un SLOT personnalisé
// On ajoute 'slot: "item"' pour dire à Nuxt UI qu'on veut contrôler le rendu
const currencyItems = computed(() => [
    currencies.map(currency => ({
        label: currency.name,
        // On passe l'objet complet pour l'utiliser dans le template
        currency: currency,
        // Active permet de gérer le style conditionnel
        active: currency.code === currencyStore.selectedCurrency,
        // On définit une fonction de clic
        click: () => currencyStore.changeCurrency(currency.code as CurrencyCode),
    }))
])
</script>

<template>
    <UDropdownMenu 
        :items="currencyItems"
        :modal="false"
        :ui="{
            content: 'w-48 p-1 ring-1 ring-gray-200 dark:ring-gray-800 shadow-xl',
            item: 'my-0.5 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white'
        }"
    >
        <UButton 
            v-if="currentCurrency"
            color="neutral" 
            variant="ghost" 
            class="font-medium text-gray-50 dark:text-gray-50 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
            <span>{{ currentCurrency.name }}</span>
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4 ml-1" />
        </UButton>

        <template #item="{ item }">
            <div class="flex items-start w-full gap-3">
                <div class="flex flex-col flex-1 min-w-0">
                    <span 
                        class="text-sm font-medium truncate"
                        :class="item.active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'"
                    >
                        {{ item.label }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ item.currency.code }} &middot; {{ item.currency.symbol }}
                    </span>
                </div>

                <!-- 3. Checkmark (seulement si actif) -->
                <UIcon 
                    v-if="item.active" 
                    name="i-lucide-check" 
                    class="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" 
                />
            </div>
        </template>
    </UDropdownMenu>
</template>