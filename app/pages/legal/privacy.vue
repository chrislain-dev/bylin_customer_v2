<script setup lang="ts">
definePageMeta({
  layout: 'legal'
})

useSeoMeta({
  title: 'Politique de Confidentialité',
  description: 'Notre politique de protection des données personnelles'
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="max-w-4xl mx-auto prose dark:prose-invert">
        <h1>Politique de Confidentialité</h1>

        <section>
          <h2>Collecte des données personnelles</h2>
          <p>
            Nous collectons vos données personnelles lorsque vous créez un compte, passez une commande ou nous contactez.
          </p>
        </section>

        <section>
          <h2>Utilisation des données</h2>
          <p>
            Vos données sont utilisées pour :
          </p>
          <ul>
            <li>Traiter vos commandes</li>
            <li>Gérer votre compte client</li>
            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
            <li>Améliorer nos services</li>
          </ul>
        </section>

        <section>
          <h2>Protection des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.
          </p>
        </section>

        <section>
          <h2>Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Pour toute question concernant vos données personnelles, contactez-nous à : privacy@bylin.com
          </p>
        </section>
      </div>
    </UContainer>
  </div>
</template>
