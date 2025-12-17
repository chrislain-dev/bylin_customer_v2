<template>
   <div class="w-full h-full flex flex-col justify-between font-syne relative">

      <!-- 1. HEADER MINIMALISTE -->
      <div class="flex justify-between items-start opacity-0 animate-in-fade"
         style="animation-delay: 0.2s; animation-fill-mode: forwards;">
         <div>
            <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ffffff]">Étape 0{{ currentStep }} /
               03</span>
            <!-- TAILLE RÉDUITE: text-xl -> text-lg -->
            <h2 class="text-lg font-bold text-white mt-1">Inscription</h2>
         </div>
         <NuxtLink to="/auth/login"
            class="font-mono text-[10px] text-white/50 hover:text-white transition-colors uppercase">
            Connexion ->
         </NuxtLink>
      </div>

      <!-- 2. CORE EXPERIENCE (CENTER STAGE) -->
      <div class="flex-1 flex flex-col justify-center relative perspective-1000">

         <!-- FORMULAIRE STEP BY STEP -->
         <form @submit.prevent="handleNext" class="w-full relative">

            <!-- STEP 1: IDENTITÉ -->
            <div v-if="currentStep === 1" class="step-container space-y-8">
               <div class="space-y-2">
                  <label class="block font-mono text-[10px] text-[#ffffff] uppercase tracking-widest mb-2">01.
                     Identité</label>
                  <!-- TAILLE RÉDUITE: text-4xl -> text-2xl md:text-3xl -->
                  <h3 class="text-2xl md:text-3xl font-black text-white leading-tight">
                     Comment devons-nous <br>vous appeler ?
                  </h3>
               </div>

               <div class="space-y-5">
                  <div class="group">
                     <label class="block text-[10px] font-bold text-white tracking-wider mb-2 ml-1 uppercase">Prénom</label>
                     <div
                        class="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <UIcon name="i-heroicons-user" class="w-4 h-4 text-[#0066bf]" />
                        </div>
                        <input v-model="state.first_name" type="text" placeholder="Jean" name="firstname"
                           class="block w-full pl-10 pr-4 py-3 bg-white border-none rounded text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:ring-2 focus:ring-[#0066bf] focus:outline-none transition-all"
                           autofocus />
                     </div>
                     <p v-if="errors.first_name" class="mt-1 text-[10px] text-red-400 ml-1">{{ errors.first_name }}</p>
                  </div>

                  <div class="group">
                     <label class="block text-[10px] font-bold text-white tracking-wider mb-2 ml-1 uppercase">Nom</label>
                     <div
                        class="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <UIcon name="i-heroicons-user" class="w-4 h-4 text-[#0066bf]" />
                        </div>
                        <input v-model="state.last_name" type="text" placeholder="MOROU" name="lastname"
                           class="block w-full pl-10 pr-4 py-3 bg-white border-none rounded text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:ring-2 focus:ring-[#0066bf] focus:outline-none transition-all" />
                     </div>
                     <p v-if="errors.last_name" class="mt-1 text-[10px] text-red-400 ml-1">{{ errors.last_name }}</p>
                  </div>
               </div>
            </div>

            <!-- STEP 2: DIGITAL -->
            <div v-if="currentStep === 2" class="step-container space-y-8">
               <div class="space-y-2">
                  <label class="block font-mono text-[10px] text-[#0066bf] uppercase tracking-widest mb-2">02.
                     Contact</label>
                  <!-- TAILLE RÉDUITE -->
                  <h3 class="text-2xl md:text-3xl font-black text-white leading-tight">
                     Où envoyer <br>vos accès privés ?
                  </h3>
               </div>

               <div class="space-y-5">
                  <div class="group">
                     <label class="block text-[10px] font-bold text-white tracking-wider mb-2 ml-1 uppercase">Adresse email</label>
                     <div
                        class="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-[#0066bf]" />
                        </div>
                        <input v-model="state.email" type="email" placeholder="jean.dupont@example.com" name="email"
                           class="block w-full pl-10 pr-4 py-3 bg-white border-none rounded text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:ring-2 focus:ring-[#0066bf] focus:outline-none transition-all" />
                     </div>
                     <p v-if="errors.email"
                        class="mt-2 text-[10px] text-white bg-red-500 py-1 px-2 rounded inline-block shadow-sm">
                        {{ errors.email }}
                     </p>
                  </div>
               </div>
            </div>

            <!-- STEP 3: SÉCURITÉ -->
            <div v-if="currentStep === 3" class="step-container space-y-8">
               <div class="space-y-2">
                  <label class="block font-mono text-[10px] text-[#0066bf] uppercase tracking-widest mb-2">03.
                     Sécurité</label>
                  <!-- TAILLE RÉDUITE -->
                  <h3 class="text-2xl md:text-3xl font-black text-white leading-tight">
                     Définissez votre <br>code d'accès.
                  </h3>
               </div>

               <div class="space-y-4"> <!-- Espace réduit entre les champs -->
                  
                  <!-- PASSWORD -->
                  <div class="relative group">
                     <label class="block text-[10px] font-bold text-white tracking-wider mb-2 ml-1 uppercase">Mot de passe</label>
                     <div
                        class="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-[#0066bf]" />
                        </div>
                        <input v-model="state.password" :type="showPassword ? 'text' : 'password'"
                           placeholder="••••••••"
                           class="block w-full pl-10 pr-10 py-3 bg-white border-none rounded text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:ring-2 focus:ring-[#0066bf] focus:outline-none transition-all" />
                        <button type="button" @click="showPassword = !showPassword"
                           class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#0066bf] transition-colors">
                           <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                        </button>
                     </div>
                     <p v-if="errors.password"
                        class="mt-1 text-[10px] text-white bg-red-500 py-0.5 px-2 rounded inline-block shadow-sm">
                        {{ errors.password }}
                     </p>
                  </div>

                  <!-- CONFIRM PASSWORD (NOUVEAU) -->
                  <div class="relative group">
                     <label class="block text-[10px] font-bold text-white tracking-wider mb-2 ml-1 uppercase">Confirmer mot de passe</label>
                     <div
                        class="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-[#0066bf]" />
                        </div>
                        <input v-model="state.password_confirmation" :type="showConfirmPassword ? 'text' : 'password'"
                           placeholder="••••••••"
                           class="block w-full pl-10 pr-10 py-3 bg-white border-none rounded text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:ring-2 focus:ring-[#0066bf] focus:outline-none transition-all" />
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                           class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#0066bf] transition-colors">
                           <UIcon :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                        </button>
                     </div>
                     <p v-if="errors.password_confirmation"
                        class="mt-1 text-[10px] text-white bg-red-500 py-0.5 px-2 rounded inline-block shadow-sm">
                        {{ errors.password_confirmation }}
                     </p>
                  </div>

                  <!-- TERMS -->
                  <div class="flex items-start gap-3 mt-6">
                     <div @click="state.terms = !state.terms"
                        class="w-4 h-4 border border-white/30 cursor-pointer flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 rounded-sm"
                        :class="state.terms ? 'bg-[#0066bf] border-[#ffffff]' : 'hover:border-primary-600'">
                        <UIcon v-if="state.terms" name="i-heroicons-check" class="text-white w-3 h-3" />
                     </div>
                     <p class="text-[10px] text-white/90 font-mono leading-relaxed">
                        J'accepte d'entrer dans le cercle Bylin et confirme avoir lu les <a href="#"
                           class="underline hover:text-white">Conditions Générales</a>.
                     </p>
                  </div>
                  <p v-if="errors.terms"
                     class="mt-1 text-[10px] text-white bg-red-500 py-0.5 px-2 rounded inline-block shadow-sm">
                     {{ errors.terms }}
                  </p>
               </div>
            </div>

         </form>

      </div>

      <!-- 3. FOOTER NAVIGATION -->
      <div class="flex items-center justify-between mt-8 opacity-0 animate-in-fade"
         style="animation-delay: 0.4s; animation-fill-mode: forwards;">

         <!-- Back Button -->
         <button v-if="currentStep > 1" @click="prevStep"
            class="group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <UIcon name="i-heroicons-arrow-left" class="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span class="font-mono text-[10px] uppercase">Retour</span>
         </button>
         <div v-else></div>

         <!-- Next / Submit Button -->
         <button @click="handleNext" :disabled="isLoading"
            class="relative overflow-hidden bg-white text-black px-6 py-3 cursor-pointer rounded-sm uppercase tracking-wider hover:bg-primary-700 hover:text-white transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="relative z-10 flex items-center gap-2 text-xs font-bold">
               {{ currentStep === 3 ? 'Finaliser' : 'Continuer' }}
               <UIcon v-if="isLoading" name="i-heroicons-arrow-path" class="w-3 h-3 animate-spin" />
               <UIcon v-else name="i-heroicons-arrow-right"
                  class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
         </button>

      </div>

      <!-- PROGRESS LINE -->
      <div class="absolute bottom-0 left-0 w-full h-[1px] bg-white/10">
         <div class="h-full bg-[#ffffff] transition-all duration-700 ease-out"
            :style="{ width: (currentStep / 3) * 100 + '%' }"></div>
      </div>

   </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import gsap from 'gsap'
import * as z from 'zod'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
   layout: 'auth',
   middleware: 'sanctum:guest'
})

