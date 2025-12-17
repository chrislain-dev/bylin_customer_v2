<script setup lang="ts">
</script>

<template>
    <footer class="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-xs text-gray-500">
                &copy; {{ new Date().getFullYear() }} Bylin Customer Portal
            </p>
            <div class="flex gap-4">
                <NuxtLink to="/help" class="text-xs text-gray-500 hover:text-brand-600 flex items-center gap-1">
                    <UIcon name="i-heroicons-question-mark-circle" />
                    Centre d'aide
                </NuxtLink>
            </div>
        </div>
    </footer>
</template>
