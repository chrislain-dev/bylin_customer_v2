/**
 * Utilitaires de formatage
 * Gestion des prix, dates, numéros de téléphone, etc.
 */

/**
 * Formate un prix en devise locale
 * @param price Prix en centimes ou en unité
 * @param currency Code devise (XOF, EUR, USD)
 * @returns Prix formaté avec symbole
 */
export const formatPrice = (
  price: number,
  currency: "XOF" | "EUR" | "USD" = "XOF"
): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formate une date en français
 * @param date Date ISO string ou Date object
 * @param format Format de sortie (short, long, relative)
 * @returns Date formatée
 */
export const formatDate = (
  date: string | Date,
  format: "short" | "long" | "relative" = "long"
): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  }

  if (format === "long") {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  }

  // Relative (il y a X jours)
  return formatRelativeDate(d);
};

/**
 * Formate une date relative (il y a X jours/heures)
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  if (days < 30) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (months < 12) return `Il y a ${months} mois`;
  return `Il y a ${years} an${years > 1 ? "s" : ""}`;
};

/**
 * Formate une date avec heure
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

/**
 * Formate un numéro de téléphone
 * @param phone Numéro brut
 * @returns Numéro formaté (+229 XX XX XX XX)
 */
export const formatPhone = (phone: string): string => {
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, "");

  // Format Bénin : +229 XX XX XX XX
  if (cleaned.startsWith("229") && cleaned.length === 11) {
    return `+229 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
  }

  // Format international générique
  if (cleaned.length >= 10) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }

  return phone;
};

/**
 * Formate une taille de fichier
 * @param bytes Taille en bytes
 * @param decimals Nombre de décimales
 * @returns Taille formatée (Ko, Mo, Go)
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Octet";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Octets", "Ko", "Mo", "Go", "To"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Formate un nombre avec séparateurs de milliers
 * @param num Nombre à formater
 * @returns Nombre formaté (ex: 1 234 567)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("fr-FR").format(num);
};

/**
 * Formate un pourcentage
 * @param value Valeur entre 0 et 1 (ou 0 et 100)
 * @param normalize Si true, divise par 100
 * @returns Pourcentage formaté (ex: 15 %)
 */
export const formatPercentage = (value: number, normalize = false): string => {
  const percent = normalize ? value : value * 100;
  return `${Math.round(percent)} %`;
};

/**
 * Tronque un texte avec ellipse
 * @param text Texte à tronquer
 * @param length Longueur max
 * @returns Texte tronqué
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

/**
 * Formate un slug en titre
 * @param slug Slug (ex: mon-super-produit)
 * @returns Titre (ex: Mon Super Produit)
 */
export const slugToTitle = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Génère des initiales depuis un nom
 * @param name Nom complet
 * @returns Initiales (ex: JD pour John Doe)
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

/**
 * Formate une adresse complète
 * @param address Objet adresse
 * @returns Adresse formatée sur une ligne
 */
export const formatAddress = (address: {
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  postal_code?: string | null;
  country: string;
}): string => {
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.postal_code,
    address.city,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
};

/**
 * Formate un numéro de commande
 * @param orderNumber Numéro brut (ex: 20240105123)
 * @returns Numéro formaté (ex: ORD-2024-0105-123)
 */
export const formatOrderNumber = (orderNumber: string): string => {
  if (orderNumber.startsWith("ORD-")) return orderNumber;

  // Format: ORD-YYYY-MMDD-XXX
  if (orderNumber.length >= 11) {
    const year = orderNumber.slice(0, 4);
    const date = orderNumber.slice(4, 8);
    const seq = orderNumber.slice(8);
    return `ORD-${year}-${date}-${seq}`;
  }

  return orderNumber;
};

/**
 * Capitalize la première lettre
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formate un statut en français
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "En attente",
    processing: "En traitement",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée",
    active: "Actif",
    inactive: "Inactif",
    draft: "Brouillon",
    out_of_stock: "Rupture de stock",
  };

  return statusMap[status] || capitalize(status);
};
