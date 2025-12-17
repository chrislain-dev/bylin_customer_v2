<script setup lang="ts">
</script>

<template>
    <footer class="bg-white border-t border-gray-100 py-8">
        <UContainer>
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm text-gray-500">
                    &copy; {{ new Date().getFullYear() }} Bylin. Tous droits réservés.
                </p>
                <div class="flex gap-6">
                    <NuxtLink to="/legal/privacy" class="text-sm text-gray-500 hover:text-brand-600">
                        Confidentialité
                    </NuxtLink>
                    <NuxtLink to="/legal/terms" class="text-sm text-gray-500 hover:text-brand-600">
                        CGV
                    </NuxtLink>
                </div>
            </div>
        </UContainer>
    </footer>
</template>
