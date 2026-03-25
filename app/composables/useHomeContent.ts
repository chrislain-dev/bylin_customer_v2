export const useHomeContent = () => {
  const config = useRuntimeConfig();
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Data refs - SEULEMENT ce qui vient de l'API
  const latestProducts = ref([]);
  const categories = ref([]);
  const bestOffer = ref(null);

  // Data statique - directement dans le composable
  const heroSlides = ref([
    {
      id: 1,
      title: "Collection Été 2025",
      subtitle: "Nouvelle Arrivage",
      description:
        "Découvrez nos dernières créations inspirées de l'élégance africaine",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop",
      cta: "Découvrir",
      ctaLink: "/collections/ete-2025",
    },
    {
      id: 2,
      title: "Tenues Traditionnelles",
      subtitle: "Authenticité & Modernité",
      description:
        "Un mariage parfait entre tradition et tendance contemporaine",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
      cta: "Explorer",
      ctaLink: "/collections/traditionnelles",
    },
    {
      id: 3,
      title: "Jusqu'à -50%",
      subtitle: "Offres Exceptionnelles",
      description: "Profitez de nos réductions sur une sélection de produits",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop",
      cta: "Voir les offres",
      ctaLink: "/promotions",
    },
  ]);

  const reviews = ref([
    {
      id: 1,
      name: "Aminata Diallo",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      date: "15 Déc 2024",
      comment:
        "Qualité exceptionnelle ! Les tissus sont magnifiques et la coupe parfaite. Je recommande vivement Bylin.",
    },
    {
      id: 2,
      name: "Jean-Baptiste Koffi",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      date: "10 Déc 2024",
      comment:
        "Service impeccable, livraison rapide à Cotonou. Les vêtements sont encore plus beaux en vrai !",
    },
    {
      id: 3,
      name: "Fatima Touré",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 4,
      date: "5 Déc 2024",
      comment:
        "Très satisfaite de mon achat. Le style est unique et authentique. Parfait pour les grandes occasions.",
    },
  ]);

  const reviewStats = ref({
    average_rating: 4.9,
    total_reviews: 1247,
  });

  const whyBylin = ref([
    {
      id: 1,
      icon: "i-heroicons-truck",
      title: "Livraison Rapide",
      description:
        "Livraison gratuite à Cotonou sous 24-48h pour toute commande supérieure à 25 000 FCFA",
    },
    {
      id: 2,
      icon: "i-heroicons-shield-check",
      title: "Paiement Sécurisé",
      description:
        "Transactions 100% sécurisées via Visa, Mastercard, MTN Money et Moov Money",
    },
    {
      id: 3,
      icon: "i-heroicons-arrow-path",
      title: "Retours Faciles",
      description:
        "Retours et échanges gratuits sous 14 jours si le produit ne vous convient pas",
    },
    {
      id: 4,
      icon: "i-heroicons-star",
      title: "Qualité Premium",
      description:
        "Tissus africains authentiques et confection soignée par des artisans locaux",
    },
  ]);

  const instagramPosts = ref([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop",
      likes: 432,
      link: "https://instagram.com",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&h=500&fit=crop",
      likes: 567,
      link: "https://instagram.com",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&h=500&fit=crop",
      likes: 891,
      link: "https://instagram.com",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop",
      likes: 654,
      link: "https://instagram.com",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=500&h=500&fit=crop",
      likes: 723,
      link: "https://instagram.com",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=500&fit=crop",
      likes: 489,
      link: "https://instagram.com",
    },
  ]);

  /**
   * Fetch dynamic content from API
   */
  const fetchHomeContent = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await useFetch(
        `${config.public.apiBase}/v1/content/home`,
        {
          method: "GET",
          key: "home-content",
          getCachedData: (key) => {
            const cached =
              useNuxtApp().payload.data[key] || useNuxtApp().static.data[key];
            if (!cached) return null;

            const age = Date.now() - (cached.timestamp || 0);
            if (age > 5 * 60 * 1000) return null;

            return cached;
          },
        }
      );

      if (data.value?.success) {
        const content = data.value.data;

        // Populate only dynamic refs
        latestProducts.value = content.latest_products || [];
        categories.value = content.featured_categories || [];
        bestOffer.value = content.best_offer;

        data.value.timestamp = Date.now();
      } else {
        throw new Error("Failed to fetch home content");
      }
    } catch (e) {
      error.value = e.message || "Une erreur est survenue";
      console.error("Error fetching home content:", e);
    } finally {
      loading.value = false;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return {
    // State (dynamic)
    loading,
    error,
    latestProducts,
    categories,
    bestOffer,

    // State (static)
    heroSlides,
    reviews,
    reviewStats,
    whyBylin,
    instagramPosts,

    // Methods
    fetchHomeContent,
    formatPrice,
  };
};
