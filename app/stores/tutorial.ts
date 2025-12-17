import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_ROUTES } from '@/utils/api-route'
import type { Tutorial } from '~/types/tutorial'


export const useTutorialStore = defineStore('tutorial', () => {
  const tutorials = ref<Tutorial[]>([])
  const currentTutorial = ref<Tutorial | null>(null)
  const categories = ref<any[]>([]) // Catégories de tutos (pas produits)
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(params: any = {}) {
    loading.value = true
    try {
      const response = await useApi<Tutorial[]>(API_ROUTES.tutorials.base, { params })
      tutorials.value = response.data.value || []
    } catch (err: any) {
      console.error('Erreur tutos', err)
      error.value = "Impossible de charger les tutoriels"
    } finally {
      loading.value = false
    }
  }

  async function fetchBySlug(slug: string) {
    loading.value = true
    error.value = null
    currentTutorial.value = null
    try {
      const response = await useApi<Tutorial>(API_ROUTES.tutorials.bySlug(slug))
      currentTutorial.value = response.data.value || null
      return currentTutorial.value
    } catch (err: any) {
      error.value = "Tutoriel introuvable"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    if (categories.value.length > 0) return // Cache simple

    try {
      const response = await useApi<any>(API_ROUTES.tutorials.categories)
      categories.value = response.data.value || []
    } catch (err) {
      console.error(err)
    }
  }

  return {
    tutorials, currentTutorial, categories, loading, error,
    fetchAll, fetchBySlug, fetchCategories
  }
})