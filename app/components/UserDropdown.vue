<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

// Menu utilisateur connecté
const userMenuItems = computed(() => {
    if (!authStore.isAuthenticated) {
        return [[
            {
                label: 'Se connecter',
                icon: 'i-lucide-log-in',
                click: () => router.push('/login')
            },
            {
                label: "S'inscrire",
                icon: 'i-lucide-user-plus',
                click: () => router.push('/register')
            }
        ]]
    }

    return [
        [{
            label: authStore.user?.first_name || 'Mon compte',
            slot: 'account',
            disabled: true,
            class: 'cursor-default'
        }],
        [{
            label: 'Mon profil',
            icon: 'i-lucide-user',
            to: '/account/profile'
        }, {
            label: 'Mes commandes',
            icon: 'i-lucide-package',
            to: '/account/orders',
            badge: authStore.pendingOrdersCount > 0 ? {
                label: authStore.pendingOrdersCount.toString(),
                color: 'primary' as const
            } : undefined
        }, {
            label: 'Mes adresses',
            icon: 'i-lucide-map-pin',
            to: '/account/addresses'
        }, {
            label: 'Mes paiements',
            icon: 'i-lucide-credit-card',
            to: '/account/payment-methods'
        }],
        [{
            label: 'Paramètres',
            icon: 'i-lucide-settings',
            to: '/account/settings'
        }, {
            label: 'Aide',
            icon: 'i-lucide-help-circle',
            to: '/help'
        }],
        [{
            label: 'Déconnexion',
            icon: 'i-lucide-log-out',
            click: async () => {
                await authStore.logout()
                router.push('/')
            }
        }]
    ]
})

// Avatar de l'utilisateur
const userAvatar = computed(() => {
    if (authStore.user?.avatar_url) {
        return authStore.user.avatar_url
    }
    return undefined
})

// Initiales de l'utilisateur
const userInitials = computed(() => {
    if (!authStore.user?.first_name) return 'U'
    const names = authStore.user.first_name.split(' ')
    if (names.length >= 2 && names !== undefined && names[0] !== undefined && names[1] !== undefined) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    if (names[0]) return names[0].substring(0, 2).toUpperCase()
})

// DEBUG: Watch pour vérifier si le composant détecte les changements
watch(() => authStore.isAuthenticated, (newVal) => {
    console.log('🔔 UserDropdown: isAuthenticated changed to:', newVal)
})

watch(() => authStore.user, (newVal) => {
    console.log('🔔 UserDropdown: user changed to:', newVal)
}, { deep: true })

onMounted(() => {
    console.log('🎨 UserDropdown mounted, isAuthenticated:', authStore.isAuthenticated)
})

</script>

<template>
    <UDropdownMenu :items="userMenuItems" :modal="false" :ui="{
        content: 'w-64',
        item: 'gap-3'
    }">
        <!-- Bouton Avatar -->
        <UButton v-if="authStore.isAuthenticated" color="neutral" variant="ghost" size="lg"
            class="text-white hover:bg-white/10 !p-1">
            <UAvatar :src="userAvatar" :alt="authStore.fullName" size="md" :ui="{ root: 'bg-brand-600' }">
                <template #fallback>
                    <span class="text-xs font-semibold">{{ userInitials }}</span>
                </template>
            </UAvatar>
        </UButton>

        <!-- Bouton Connexion (si non connecté) -->
        <UButton v-else icon="i-lucide-user" color="neutral" variant="ghost" size="lg"
            class="text-white hover:bg-white/10">
            <span class="hidden sm:inline">Connexion</span>
        </UButton>

        <!-- Slot pour l'en-tête du compte -->
        <template #account>
            <div class="flex items-center gap-3 p-2">
                <UAvatar :src="userAvatar" :alt="authStore.fullName" size="lg" :ui="{ root: 'bg-brand-600' }">
                    <template #fallback>
                        <span class="text-sm font-semibold">{{ userInitials }}</span>
                    </template>
                </UAvatar>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate">
                        {{ authStore.fullName }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ authStore.user?.email }}
                    </p>
                </div>
            </div>
        </template>

        <!-- Style personnalisé pour les items -->
        <template #item="{ item }">
            <div class="flex items-center gap-3 w-full">
                <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 flex-shrink-0" />
                <span class="flex-1">{{ item.label }}</span>
                <UBadge v-if="item.badge" :label="item.badge.label" :color="item.badge.color" size="xs" />
            </div>
        </template>

        <!-- Footer avec séparateur et options supplémentaires -->
        <template #footer>
            <div class="p-2 space-y-2 border-t border-gray-200 dark:border-gray-800">
                <!-- Mode couleur -->
                <div class="flex items-center justify-between px-2 py-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">Thème</span>
                    <UColorModeButton />
                </div>

                <!-- Sélecteur de devise -->
                <div class="px-2">
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Devise</div>
                    <CurrencySwitcher />
                </div>
            </div>
        </template>

    </UDropdownMenu>
</template>

<style scoped>
/* Animation pour le dropdown */
:deep(.dropdown-content) {
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>