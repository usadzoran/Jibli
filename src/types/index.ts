export type UserRole = 'customer' | 'driver' | 'admin';
export type UserStatus = 'active' | 'pending' | 'rejected' | 'suspended';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  address?: string;
  // Driver specific
  national_id?: string;
  vehicle_type?: string;
  plate_number?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image_url?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  stock: number;
  is_featured: boolean;
  created_at?: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_id: string;
  driver_id?: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  delivery_address: string;
  notes?: string;
  customer_name?: string;
  customer_phone?: string;
  created_at: any;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  image_url?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
