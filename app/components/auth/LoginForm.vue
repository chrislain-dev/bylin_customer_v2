<script setup lang="ts">
const emit = defineEmits<{
      success: []
      error: [error: Error]
}>()

const authStore = useAuthStore()

const form = reactive({
      email: '',
      password: '',
      remember: false
})

const loading = ref(false)
const showPassword = ref(false)

async function handleSubmit() {
      loading.value = true
      try {
            await authStore.login(form)
            emit('success')
      } catch (error: any) {
            emit('error', error)
      } finally {
            loading.value = false
      }
}
</script>

<template>
      <form class="space-y-5" @submit.prevent="handleSubmit">
            <UFormField label="Adresse email" name="email" required>
                  <UInput v-model="form.email" type="email" placeholder="vous@exemple.com" icon="i-heroicons-envelope"
                        size="lg" :ui="{
                              base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40'
                        }" class="w-full" required />
            </UFormField>

            <UFormField label="Mot de passe" name="password" required>
                  <div class="relative">
                        <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'"
                              placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" :ui="{
                                    base: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/40 pr-12'
                              }" class="w-full" required />
                        <button type="button" @click="showPassword = !showPassword"
                              class="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                              <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                    class="w-5 h-5" />
                        </button>
                  </div>
            </UFormField>

            <div class="flex items-center justify-between">
                  <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="form.remember" type="checkbox"
                              class="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-white/50" />
                        <span class="text-sm text-white/80 group-hover:text-white transition-colors">
                              Se souvenir de moi
                        </span>
                  </label>

                  <NuxtLink to="/auth/forgot-password"
                        class="text-sm font-medium text-white/80 hover:text-white transition-colors underline underline-offset-4">
                        Mot de passe oublié ?
                  </NuxtLink>
            </div>

            <UButton type="submit" color="neutral" block size="lg" :loading="loading" class="cursor-pointer">
                  Se connecter
            </UButton>
      </form>
</template>