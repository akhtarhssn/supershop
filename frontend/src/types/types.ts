export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResponse = {
  accessToken: string;
  needPasswordChange: boolean;
};

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  password?: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  // forgotPasswordTokenTime?: Date;
  passwordResetVersion?: number;
  role: "superAdmin" | "admin" | "seller" | "buyer";
  status: "Active" | "Blocked";
  isDeleted: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  description?: string;
  isDeleted: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string; // Main image
  images: string[];
  category: ICategory; // Reference to Category
  store: string; // Reference to Store
  stock: number;
  unit: string;
  weight: string;
  brand: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  isOrganic?: boolean;
  isFlashSale?: boolean;
  isDeleted: boolean;
}

export interface IStore {
  _id: string;
  name: string;
  logo?: string;
  banner?: string;
  description?: string;
  supportEmail?: string;
  supportPhone?: string;
  location?: string;
  rating?: number;
  followers?: number;
  status: "Active" | "Blocked";
}

export interface IOrderProduct {
  product: string;
  quantity: number;
  price: number;
  seller?: string;
  sellerEarnings?: number;
}

export interface IOrder {
  orderNumber: string;
  user?: string;
  email?: string;
  products: IOrderProduct[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  adminCommission?: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  transactionId?: string;
  isDeleted: boolean;
}

interface errorSources {
  path: string;
  message: string;
}

export interface APIErrorType {
  success: boolean;
  message: string;
  errorSources: errorSources[];
  stack: string;
}
