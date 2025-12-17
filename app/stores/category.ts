import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_ROUTES } from '@/utils/api-route'
import type { Category } from '@/types/category'

export const useCategoryStore = defineStore('category', () => {
  // ----- STATE -----
  const categories = ref<Category[]>([]) // Toutes les catégories plates
  const navCategories = ref<Category[]>([]) // Catégories spécifiques navbar (si structure différente)
  const currentCategory = ref<Category | null>(null)
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ----- GETTERS -----
  
  const count = computed(() => categories.value.length)
  const isEmpty = computed(() => categories.value.length === 0)
  
  // Récupération rapide sans recalcul
  const getById = computed(() => (id: number) => categories.value.find(c => c.id === id))
  
  // Filtre les parents (ceux qui n'ont pas de parent_id)
  const rootCategories = computed(() => categories.value.filter(cat => !cat.parent_id))
  
  // Transforme la liste plate en Arbre (Tree) automatiquement
  // C'est beaucoup plus performant de le faire ici en computed
  const tree = computed(() => {
    const map = new Map<number, Category>()
    const roots: Category[] = []

    // 1. Initialiser la map avec des copies pour éviter de muter le state brut
    categories.value.forEach(cat => {
      map.set(cat.id, { ...cat, children: [] })
    })

    // 2. Construire l'arbre
    map.forEach(cat => {
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children!.push(cat)
      } else {
        roots.push(cat)
      }
    })

    return roots
  })

  // ----- ACTIONS -----

  /**
   * Charge les catégories pour la barre de navigation (souvent structure allégée)
   */
  async function fetchNavigation() {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await useApi<Category[]>(API_ROUTES.products.navBarCategories)

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }
      
      if (rawData) {
        navCategories.value = rawData
        
        if (Array.isArray(rawData)) {
          navCategories.value = rawData
          categories.value = rawData
        } else if (rawData && typeof rawData === 'object' && 'children' in rawData) {
          categories.value = [...navCategories.value, ...(rawData as { children: Category[] }).children]
        } else {
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur chargement menu'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Charge toutes les catégories (Page /categories)
   */
  async function fetchAll() {
    // Si on a déjà des données, on évite de spammer l'API sauf si besoin de refresh
    if (categories.value.length > 0) return 

    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await useApi<Category[]>(API_ROUTES.products.categories)

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }
      
      categories.value = rawData
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Charge une catégorie spécifique par Slug (Page produit/liste)
   */
  async function fetchBySlug(slug: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await useApi<Category>(API_ROUTES.products.category(slug))
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message || "Erreur API")
      }

      const rawData = data.value

      if (!rawData) {
        throw new Error("Données non reçues")
      }
      
      if (rawData) {
        currentCategory.value = rawData
        return currentCategory.value
      }
    } catch (err: any) {
      error.value = err.statusCode === 404 ? 'Catégorie introuvable' : 'Erreur réseau'
      throw err // On relance pour que la page puisse afficher une 404
    } finally {
      loading.value = false
    }
  }

  // ----- UTILITIES -----

  /**
   * Retrouve le chemin complet (Fil d'Ariane / Breadcrumb)
   * Ex: Homme > Chaussures > Baskets
   */
  function getBreadcrumb(categoryId: number): Category[] {
    const path: Category[] = []
    let currentId: number | null | undefined = categoryId

    // Sécurité pour éviter boucles infinies (max 10 niveaux)
    let depth = 0
    while (currentId && depth < 10) {
      const cat = categories.value.find(c => c.id === currentId)
      if (!cat) break
      
      path.unshift(cat)
      currentId = cat.parent_id
      depth++
    }
    return path
  }

  function $reset() {
    categories.value = []
    navCategories.value = []
    currentCategory.value = null
    error.value = null
    loading.value = false
  }

  return {
    // State
    categories,
    navCategories,
    currentCategory,
    loading,
    error,
    
    // Getters
    count,
    isEmpty,
    getById,
    rootCategories,
    tree, // ✅ L'arbre calculé automatiquement
    
    // Actions
    fetchNavigation,
    fetchAll,
    fetchBySlug,
    getBreadcrumb,
    $reset
  }
})