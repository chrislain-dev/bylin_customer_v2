<script setup lang="ts">
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-50 font-sans">
        <LayoutSimpleHeader />

        <main class="flex-grow py-12">
            <UContainer>
                <div class="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm ring-1 ring-gray-200/50">
                    <slot />
                </div>
            </UContainer>
        </main>

        <LayoutSimpleFooter />
    </div>
</template>
