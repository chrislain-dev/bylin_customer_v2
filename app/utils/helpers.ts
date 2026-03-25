/**
 * Utilitaires helpers
 * Fonctions utiles pour le business logic
 */

import type { Product, ProductStatus } from "~/types/product";
import type { OrderStatus, PaymentStatus } from "~/types/order";

/**
 * Calcule le pourcentage de réduction
 */
export const calculateDiscount = (
  price: number,
  comparePrice: number | null | undefined
): number => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

/**
 * Vérifie si un produit est en précommande
 */
export const isPreorder = (product: Product): boolean => {
  return product.is_preorder_enabled;
};

/**
 * Obtient le badge de statut d'un produit
 */
export const getProductBadge = (
  product: Product
): {
  label: string;
  color: string;
} | null => {
  if (product.is_new) {
    return { label: "Nouveau", color: "blue" };
  }

  if (
    product.is_on_sale &&
    calculateDiscount(product.price, product.compare_price) > 0
  ) {
    return {
      label: `-${calculateDiscount(product.price, product.compare_price)}%`,
      color: "red",
    };
  }

  if (isPreorder(product)) {
    return { label: "Précommande", color: "purple" };
  }

  return null;
};

/**
 * Obtient la couleur d'un statut de commande
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: "gray",
    processing: "blue",
    confirmed: "cyan",
    shipped: "purple",
    delivered: "green",
    cancelled: "red",
    refunded: "orange",
  };
  return colors[status] || "gray";
};

/**
 * Obtient la couleur d'un statut de paiement
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors: Record<PaymentStatus, string> = {
    pending: "gray",
    authorized: "cyan",
    paid: "green",
    partially_paid: "yellow",
    failed: "red",
    refunded: "orange",
    partially_refunded: "yellow",
  };
  return colors[status] || "gray";
};

/**
 * Génère un code de réduction aléatoire
 */
export const generatePromoCode = (length = 8): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Génère un numéro de commande unique
 */
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `ORD-${year}${month}${day}-${random}`;
};

/**
 * Détermine si une commande peut être annulée
 */
export const canCancelOrder = (
  status: OrderStatus,
  paymentStatus: PaymentStatus
): boolean => {
  const cancellableStatuses: OrderStatus[] = [
    "pending",
    "processing",
    "confirmed",
  ];
  return cancellableStatuses.includes(status) && paymentStatus !== "paid";
};

/**
 * Détermine si une commande peut être suivie
 */
export const canTrackOrder = (
  status: OrderStatus,
  trackingNumber?: string
): boolean => {
  return !!trackingNumber && ["shipped", "delivered"].includes(status);
};

/**
 * Calcule la progression d'une commande (0-100)
 */
export const getOrderProgress = (status: OrderStatus): number => {
  const progressMap: Record<OrderStatus, number> = {
    pending: 0,
    processing: 25,
    confirmed: 50,
    shipped: 75,
    delivered: 100,
    cancelled: 0,
    refunded: 0,
  };
  return progressMap[status] || 0;
};

/**
 * Groupe un tableau par clé
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
};

/**
 * Déduplique un tableau par clé
 */
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/**
 * Attend X millisecondes (pour debounce/throttle)
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Copie du texte dans le presse-papier
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Télécharge un fichier
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Scroll smooth vers un élément
 */
export const scrollToElement = (elementId: string, offset = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

/**
 * Vérifie si on est en mode mobile
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * Génère une couleur aléatoire (hex)
 */
export const randomColor = (): string => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

/**
 * Calcule le temps de lecture estimé (en minutes)
 */
export const estimateReadingTime = (
  text: string,
  wordsPerMinute = 200
): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Retourne une valeur aléatoire d'un tableau
 */
export const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)] as T;
};

/**
 * Mélange un tableau (Fisher-Yates)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i] as T, shuffled[j] as T] = [shuffled[j] as T, shuffled[i] as T];
  }
  return shuffled;
};

/**
 * Chunk un tableau en sous-tableaux de taille N
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Debounce une fonction
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
