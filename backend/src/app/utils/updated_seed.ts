import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import dns from 'node:dns';
import config from '../config';
import { Category } from '../modules/Category/category.model';
import { Product } from '../modules/Product/product.model';
import { Review } from '../modules/Review/review.model';
import { Store } from '../modules/Store/store.model';
import { User } from '../modules/user/user.model';
// Import your new models here (Update paths as per your structure)

import { Blog } from '../modules/Blog/blog.model';
import { Brand } from '../modules/Brand/brand.model';
import { Partner } from '../modules/Partner/partner.model';
import { Service } from '../modules/Service/service.model';
import { Order } from '../modules/Order/order.model';
import { Notification } from '../modules/Notification/notification.model';
import { SellerWallet } from '../modules/Withdrawal/withdrawal.model';

dns.setServers(['8.8.8.8']);
const MONGO_URI = config.database_URL;

const categories = [
  {
    name: 'Fresh Vegetables',
    slug: 'fresh-vegetables',
    image: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4',
    color: '#4baf4f',
    description: 'Premium organic tomatoes freshly harvested from local farms.',
  },
  {
    name: 'Fresh Fruits',
    slug: 'fresh-fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
    color: '#f97316',
    description:
      'Crisp, sweet, and vibrant red apples from the finest orchards.',
  },
  {
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    image: 'https://images.unsplash.com/photo-1550583724-125581fe2f83',
    color: '#fbb400',
    description: 'Large, farm-fresh free-range eggs with golden yolks.',
  },
  {
    name: 'Meat & Fish',
    slug: 'meat-fish',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f',
    color: '#ef4444',
    description: 'Premium wild-caught Atlantic salmon fillet.',
  },
  {
    name: 'Bakery',
    slug: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    color: '#a16207',
    description:
      'Handcrafted sourdough bread made with a 48-hour fermentation process.',
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    color: '#635ad9',
    description: 'Freshly squeezed orange juice with no added sugars.',
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
    color: '#ec4899',
    description:
      'A delicious blend of almonds, cashews, walnuts, and pistachios.',
  },
  {
    name: 'Organic',
    slug: 'organic',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
    color: '#16a34a',
    description:
      'Raw, unfiltered organic honey harvested from wildflower meadows.',
  },
];

const unsplashImages = {
  'Fresh Vegetables': [
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
    'https://images.unsplash.com/photo-1582284540020-8acbe03f4924',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
  ],
  'Fresh Fruits': [
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb',
    'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
    'https://images.unsplash.com/photo-1498557850523-fd3d118b962e',
  ],
  'Dairy & Eggs': [
    'https://images.unsplash.com/photo-1658194171243-10f8f502b775',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    'https://images.unsplash.com/photo-1550583724-125581fe2f83',
  ],
  'Meat & Fish': [
    'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c',
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
  ],
  Bakery: [
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
  ],
  Beverages: [
    'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    'https://images.unsplash.com/photo-1544145945-f904253d0c7e',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
  ],
  Snacks: [
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
    'https://images.unsplash.com/photo-1592394933325-306ba3d443ed',
    'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845',
  ],
  Organic: [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
    'https://images.unsplash.com/photo-1498557850523-fd3d118b962e',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  ],
};

