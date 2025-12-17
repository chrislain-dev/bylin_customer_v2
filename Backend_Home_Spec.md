# Spécification API : Page d'Accueil & Navigation

## Objectif

Fournir via **un seul endpoint** toutes les données nécessaires pour charger :

1. La barre de navigation principale (MainHeader) et ses méga-menus.
2. L'intégralité du contenu de la page d'accueil (Index).

## Endpoint

`GET /api/v1/content/home`

## Structure de la Réponse JSON

```json
{
  "success": true,
  "data": {
    "navigation": [
      {
        "label": "Vêtements",
        "url": "/shop",
        "mega_menu": [
          {
            "title": "Nouveautés",
            "type": "links",
            "links": [
              { "label": "Best-Sellers", "url": "/best-sellers" },
              { "label": "Sélection de Janvier", "url": "/selection" }
            ],
            "bottom_link": { "label": "Voir tous", "url": "/shop" }
          },
          {
            "title": "Catégories",
            "type": "links",
            "links": [
              { "label": "Ambré", "url": "/category/ambre" },
              { "label": "Boisé", "url": "/category/boise" },
              { "label": "Cuir", "url": "/category/cuir" }
            ],
            "bottom_link": { "label": "Voir tout", "url": "/shop" }
          },
          {
            "title": "Mise en avant",
            "type": "image",
            "image_url": "https://api.bylin-style.com/storage/...",
            "image_label": "Notre Best Seller",
            "url": "/product/best-seller"
          }
        ]
      },
      { "label": "Les Packs", "url": "/packs", "mega_menu": null },
      { "label": "Tutoriels", "url": "/tutorials", "mega_menu": null },
      { "label": "Maison bylin", "url": "/bylin", "mega_menu": null }
    ],

    "home_content": {
      "hero": {
        "title_line_1": "BYLIN",
        "title_line_2": "STYLE",
        "collection_tag": "Collection CONFIDENCE — 2025",
        "location": "Cotonou / Bénin",
        "background_image": "https://api.bylin-style.com/storage/hero.jpg"
      },

      "categories_explorer": {
        "display_title": "Explorer",
        "subtitle": "Sélection par catégorie",
        "items": [
          {
            "name": "HOMME",
            "image": "https://api.bylin-style.com/storage/cat-homme.jpg",
            "url": "/category/homme"
          },
          {
            "name": "FEMME",
            "image": "https://api.bylin-style.com/storage/cat-femme.jpg",
            "url": "/category/femme"
          },
          {
            "name": "ACCESSOIRES",
            "image": "https://api.bylin-style.com/storage/cat-acc.jpg",
            "url": "/category/accessoires"
          }
        ]
      },

      "new_collection_scroll": {
        "sidebar_text": "Nouvelle Collection",
        "intro": {
          "title_line_1": "BYLIN",
          "title_line_2": "NEW GEN",
          "description": "Une esthétique brute forgée dans les rues de Cotonou..."
        },
        "looks": [
          {
            "id": 1,
            "name": "NOCTURNE TRENCH",
            "price_formatted": "245.000 FCFA",
            "material": "Cuir Italien & Laine",
            "image": "https://images.unsplash.com/photo-1...",
            "tag": "RUNWAY",
            "url": "/product/nocturne-trench"
          },
          {
            "id": 2,
            "name": "COBALT SILK",
            "price_formatted": "180.000 FCFA",
            "material": "Soie Bleue / Oversized",
            "image": "https://images.unsplash.com/photo-2...",
            "tag": "BESTSELLER",
            "url": "/product/cobalt-silk"
          }
        ],
        "see_more_link": { "label": "Tout Voir ->", "url": "/shop" }
      },

      "shop_selection": {
        "title": "Sélection Boutique",
        "items": [
          // Liste d'objets produits similaire à 'looks' ci-dessus
          // Peut contenir les mêmes produits ou une sélection différente
        ]
      },

      "faq": [
        {
          "q": "Livraison & Délais ?",
          "a": "Expédition rapide depuis Cotonou..."
        },
        {
          "q": "Politique de Retour ?",
          "a": "Retours acceptés sous 14 jours..."
        },
        {
          "q": "Sizing & Coupes ?",
          "a": "Nos pièces suivent une esthétique Oversize..."
        }
      ]
    }
  }
}
```

## Détails d'implémentation

### 1. Navigation (`navigation`)

- C'est un tableau d'objets "Menu Item".
- Chaque item peut avoir un tableau `mega_menu`.
- Le `mega_menu` est divisé en colonnes. Chaque colonne a un `type` ('links' ou 'image') pour permettre au frontend de savoir comment l'afficher (liste de liens ou image promotionnelle).

### 2. Contenu Home (`home_content`)

- **Hero**: Données pour la section tout en haut (Titre, Image fond).
- **Categories Explorer**: Les 3 grandes cartes verticales.
- **New Collection Scroll**: La section à défilement horizontal. Contient une intro textuelle et une liste de "Looks" (Produits).
- **Shop Selection**: La grille de produits en bas de page.
- **FAQ**: Liste simple de questions/réponses.

## Notes pour le Backend

- Les images doivent être des URLs absolues.
- Les prix doivent être pré-formatés (ex: "245.000 FCFA") ou envoyés avec devise pour formatage front (mais le format string est plus simple ici).
- Les `tags` (RUNWAY, NEW, etc.) sont utilisés pour l'affichage de badges.
