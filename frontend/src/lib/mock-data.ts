export interface Product {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  images: string[];
  category: any;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  unit: string;
  weight: string;
  brand: string;
  tags: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isOrganic: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  _id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  color: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "blocked";
  joinedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  readTime: number;
  publishedAt: string;
}

export const categories: Category[] = [
  { id: "1", name: "Fresh Vegetables", slug: "fresh-vegetables", image: "/images/cat-vegetables.png", productCount: 48, color: "#4baf4f" },
  { id: "2", name: "Fresh Fruits", slug: "fresh-fruits", image: "/images/cat-fruits.png", productCount: 36, color: "#f97316" },
  { id: "3", name: "Dairy & Eggs", slug: "dairy-eggs", image: "/images/cat-dairy.png", productCount: 24, color: "#fbb400" },
  { id: "4", name: "Meat & Fish", slug: "meat-fish", image: "/images/cat-meat.png", productCount: 30, color: "#ef4444" },
  { id: "5", name: "Bakery", slug: "bakery", image: "/images/cat-bakery.png", productCount: 18, color: "#a16207" },
  { id: "6", name: "Beverages", slug: "beverages", image: "/images/cat-beverages.png", productCount: 42, color: "#635ad9" },
  { id: "7", name: "Snacks", slug: "snacks", image: "/images/cat-snacks.png", productCount: 28, color: "#ec4899" },
  { id: "8", name: "Organic", slug: "organic", image: "/images/cat-organic.png", productCount: 22, color: "#16a34a" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Fresh Tomatoes",
    slug: "organic-fresh-tomatoes",
    description: "Premium organic tomatoes freshly harvested from local farms. Rich in lycopene, vitamins C and K, and antioxidants. Perfect for salads, cooking, and juicing.",
    price: 2.99,
    originalPrice: 4.50,
    discount: 34,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&h=800&fit=crop",
    ],
    category: "Fresh Vegetables",
    categorySlug: "fresh-vegetables",
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    unit: "kg",
    weight: "1 kg",
    brand: "Farm Fresh",
    tags: ["organic", "fresh", "vegetables"],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isOrganic: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Red Apple Premium",
    slug: "red-apple-premium",
    description: "Crisp, sweet, and vibrant red apples from the finest orchards. Naturally grown without pesticides. A healthy snack option for the whole family.",
    price: 3.99,
    originalPrice: 5.50,
    discount: 27,
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=800&fit=crop",
    ],
    category: "Fresh Fruits",
    categorySlug: "fresh-fruits",
    rating: 4.6,
    reviewCount: 89,
    stock: 80,
    unit: "kg",
    weight: "1 kg",
    brand: "OrchardBest",
    tags: ["fresh", "fruits", "apple"],
    isFeatured: true,
    isBestSeller: false,
    isNew: false,
    isOrganic: false,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Free Range Eggs (12 pack)",
    slug: "free-range-eggs-12-pack",
    description: "Large, farm-fresh free-range eggs with golden yolks and rich flavor. Hens roam freely to produce the best quality eggs possible.",
    price: 5.49,
    originalPrice: 6.99,
    discount: 21,
    image: "https://images.unsplash.com/photo-1658194171243-10f8f502b775?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1658194171243-10f8f502b775?w=800&h=800&fit=crop",
    ],
    category: "Dairy & Eggs",
    categorySlug: "dairy-eggs",
    rating: 4.9,
    reviewCount: 203,
    stock: 35,
    unit: "pcs",
    weight: "12 pcs",
    brand: "HappyHen",
    tags: ["dairy", "eggs", "free-range"],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isOrganic: true,
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Sourdough Artisan Bread",
    slug: "sourdough-artisan-bread",
    description: "Handcrafted sourdough bread made with a 48-hour fermentation process. Crispy crust, chewy interior, perfect tang, and exceptional flavor profile.",
    price: 6.99,
    originalPrice: 8.50,
    discount: 18,
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=800&fit=crop",
    ],
    category: "Bakery",
    categorySlug: "bakery",
    rating: 4.7,
    reviewCount: 67,
    stock: 20,
    unit: "piece",
    weight: "1 piece",
    brand: "Artisan Bakes",
    tags: ["bakery", "bread", "artisan"],
    isFeatured: false,
    isBestSeller: true,
    isNew: true,
    isOrganic: false,
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    name: "Organic Baby Spinach",
    slug: "organic-baby-spinach",
    description: "Tender, young spinach leaves packed with iron, calcium and vitamins. Pre-washed and ready to eat. Perfect for salads, smoothies and cooking.",
    price: 3.49,
    originalPrice: 4.99,
    discount: 30,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=800&fit=crop",
    ],
    category: "Fresh Vegetables",
    categorySlug: "fresh-vegetables",
    rating: 4.5,
    reviewCount: 45,
    stock: 40,
    unit: "bag",
    weight: "1 bag",
    brand: "GreenValley",
    tags: ["organic", "vegetables", "greens"],
    isFeatured: true,
    isBestSeller: false,
    isNew: false,
    isOrganic: true,
    createdAt: "2024-01-25",
  },
  {
    id: "6",
    name: "Greek Yogurt (500ml)",
    slug: "greek-yogurt-500ml",
    description: "Thick, creamy Greek yogurt with a rich protein content. Made from full-fat milk for an indulgent taste. Perfect with honey, fruit or granola.",
    price: 4.29,
    originalPrice: 5.49,
    discount: 22,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop",
    ],
    category: "Dairy & Eggs",
    categorySlug: "dairy-eggs",
    rating: 4.8,
    reviewCount: 178,
    stock: 60,
    unit: "piece",
    weight: "1 piece",
    brand: "Olympus",
    tags: ["dairy", "yogurt", "healthy"],
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    isOrganic: false,
    createdAt: "2024-01-12",
  },
  {
    id: "7",
    name: "Wild Salmon Fillet",
    slug: "wild-salmon-fillet",
    description: "Premium wild-caught Atlantic salmon fillet. Rich in Omega-3 fatty acids, protein and essential nutrients. Sustainably sourced and flash-frozen.",
    price: 12.99,
    originalPrice: 16.99,
    discount: 24,
    image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&h=800&fit=crop",
    ],
    category: "Meat & Fish",
    categorySlug: "meat-fish",
    rating: 4.9,
    reviewCount: 92,
    stock: 25,
    unit: "piece",
    weight: "1 piece",
    brand: "OceanPrime",
    tags: ["fish", "seafood", "omega3"],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isOrganic: false,
    createdAt: "2024-01-18",
  },
  {
    id: "8",
    name: "Orange Fresh Juice (1L)",
    slug: "orange-fresh-juice-1l",
    description: "Freshly squeezed orange juice with no added sugars or preservatives. 100% natural, packed with Vitamin C and natural goodness.",
    price: 4.99,
    originalPrice: 6.50,
    discount: 23,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&h=800&fit=crop",
    ],
    category: "Beverages",
    categorySlug: "beverages",
    rating: 4.6,
    reviewCount: 134,
    stock: 45,
    unit: "bottle",
    weight: "1 bottle",
    brand: "SunSqueeze",
    tags: ["beverages", "juice", "fresh"],
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    isOrganic: false,
    createdAt: "2024-02-10",
  },
  {
    id: "9",
    name: "Avocado Hass",
    slug: "avocado-hass",
    description: "Perfectly ripe Hass avocados with creamy, buttery flesh. Rich in healthy monounsaturated fats. Great for guacamole, toast, and salads.",
    price: 5.99,
    originalPrice: 7.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop",
    ],
    category: "Fresh Fruits",
    categorySlug: "fresh-fruits",
    rating: 4.7,
    reviewCount: 215,
    stock: 30,
    unit: "pcs",
    weight: "4 pcs",
    brand: "AvocadoFarm",
    tags: ["fruits", "avocado", "healthy"],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isOrganic: false,
    createdAt: "2024-01-22",
  },
  {
    id: "10",
    name: "Organic Honey (500g)",
    slug: "organic-honey-500g",
    description: "Raw, unfiltered organic honey harvested from wildflower meadows. Retains all natural enzymes and antioxidants. A natural sweetener.",
    price: 9.99,
    originalPrice: 13.99,
    discount: 29,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop",
    ],
    category: "Organic",
    categorySlug: "organic",
    rating: 4.9,
    reviewCount: 67,
    stock: 18,
    unit: "jar",
    weight: "1 jar",
    brand: "WildHive",
    tags: ["organic", "honey", "natural"],
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    isOrganic: true,
    createdAt: "2024-01-08",
  },
  {
    id: "11",
    name: "Mixed Nuts Premium",
    slug: "mixed-nuts-premium",
    description: "A delicious blend of almonds, cashews, walnuts, and pistachios. Dry roasted with light sea salt. A nutritious and satisfying snack.",
    price: 8.49,
    originalPrice: 11.99,
    discount: 29,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop",
    ],
    category: "Snacks",
    categorySlug: "snacks",
    rating: 4.5,
    reviewCount: 88,
    stock: 55,
    unit: "pack",
    weight: "1 pack",
    brand: "NutHouse",
    tags: ["snacks", "nuts", "healthy"],
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isOrganic: false,
    createdAt: "2024-01-30",
  },
  {
    id: "12",
    name: "Organic Blueberries",
    slug: "organic-blueberries",
    description: "Plump, juicy organic blueberries bursting with antioxidants and natural sweetness. Hand-picked and packed fresh for maximum flavor.",
    price: 18.49,
    originalPrice: 19.99,
    discount: 0.19,
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=800&fit=crop",
    ],
    category: "Fresh Fruits",
    categorySlug: "fresh-fruits",
    rating: 4.8,
    reviewCount: 156,
    stock: 22000,
    unit: "g",
    weight: "250g",
    brand: "BerryFarm",
    tags: ["organic", "fruits", "berries", "fresh"],
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    isOrganic: true,
    createdAt: "2024-02-05",
  },
  {
    id: "13",
    name: "Organic Blueberries 1kg",
    slug: "organic-blueberries-1kg",
    description: "Plump, juicy organic blueberries bursting with antioxidants and natural sweetness. Hand-picked and packed fresh for maximum flavor.",
    price: 28.49,
    originalPrice: 19.99,
    discount: 0.19,
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=800&fit=crop",
    ],
    category: "Fresh Fruits",
    categorySlug: "fresh-fruits",
    rating: 4.8,
    reviewCount: 156,
    stock: 22,
    unit: "kg",
    weight: "1 kg",
    brand: "BerryFarm",
    tags: ["organic", "fruits", "berries"],
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    isOrganic: true,
    createdAt: "2024-02-05",
  },
];

