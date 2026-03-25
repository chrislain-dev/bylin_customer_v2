export interface Address {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  country: string;
  state?: string;
  postal_code?: string;
  is_default?: boolean;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  options?: any;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
  shipping_address: Address;
}

export interface CheckoutState {
  shippingAddress: Address;
  billingAddress: Address;
  useBillingAsShipping: boolean;
  paymentMethod: string;
  customerPhone: string;
  customerEmail: string;
  customerNote?: string;
}