const seedDatabase = async () => {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined');
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB...');

    console.log('🗑️  Removing old data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Store.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Blog.deleteMany({}),
      Brand.deleteMany({}),
      Partner.deleteMany({}),
      Service.deleteMany({}),
      Order.deleteMany({}),
      Notification.deleteMany({}),
      SellerWallet.deleteMany({}),
    ]);

    // 1. Categories
    const createdCategories = await Category.insertMany(categories);

    // 2. Admin
    const adminUser = await User.create({
      id: 'A-0001',
      name: 'Super Admin',
      email: 'admin@belibeli.com',
      phone: '+1 234 567 8900',
      password: 'admin123',
      role: 'superAdmin', // Updated to match IUser interface
      status: 'Active',
      isEmailVerified: true,
      needPasswordChange: false,
      isDeleted: false,
    });

    // 3. Static Content (Brands, Services, Partners)

    for (let i = 1; i <= 5; i++) {
      await Brand.create({
        name: faker.company.name(),
        logo: faker.image.url(),
        status: 'Active',
      });
    }
    for (let i = 1; i <= 5; i++) {
      await Service.create({
        title: faker.lorem.words(2),
        description: faker.lorem.sentence(20),
        icon: faker.image.url(),
        status: 'Active',
      });
    }
    for (let i = 1; i <= 5; i++) {
      await Partner.create({
        name: faker.company.name(),
        logo: faker.image.url(),
        status: 'Active',
      });
    }

    // 4. Sellers, Stores, and Wallets
    for (let i = 1; i <= 5; i++) {
      const seller = await User.create({
        id: `S-${i.toString().padStart(4, '0')}`,
        name: faker.person.fullName(),
        email: `seller${i}@test.com`,
        password: 'admin123',
        role: 'seller',
        status: 'Active',
        isDeleted: false,
        isEmailVerified: true,
        needPasswordChange: false,
      });

      const store = await Store.create({
        name: faker.company.name(),
        seller: seller._id,
        status: 'Active',
        isDeleted: false,
      });

      await SellerWallet.create({
        seller: seller._id,
        totalEarnings: 0,
        pendingBalance: 0,
        availableBalance: 0,
        totalWithdrawn: 0,
        bankDetails: [],
      });

      // 5. Products & Notifications
      for (const cat of createdCategories) {
        const images =
          unsplashImages[cat.name as keyof typeof unsplashImages] || [];

        for (let j = 0; j < 3; j++) {
          const productName = `${faker.commerce.productAdjective()} ${cat.name}`;
          const basePrice = parseFloat(
            faker.commerce.price({ min: 5, max: 50 }),
          );
          const discount =
            j % 2 === 0 ? faker.number.int({ min: 10, max: 50 }) : 0;
          const price = basePrice * (1 - discount / 100);

          const product = await Product.create({
            name: productName,
            slug:
              faker.helpers.slugify(productName).toLowerCase() +
              '-' +
              faker.string.nanoid(5),
            description: faker.commerce.productDescription(),
            price: parseFloat(price.toFixed(2)),
            originalPrice: basePrice,
            discount: discount,
            image: images[j % images.length],
            images: images,
            category: cat._id,
            store: store._id,
            stock: faker.number.int({ min: 10, max: 500 }),
            unit: faker.helpers.arrayElement([
              'kg',
              'pcs',
              'bag',
              'bottle',
              'jar',
              'pack',
            ]),
            weight: `${faker.number.int({ min: 1, max: 10 })} ${faker.helpers.arrayElement(['kg', 'pcs', 'g'])}`,
            brand: faker.company.name(),
            tags: [cat.name.toLowerCase(), 'fresh', 'organic'],
            rating: faker.number.float({ min: 3, max: 5, multipleOf: 0.1 }),
            reviewCount: faker.number.int({ min: 0, max: 200 }),
            isFeatured: j === 0,
            isBestSeller: j === 1,
            isNewProduct: j === 2,
            isOrganic: j % 2 === 0,
            isFlashSale: j === 0,
          });

          // 6. Create Reviews
          for (let k = 0; k < 2; k++) {
            await Review.create({
              user: adminUser._id,
              product: product._id,
              rating: faker.number.int({ min: 3, max: 5 }),
              comment: faker.lorem.sentence(),
            });
          }
        }
      }
    }

    // 6. Buyers & Orders
    for (let i = 1; i <= 5; i++) {
      const buyer = await User.create({
        id: `B-${(i + 10).toString().padStart(4, '0')}`,
        name: faker.person.fullName(),
        email: `buyer${i}@test.com`,
        password: 'admin123',
        role: 'buyer',
        status: 'Active',
        isDeleted: false,
        isEmailVerified: true,
        needPasswordChange: false,
      });

      await Order.create({
        orderNumber: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
        user: buyer._id,
        products: [], // Add product refs here if needed
        subtotal: 50,
        shipping: 5,
        tax: 2,
        total: 57,
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        shippingAddress: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          country: faker.location.country(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
        },
        isDeleted: false,
      });
    }

    console.log('🎉 DATABASE SEEDED SUCCESSFULLY');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();
