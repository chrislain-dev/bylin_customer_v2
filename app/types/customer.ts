export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive" | "suspended";
  date_of_birth?: string | null;
  gender?: "male" | "female" | "other" | null;
  avatar?: string | null;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
  oauth_provider?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations
  addresses?: Address[];
  default_shipping_address?: Address;
  default_billing_address?: Address;
}

export interface Address {
  id: string;
  customer_id: string;
  type: "shipping" | "billing";
  is_default: boolean;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

// Formulaires
export interface CustomerUpdateForm {
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  avatar?: File;
}

export interface AddressForm {
  type: "shipping" | "billing";
  is_default: boolean;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}