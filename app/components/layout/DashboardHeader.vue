<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const items = computed(() => [
    [{
        label: authStore.user?.email || 'utilisateur@example.com',
        slot: 'account',
        disabled: true
    }],
    [{
        label: 'Mon profil',
        icon: 'i-heroicons-user',
        to: '/dashboard/profile'
    }, {
        label: 'Mes commandes',
        icon: 'i-heroicons-shopping-bag',
        to: '/dashboard/orders'
    }],
    [{
        label: 'Déconnexion',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        onSelect: () => authStore.logout()
    }]
])

// Avatar de l'utilisateur
const userAvatar = computed(() => {
    if (authStore.user?.avatar_url) {
        return authStore.user.avatar_url
    }
    return undefined
})

// Nom de l'utilisateur pour l'affichage
const userName = computed(() => {
    if (authStore.user?.first_name) {
        return authStore.user.first_name
    }
    return 'Client'
})

onMounted(() => {
    console.log(authStore.user)
})
</script>

<template>
    <header class="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo & Title -->
                <div class="flex items-center gap-4">
                    <NuxtLink to="/" class="text-2xl font-display font-bold text-brand-500 hidden md:block">
                        bylin<span class="text-neutral-900">.</span>
                    </NuxtLink>
                    <div class="h-6 w-px bg-neutral-200 hidden md:block"></div>
                    <h1 class="text-lg font-semibold text-neutral-900">Espace Client</h1>
                </div>

                <!-- Right Actions -->
                <div class="flex items-center gap-4">
                    <UButton variant="ghost" color="neutral" icon="i-heroicons-bell" aria-label="Notifications" />

                    <UDropdownMenu :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                        :popper="{ placement: 'bottom-end' }">
                        <UAvatar :src="userAvatar" :alt="userName" size="sm" />

                        <template #account="{ item }">
                            <div class="text-left">
                                <p>Connecté en tant que</p>
                                <p class="truncate font-medium text-neutral-900">
                                    {{ item.label }}
                                </p>
                            </div>
                        </template>

                        <template #item="{ item }">
                            <span class="truncate">{{ item.label }}</span>
                            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-neutral-400 ms-auto" />
                        </template>
                    </UDropdownMenu>
                </div>
            </div>
        </div>
    </header>
</template>
