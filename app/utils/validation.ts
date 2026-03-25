/**
 * Utilitaires de validation
 * Validation d'emails, téléphones, mots de passe, etc.
 */

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone béninois
 */
export const isValidPhoneBenin = (phone: string): boolean => {
  // Format accepté : +229XXXXXXXX ou 229XXXXXXXX ou XXXXXXXX (8 chiffres)
  const cleaned = phone.replace(/\D/g, "");

  // Bénin : 8 chiffres ou +229 + 8 chiffres
  if (cleaned.length === 8) return true;
  if (cleaned.length === 11 && cleaned.startsWith("229")) return true;

  return false;
};

/**
 * Valide un mot de passe selon les critères de sécurité
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Calcule la force d'un mot de passe
 * @returns Niveau de 0 à 4
 */
export const getPasswordStrength = (
  password: string
): {
  level: number;
  text: string;
  color: string;
} => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const levels = [
    { level: 0, text: "", color: "" },
    { level: 1, text: "Faible", color: "red" },
    { level: 2, text: "Moyen", color: "orange" },
    { level: 3, text: "Bon", color: "blue" },
    { level: 4, text: "Fort", color: "green" },
  ];

      return levels[strength] as {
            level: number;
            text: string;
            color: string;
      };
};

/**
 * Valide un code postal
 */
export const isValidPostalCode = (code: string): boolean => {
  // Format universel : entre 3 et 10 caractères alphanumériques
  return /^[A-Z0-9]{3,10}$/i.test(code);
};

/**
 * Valide un URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valide un slug (URL-friendly)
 */
export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

/**
 * Valide une date (pas dans le futur pour date de naissance)
 */
export const isValidBirthDate = (date: string): boolean => {
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  // Entre 13 et 120 ans
  return age >= 13 && age <= 120;
};

/**
 * Valide un numéro de carte bancaire (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, "");

  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i] as string);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Valide un CVV
 */
export const isValidCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Valide un code promo
 */
export const isValidPromoCode = (code: string): boolean => {
  // Format : 6-20 caractères alphanumériques majuscules
  return /^[A-Z0-9]{6,20}$/.test(code);
};

/**
 * Valide une quantité
 */
export const isValidQuantity = (quantity: number, max?: number): boolean => {
  if (quantity < 1) return false;
  if (max && quantity > max) return false;
  return true;
};

/**
 * Valide un prix
 */
export const isValidPrice = (price: number): boolean => {
  return price >= 0 && Number.isFinite(price);
};

/**
 * Sanitize une chaîne (enlève HTML/scripts)
 */
export const sanitizeString = (str: string): string => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
};

/**
 * Valide les dimensions d'une image
 */
export const isValidImageDimensions = (
  width: number,
  height: number,
  minWidth = 100,
  minHeight = 100,
  maxWidth = 5000,
  maxHeight = 5000
): boolean => {
  return (
    width >= minWidth &&
    width <= maxWidth &&
    height >= minHeight &&
    height <= maxHeight
  );
};

/**
 * Valide la taille d'un fichier
 */
export const isValidFileSize = (
  sizeInBytes: number,
  maxSizeInMB = 5
): boolean => {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxBytes;
};

/**
 * Valide le type MIME d'un fichier
 */
export const isValidFileType = (
  mimeType: string,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(mimeType);
};

/**
 * Valide un nom (sans chiffres ni caractères spéciaux)
 */
export const isValidName = (name: string): boolean => {
  return /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(name);
};
