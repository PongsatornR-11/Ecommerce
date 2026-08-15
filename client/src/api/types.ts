export interface User {
  id: number;
  email: string;
  name?: string | null;
  picture?: string | null;
  role: "user" | "admin";
  enabled: boolean;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id?: number;
  asset_id: string;
  public_id: string;
  url: string;
  secure_url: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  sold: number;
  quantity: number;
  categoryId?: number | null;
  category?: Category | null;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  count: number;
  quantity: number;
  images?: Image[];
}

export interface OrderProduct {
  id: number;
  productId: number;
  count: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  cartTotal: number;
  orderStatus: "Not Process" | "Processing" | "Completed" | "Cancelled";
  amount: number;
  status: string;
  currency: string;
  stripePaymentId?: string;
  orderedById: number;
  orderedBy?: User;
  products: OrderProduct[];
  createdAt: string;
  updatedAt: string;
}
