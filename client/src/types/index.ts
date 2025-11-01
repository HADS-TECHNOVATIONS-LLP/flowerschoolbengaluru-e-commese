export interface VideoType {
  id: string;
  title: string;
  filename: string;
  description: string;
  play?: () => void;
  pause?: () => void;
  currentTime?: number;
}

export interface AddressValidation {
  isValid: boolean;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: 'Home' | 'Office' | 'Other';
  isDefault?: boolean;
  email: string;
  phone: string;
  fullName: string;
}

export interface Address {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: 'Home' | 'Office' | 'Other';
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname?: string;
  token?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imagefirst: string;
  imagesecond: string;
  imagethirder: string;
  imagefoure: string;
  imagefive: string;
  category: string;
  inStock: boolean;
  featured: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  paymentCharges: number;
  status: string;
  paymentMethod: string;
  deliveryAddress: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export type FilterState = {
  priceRange: [number, number];
  flowerTypes: string[];
  arrangements: string[];
  occasions: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  publishedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  comment: string;
  rating: number;
  type: 'shop' | 'school';
  image: string;
  location: string;
}