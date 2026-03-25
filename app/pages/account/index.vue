<!-- pages/account/index.vue -->
<script setup lang="ts">
definePageMeta({
      middleware: 'sanctum:auth' // ✅ Redirige vers /auth/login si non connecté
})
</script>

<template>
      <div>
            <h1>Mon compte</h1>
            <!-- Dashboard -->
      </div>
</template>