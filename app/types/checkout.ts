// types/checkout.ts
import type { Address } from "./customer";
import type { CartItem } from "./cart";
import type { PaymentMethod, ShippingMethod } from "./order";

// ==========================================
// ENUMS & TYPES DE BASE
// ==========================================

export type CheckoutStep =
  | "cart" // Panier
  | "shipping" // Adresse de livraison
  | "payment" // Paiement
  | "confirmation"; // Confirmation

export type CouponStatus =
  | "valid"
  | "invalid"
  | "expired"
  | "limit_reached"
  | "min_amount_not_met";

// ==========================================
// SHIPPING
// ==========================================

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  description: string;
  price: number;
  estimated_days: string; // Ex: "3-5 jours"
  is_available: boolean;
  icon?: string;
}

export interface ShippingRate {
  method: ShippingMethod;
  cost: number;
  estimated_delivery: string;
}

// ==========================================
// COUPON / DISCOUNT
// ==========================================

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed"; // % ou montant fixe
  value: number; // 10 (%) ou 5000 (XOF)
  min_amount?: number | null; // Montant minimum requis
  max_discount?: number | null; // Réduction maximum
  expires_at?: string | null;
  usage_limit?: number | null;
  usage_count: number;
  is_active: boolean;
}

export interface AppliedCoupon extends Coupon {
  discount_amount: number; // Montant réel de la réduction
}

// ==========================================
// CHECKOUT STATE
// ==========================================

export interface CheckoutState {
  // Navigation
  current_step: CheckoutStep;
  completed_steps: CheckoutStep[];

  // Items
  items: CartItem[];

  // Adresses
  shipping_address?: Address | null;
  billing_address?: Address | null;
  use_same_address: boolean; // Utiliser la même adresse pour facturation

  // Livraison
  shipping_method?: ShippingMethod | null;
  shipping_options: ShippingOption[];

  // Paiement
  payment_method?: PaymentMethod | null;

  // Coupon
  coupon?: AppliedCoupon | null;
  coupon_code?: string;
  coupon_error?: string | null;

  // Notes
  customer_notes?: string;

  // Calculs
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;

  // État
  is_processing: boolean;
  error?: string | null;
}

// ==========================================
// VALIDATION
// ==========================================

export interface CheckoutValidation {
  cart: {
    is_valid: boolean;
    errors: string[];
  };
  shipping: {
    is_valid: boolean;
    errors: string[];
  };
  payment: {
    is_valid: boolean;
    errors: string[];
  };
}

// ==========================================
// SUMMARY (Récapitulatif)
// ==========================================

export interface CheckoutSummary {
  items_count: number;
  subtotal: number;
  shipping: {
    method: ShippingMethod;
    cost: number;
  };
  tax: number;
  discount: number;
  coupon?: {
    code: string;
    amount: number;
  };
  total: number;
}

// ==========================================
// FEDAPAY INTEGRATION
// ==========================================

export interface FedaPayConfig {
  public_key: string;
  environment: "sandbox" | "live";
  currency: "XOF" | "XAF" | "NGN" | "USD";
}

export interface FedaPayTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "declined" | "cancelled";
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  callback_url: string;
  return_url: string;
  description: string;
}

export interface FedaPayResponse {
  success: boolean;
  transaction?: FedaPayTransaction;
  checkout_url?: string;
  error?: string;
}

// ==========================================
// PAYLOAD DE FINALISATION
// ==========================================

export interface CompleteCheckoutPayload {
  // Items
  items: {
    product_id: string;
    variation_id?: string;
    quantity: number;
  }[];

  // Adresses
  shipping_address: Omit<
    Address,
    "id" | "customer_id" | "created_at" | "updated_at"
  >;
  billing_address: Omit<
    Address,
    "id" | "customer_id" | "created_at" | "updated_at"
  >;

  // Méthodes
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;

  // Optionnel
  coupon_code?: string;
  customer_notes?: string;

  // Sauvegarde des adresses
  save_shipping_address?: boolean;
  save_billing_address?: boolean;
  set_shipping_as_default?: boolean;
  set_billing_as_default?: boolean;
}

// ==========================================
// HELPERS
// ==========================================

export const CHECKOUT_STEPS: CheckoutStep[] = [
  "cart",
  "shipping",
  "payment",
  "confirmation",
];

export const CHECKOUT_STEP_LABELS: Record<CheckoutStep, string> = {
  cart: "Panier",
  shipping: "Livraison",
  payment: "Paiement",
  confirmation: "Confirmation",
};

export const CHECKOUT_STEP_ICONS: Record<CheckoutStep, string> = {
  cart: "i-heroicons-shopping-cart",
  shipping: "i-heroicons-truck",
  payment: "i-heroicons-credit-card",
  confirmation: "i-heroicons-check-circle",
};

export function getStepIndex(step: CheckoutStep): number {
  return CHECKOUT_STEPS.indexOf(step);
}

export function getNextStep(currentStep: CheckoutStep): CheckoutStep | null {
  const currentIndex = getStepIndex(currentStep);
  return CHECKOUT_STEPS[currentIndex + 1] || null;
}

export function getPreviousStep(
  currentStep: CheckoutStep
): CheckoutStep | null {
  const currentIndex = getStepIndex(currentStep);
  return CHECKOUT_STEPS[currentIndex - 1] || null;
}

export function isStepCompleted(
  step: CheckoutStep,
  completedSteps: CheckoutStep[]
): boolean {
  return completedSteps.includes(step);
}

export function canNavigateToStep(
  targetStep: CheckoutStep,
  completedSteps: CheckoutStep[]
): boolean {
  const targetIndex = getStepIndex(targetStep);

  // On peut toujours aller au panier
  if (targetStep === "cart") return true;

  // Pour les autres étapes, vérifier que l'étape précédente est complétée
  const previousStep = CHECKOUT_STEPS[targetIndex - 1];
  return completedSteps.includes(previousStep as CheckoutStep);
}

export function calculateDiscount(
  subtotal: number,
  coupon: Coupon | null
): number {
  if (!coupon || !coupon.is_active) return 0;

  // Vérifier le montant minimum
  if (coupon.min_amount && subtotal < coupon.min_amount) return 0;

  let discount = 0;

  if (coupon.type === "percentage") {
    discount = Math.round(subtotal * (coupon.value / 100));
  } else {
    discount = coupon.value;
  }

  // Appliquer la réduction maximum si définie
  if (coupon.max_discount) {
    discount = Math.min(discount, coupon.max_discount);
  }

  return discount;
}

export function validateCheckout(state: CheckoutState): CheckoutValidation {
  const validation: CheckoutValidation = {
    cart: { is_valid: true, errors: [] },
    shipping: { is_valid: true, errors: [] },
    payment: { is_valid: true, errors: [] },
  };

  // Validation du panier
  if (!state.items.length) {
    validation.cart.is_valid = false;
    validation.cart.errors.push("Le panier est vide");
  }

  // Validation de la livraison
  if (!state.shipping_address) {
    validation.shipping.is_valid = false;
    validation.shipping.errors.push("Adresse de livraison requise");
  }

  if (!state.shipping_method) {
    validation.shipping.is_valid = false;
    validation.shipping.errors.push("Méthode de livraison requise");
  }

  // Validation du paiement
  if (!state.payment_method) {
    validation.payment.is_valid = false;
    validation.payment.errors.push("Méthode de paiement requise");
  }

  return validation;
}
