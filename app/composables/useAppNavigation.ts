import { useCategoryStore } from '@/stores/category'

export const useAppNavigation = () => {
  const categoryStore = useCategoryStore()

  // Liens principaux du Header
  const mainLinks = [
    { 
      label: 'Boutique', 
      to: '/shop', 
      icon: 'i-lucide-shopping-bag',
    },
    { 
      label: 'Collections', 
      to: '/collections', 
      badge: 'New',
      icon: 'i-lucide-layers'
    },
    { 
      label: 'Tutoriels', 
      to: '/tutorials',
      icon: 'i-lucide-video'
    }
  ]

  // Catégories principales (pour la nav secondaire et le mega menu)
  const categories = computed(() => {
    return categoryStore.categories.map(cat => ({
      label: cat.name,
      to: `/shop/category/${cat.slug}`,
      icon: 'i-lucide-tag', // Optionnel : icône pour chaque catégorie
      children: cat.children?.map(child => ({
        label: child.name,
        to: `/shop/category/${child.slug}`,
        description: child.description || undefined // Optionnel
      })) || []
    }))
  })

  // Catégories "quick access" pour la recherche
  const quickCategories = computed(() => {
    return categories.value.slice(0, 6).map(cat => ({
      label: cat.label,
      to: cat.to,
      emoji: getCategoryEmoji(cat.label) // Helper pour ajouter des emojis
    }))
  })

  // Helper pour associer des emojis aux catégories
  const getCategoryEmoji = (categoryName: string): string => {
    const emojiMap: Record<string, string> = {
      'Vêtements Pro': '👔',
      'Vêtements Soft': '👕',
      'Accessoires': '🧦',
      'Chaussures': '👟',
      'Bijoux': '💎',
      'Sacs': '👜'
    }
    return emojiMap[categoryName] || '🏷️'
  }

  // Charger les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      if (!categoryStore.categories.length) {
        await categoryStore.fetchAll()
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      // Fallback avec des catégories par défaut
      categoryStore.categories = [
        {
          id: 1,
          name: 'Vêtements Soft',
          slug: 'vetements-soft',
          children: [
            { id: 11, name: 'T-shirts Soft', slug: 't-shirts-soft' },
            { id: 12, name: 'Pulls Soft', slug: 'pulls-soft' },
            { id: 13, name: 'Ensembles Soft', slug: 'ensembles-soft' }
          ]
        },
        {
          id: 2,
          name: 'Vêtements Pro',
          slug: 'vetements-pro',
          children: [
            { id: 21, name: 'Chemises Pro', slug: 'chemises-pro' },
            { id: 22, name: 'Costumes Pro', slug: 'costumes-pro' },
            { id: 23, name: 'Ensembles Pro', slug: 'ensembles-pro' }
          ]
        },
        {
          id: 3,
          name: 'Accessoires',
          slug: 'accessoires',
          children: [
            { id: 31, name: 'Ceintures', slug: 'ceintures' },
            { id: 32, name: 'Chaussettes', slug: 'chaussettes' },
            { id: 33, name: 'Montres', slug: 'montres' }
          ]
        }
      ]
    }
  }

  return {
    mainLinks,
    categories,
    quickCategories,
    fetchCategories
  }
}