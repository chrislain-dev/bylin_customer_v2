export interface HomeContentResponse {
    navigation: NavigationItem[];
    home_content: HomeContent;
}

// --- Navigation ---

export interface NavigationItem {
    label: string;
    url: string;
    mega_menu: MegaMenuColumn[] | null;
}

export interface MegaMenuColumn {
    title: string;
    type: "links" | "image";
    links?: Array<{ label: string; url: string }>;
    bottom_link?: { label: string; url: string };
    // Si type === 'image'
    image_url?: string;
    image_label?: string;
}

// --- Home Content ---

export interface HomeContent {
    hero: HeroSection;
    categories_explorer: CategoriesExplorer;
    new_collection_scroll: CollectionScroll;
    shop_selection: ShopSelection;
    faq: FaqItem[];
}

export interface HeroSection {
    title_line_1: string;
    title_line_2: string;
    collection_tag: string;
    location: string;
    background_image: string;
}

export interface CategoriesExplorer {
    display_title: string;
    subtitle: string;
    items: Array<{
        name: string;
        image: string;
        url: string;
    }>;
}

export interface CollectionScroll {
    sidebar_text: string;
    intro: {
        title_line_1: string;
        title_line_2: string;
        description: string;
    };
    looks: ProductLook[];
    see_more_link: { label: string; url: string };
}

export interface ProductLook {
    id: number;
    name: string;
    price_formatted: string;
    material: string;
    image: string;
    tag?: string;
    url: string;
}

export interface ShopSelection {
    title: string;
    items: ProductLook[];
}

export interface FaqItem {
    q: string;
    a: string;
}