// --- STATE ---
const currentStep = ref(1)
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = reactive<Record<string, string>>({})

const state = reactive({
   first_name: '',
   last_name: '',
   email: '',
   password: '',
   password_confirmation: '',
   terms: false
})

// --- VALIDATION SCHEMAS (ZOD) ---
const schemas = {
   1: z.object({
      first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
      last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères')
   }),
   2: z.object({
      email: z.email('Veuillez entrer une adresse email valide'),
   }),
   3: z.object({
      password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
      password_confirmation: z.string(),
      terms: z.boolean().refine(val => val === true, {
         message: 'Vous devez accepter les conditions.'
      })
   }).refine((data) => data.password === data.password_confirmation, {
      message: "Les mots de passe ne correspondent pas",
      path: ["password_confirmation"],
   })
}

// --- ANIMATION UTILS ---
const animateStepChange = (direction: 'next' | 'prev', callback: () => void) => {
   const container = document.querySelector('.step-container')

   // SÉCURITÉ : Si l'élément n'existe pas, on lance juste le callback sans animer pour éviter l'erreur GSAP
   if (!container) {
      callback()
      return
   }

   // Sortie
   gsap.to(container, {
      y: direction === 'next' ? -20 : 20,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
         callback()
         // Entrée (après update du DOM)
         nextTick(() => {
            const newContainer = document.querySelector('.step-container')
            // SÉCURITÉ : On vérifie que le nouveau conteneur existe
            if (newContainer) {
                gsap.fromTo(newContainer,
                   { y: direction === 'next' ? 30 : -30, opacity: 0 },
                   { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
                )
                // Auto-focus sur le premier input
                const input = newContainer.querySelector('input')
                if (input) input.focus()
            }
         })
      }
   })
}

