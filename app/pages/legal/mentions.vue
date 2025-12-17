<script setup lang="ts">
definePageMeta({
  layout: 'legal'
})

useSeoMeta({
  title: 'Mentions Légales',
  description: 'Mentions légales de Bylin Style'
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="max-w-4xl mx-auto prose dark:prose-invert">
        <h1>Mentions Légales</h1>

        <section>
          <h2>Éditeur du site</h2>
          <p>
            Raison sociale : Bylin Style<br>
            Forme juridique : SAS<br>
            Capital social : 10 000 €<br>
            Siège social : 123 Rue de la Mode, 75001 Paris, France<br>
            RCS : Paris B 123 456 789<br>
            SIRET : 123 456 789 00010<br>
            TVA intracommunautaire : FR12345678900
          </p>
        </section>

        <section>
          <h2>Directeur de publication</h2>
          <p>Nom du directeur : John Doe</p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par :<br>
            Nom de l'hébergeur<br>
            Adresse<br>
            Téléphone
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Email : contact@bylin.com<br>
            Téléphone : +33 1 23 45 67 89
          </p>
        </section>
      </div>
    </UContainer>
  </div>
</template>
