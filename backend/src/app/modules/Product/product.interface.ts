import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string; // Main image
  images: string[];
  category: Types.ObjectId; // Reference to Category
  store: Types.ObjectId; // Reference to Store
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