// --- ACTIONS ---
const handleNext = async () => {
   // Nettoyer les erreurs
   Object.keys(errors).forEach(key => delete errors[key])

   // Valider l'étape courante
   const schema = schemas[currentStep.value as 1 | 2 | 3]
   const result = schema.safeParse(state)

   if (!result.success) {
      // Animation d'erreur (Shake) - SÉCURISÉE
      const container = document.querySelector('.step-container')
      if (container) {
          gsap.fromTo(container, 
            { x: -10 }, 
            { x: 10, duration: 0.1, repeat: 3, yoyo: true, ease: 'none', onComplete: () => { gsap.set(container, { x: 0 }) }}
          )
      }

      // Afficher les erreurs
      (result.error as any).errors.forEach((err: any) => {
         const field = err.path[0]
         errors[field] = err.message
      })
      return
   }

   if (currentStep.value < 3) {
      animateStepChange('next', () => {
         currentStep.value++
      })
   } else {
      // SUBMIT FINAL
      submitForm()
   }
}

const prevStep = () => {
   animateStepChange('prev', () => {
      currentStep.value--
   })
}

const submitForm = async () => {
   isLoading.value = true
   try {
      const authStore = useAuthStore()
      // Appel API
      await authStore.register(state)
      // Redirection gérée par le store ou ici
      navigateTo('/dashboard') 
   } catch (e: any) {
      console.error("Erreur Inscription:", e)
      // Gestion basique de l'erreur 502 ou autre
      if (e.response && e.response.status === 502) {
          alert("Impossible de contacter le serveur. Veuillez vérifier votre connexion ou réessayer plus tard.")
      }
   } finally {
      isLoading.value = false
   }
}

onMounted(() => {
   // Intro Animation - SÉCURISÉE
   const container = document.querySelector('.step-container')
   if (container) {
       gsap.fromTo(container, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
   }
})
</script>

<style scoped>
/* Keyframes utilitaires */
@keyframes fadeIn {
   from {
      opacity: 0;
      transform: translateY(10px);
   }

   to {
      opacity: 1;
      transform: translateY(0);
   }
}

.animate-in-fade {
   animation: fadeIn 0.8s ease-out forwards;
}

/* Suppression des styles par défaut des inputs pour un look brut */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
   -webkit-box-shadow: 0 0 0 30px white inset !important;
   -webkit-text-fill-color: #111827 !important;
   transition: background-color 5000s ease-in-out 0s;
}
</style>