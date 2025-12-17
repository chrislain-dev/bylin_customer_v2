<script setup lang="ts">
</script>

<template>
    <header class="bg-white border-b border-neutral-100">
        <UContainer>
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <div class="flex-shrink-0">
                    <NuxtLink to="/" class="text-2xl font-display font-bold text-brand-500">
                        bylin<span class="text-neutral-900">.</span>
                    </NuxtLink>
                </div>

                <!-- Back Link -->
                <UButton to="/" variant="ghost" color="neutral" icon="i-heroicons-arrow-left"
                    label="Retour à l'accueil" />
            </div>
        </UContainer>
    </header>
</template>