export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: {
      id: "c1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 234 567 8901",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      totalOrders: 12,
      totalSpent: 342.50,
      status: "active",
      joinedAt: "2023-06-15",
    },
    items: [
      { productId: "1", productName: "Organic Fresh Tomatoes", productImage: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=100", quantity: 2, price: 2.99, total: 5.98 },
      { productId: "3", productName: "Free Range Eggs (12 pack)", productImage: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=100", quantity: 1, price: 5.49, total: 5.49 },
    ],
    subtotal: 11.47,
    shipping: 3.99,
    tax: 1.15,
    total: 16.61,
    status: "delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    shippingAddress: { street: "123 Oak St", city: "New York", state: "NY", zipCode: "10001", country: "United States" },
    createdAt: "2024-02-10",
    updatedAt: "2024-02-12",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: {
      id: "c2",
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 345 678 9012",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      totalOrders: 7,
      totalSpent: 189.20,
      status: "active",
      joinedAt: "2023-09-22",
    },
    items: [
      { productId: "7", productName: "Wild Salmon Fillet", productImage: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=100", quantity: 2, price: 12.99, total: 25.98 },
      { productId: "5", productName: "Organic Baby Spinach", productImage: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100", quantity: 3, price: 3.49, total: 10.47 },
    ],
    subtotal: 36.45,
    shipping: 0,
    tax: 3.65,
    total: 40.10,
    status: "shipped",
    paymentMethod: "PayPal",
    paymentStatus: "paid",
    shippingAddress: { street: "456 Maple Ave", city: "Los Angeles", state: "CA", zipCode: "90001", country: "United States" },
    createdAt: "2024-02-14",
    updatedAt: "2024-02-15",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: {
      id: "c3",
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "+1 456 789 0123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      totalOrders: 3,
      totalSpent: 87.90,
      status: "active",
      joinedAt: "2024-01-05",
    },
    items: [
      { productId: "9", productName: "Avocado Hass", productImage: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100", quantity: 2, price: 5.99, total: 11.98 },
      { productId: "12", productName: "Organic Blueberries", productImage: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=100", quantity: 2, price: 6.49, total: 12.98 },
      { productId: "10", productName: "Organic Honey", productImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100", quantity: 1, price: 9.99, total: 9.99 },
    ],
    subtotal: 34.95,
    shipping: 3.99,
    tax: 3.49,
    total: 42.43,
    status: "processing",
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    shippingAddress: { street: "789 Pine Rd", city: "Chicago", state: "IL", zipCode: "60601", country: "United States" },
    createdAt: "2024-02-16",
    updatedAt: "2024-02-16",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customer: {
      id: "c4",
      name: "James Martinez",
      email: "james@example.com",
      phone: "+1 567 890 1234",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      totalOrders: 15,
      totalSpent: 512.80,
      status: "active",
      joinedAt: "2023-04-10",
    },
    items: [
      { productId: "4", productName: "Sourdough Artisan Bread", productImage: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=100", quantity: 2, price: 6.99, total: 13.98 },
      { productId: "6", productName: "Greek Yogurt", productImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100", quantity: 3, price: 4.29, total: 12.87 },
    ],
    subtotal: 26.85,
    shipping: 0,
    tax: 2.69,
    total: 29.54,
    status: "pending",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "pending",
    shippingAddress: { street: "321 Elm St", city: "Houston", state: "TX", zipCode: "77001", country: "United States" },
    createdAt: "2024-02-18",
    updatedAt: "2024-02-18",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customer: {
      id: "c5",
      name: "Olivia Brown",
      email: "olivia@example.com",
      phone: "+1 678 901 2345",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
      totalOrders: 9,
      totalSpent: 267.40,
      status: "active",
      joinedAt: "2023-07-18",
    },
    items: [
      { productId: "8", productName: "Orange Fresh Juice", productImage: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=100", quantity: 4, price: 4.99, total: 19.96 },
      { productId: "11", productName: "Mixed Nuts Premium", productImage: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=100", quantity: 2, price: 8.49, total: 16.98 },
    ],
    subtotal: 36.94,
    shipping: 3.99,
    tax: 3.69,
    total: 44.62,
    status: "cancelled",
    paymentMethod: "Credit Card",
    paymentStatus: "refunded",
    shippingAddress: { street: "654 Birch Ln", city: "Phoenix", state: "AZ", zipCode: "85001", country: "United States" },
    createdAt: "2024-02-12",
    updatedAt: "2024-02-13",
  },
];

export const customers: Customer[] = orders.map((o) => o.customer);

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Tips for Buying the Freshest Produce",
    slug: "tips-buying-fresh-produce",
    excerpt: "Learn how to select the best fruits and vegetables at your market with our expert guide to freshness indicators.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1543168256-418811576931?w=800&h=500&fit=crop",
    category: "Tips & Tricks",
    author: "Chef Marie",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie",
    readTime: 5,
    publishedAt: "2024-02-10",
  },
  {
    id: "2",
    title: "The Benefits of Going Organic: A Complete Guide",
    slug: "benefits-going-organic",
    excerpt: "Discover why organic food is better for you and the environment, and how to make the switch without breaking the bank.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop",
    category: "Health & Wellness",
    author: "Dr. James",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    readTime: 8,
    publishedAt: "2024-02-05",
  },
  {
    id: "3",
    title: "Seasonal Eating: What to Buy in Spring",
    slug: "seasonal-eating-spring",
    excerpt: "Embrace the season's bounty with this guide to the best spring produce and delicious recipes to try.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    category: "Recipes",
    author: "Sarah Green",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    readTime: 6,
    publishedAt: "2024-01-28",
  },
  {
    id: "4",
    title: "How to Reduce Food Waste at Home",
    slug: "reduce-food-waste-home",
    excerpt: "Simple strategies to make the most of your groceries and reduce your environmental footprint.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1614267861476-0d129972a0f4?w=800&h=500&fit=crop",
    category: "Sustainability",
    author: "Eco Emma",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    readTime: 7,
    publishedAt: "2024-01-20",
  },
  {
    id: "5",
    title: "Quick & Healthy Meal Prep Ideas for Busy Weeks",
    slug: "quick-healthy-meal-prep",
    excerpt: "Save time and eat better with these smart meal prep strategies and easy-to-execute recipes.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop",
    category: "Recipes",
    author: "Chef Marie",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie",
    readTime: 10,
    publishedAt: "2024-01-15",
  },
  {
    id: "6",
    title: "Top 5 Superfoods for Immunity Boost",
    slug: "superfoods-immunity-boost",
    excerpt: "Stock your pantry with these powerful superfoods to keep your immune system strong year-round.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=500&fit=crop",
    category: "Health & Wellness",
    author: "Dr. James",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    readTime: 4,
    publishedAt: "2024-01-08",
  },
];

export const dashboardStats = {
  totalRevenue: 48250.80,
  totalOrders: 1284,
  totalCustomers: 432,
  totalProducts: 168,
  revenueChange: 12.5,
  ordersChange: 8.2,
  customersChange: 15.3,
  productsChange: -2.1,
};

export const weeklyRevenueData = [
  { day: "Mon", revenue: 2400, orders: 24 },
  { day: "Tue", revenue: 4500, orders: 38 },
  { day: "Wed", revenue: 3200, orders: 31 },
  { day: "Thu", revenue: 5800, orders: 52 },
  { day: "Fri", revenue: 7200, orders: 68 },
  { day: "Sat", revenue: 8900, orders: 84 },
  { day: "Sun", revenue: 6100, orders: 55 },
];