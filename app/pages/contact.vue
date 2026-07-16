<script setup lang="ts">
const form = reactive({ name: '', email: '', phone: '', subject: '', message: '' })
const sent = ref(false)

const submit = () => {
  sent.value = true
}

useHead({
  title: 'Contact — Bylin',
  meta: [{ name: 'description', content: 'Contactez Bylin pour une commande, un conseil taille, une collaboration ou le support client.' }]
})
</script>

<template>
  <div class="bg-white text-gray-950">
    <section class="bg-gray-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-primary-200">Contact</p>
        <h1 class="mt-4 text-5xl font-black tracking-tight">Parlons de votre besoin.</h1>
        <p class="mt-5 max-w-2xl text-lg text-gray-300">Commande, disponibilité, livraison, collaboration ou demande spéciale : l’équipe Bylin vous répond rapidement.</p>
      </div>
    </section>

    <section class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
      <div class="space-y-6">
        <div class="rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <Icon name="heroicons:map-pin" class="h-8 w-8 text-primary-600" />
          <h2 class="mt-4 text-xl font-bold">Adresse</h2>
          <p class="mt-2 text-gray-600">Cotonou, Bénin</p>
        </div>
        <div class="rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <Icon name="heroicons:phone" class="h-8 w-8 text-primary-600" />
          <h2 class="mt-4 text-xl font-bold">Support client</h2>
          <p class="mt-2 text-gray-600">WhatsApp / Téléphone : à renseigner dans les paramètres de la marque.</p>
        </div>
        <div class="rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <Icon name="heroicons:clock" class="h-8 w-8 text-primary-600" />
          <h2 class="mt-4 text-xl font-bold">Horaires</h2>
          <p class="mt-2 text-gray-600">Lundi — Samedi, 9h à 19h.</p>
        </div>
      </div>

      <form class="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8" @submit.prevent="submit">
        <div v-if="sent" class="mb-6 rounded-2xl bg-green-50 p-4 text-green-700">Votre message est prêt à être envoyé. Il reste à brancher l’endpoint API de contact si tu veux l’envoi réel.</div>
        <div class="grid gap-5 sm:grid-cols-2">
          <UFormField label="Nom complet" required><UInput v-model="form.name" size="xl" placeholder="Votre nom" /></UFormField>
          <UFormField label="Email" required><UInput v-model="form.email" size="xl" type="email" placeholder="vous@email.com" /></UFormField>
          <UFormField label="Téléphone"><UInput v-model="form.phone" size="xl" placeholder="+229 ..." /></UFormField>
          <UFormField label="Sujet" required><UInput v-model="form.subject" size="xl" placeholder="Commande, livraison..." /></UFormField>
          <UFormField label="Message" required class="sm:col-span-2"><UTextarea v-model="form.message" :rows="7" size="xl" placeholder="Expliquez votre demande..." /></UFormField>
        </div>
        <UButton type="submit" size="xl" color="primary" class="mt-6 w-full justify-center sm:w-auto">Envoyer le message</UButton>
      </form>
    </section>
  </div>
</template>
