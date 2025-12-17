<script setup lang="ts">
const links = [
    {
        label: 'Vue d\'ensemble',
        icon: 'i-heroicons-home',
        to: '/dashboard'
    },
    {
        label: 'Mes commandes',
        icon: 'i-heroicons-shopping-bag',
        to: '/dashboard/orders'
    },
    {
        label: 'Mes favoris',
        icon: 'i-heroicons-heart',
        to: '/dashboard/wishlist'
    },
    {
        label: 'Adresses',
        icon: 'i-heroicons-map-pin',
        to: '/dashboard/addresses'
    },
    {
        label: 'Mon profil',
        icon: 'i-heroicons-user',
        to: '/dashboard/profile'
    }
]
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-50 font-sans">
        <LayoutDashboardHeader />

        <div class="flex-grow flex flex-col md:flex-row w-full mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
            <!-- Sidebar Navigation -->
            <aside class="w-full md:w-64 flex-shrink-0">
                <nav class="sticky top-24 space-y-1">
                    <UNavigationMenu orientation="vertical" :items="links" />
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-grow min-w-0">
                <div class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/50 p-6 min-h-[500px]">
                    <slot />
                </div>
            </main>
        </div>

        <LayoutDashboardFooter />
    </div>
</template>
