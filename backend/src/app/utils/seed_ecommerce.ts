import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import dns from 'node:dns';
import config from '../config';
import { Category } from '../modules/Category/category.model';
import { Product } from '../modules/Product/product.model';
import { Review } from '../modules/Review/review.model';
import { Store } from '../modules/Store/store.model';
import { User } from '../modules/user/user.model';

// Force IPv4 for SRV resolution
dns.setDefaultResultOrder('ipv4first');

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
    console.log('🌱 Connected to MongoDB for seeding...');

    // 1. Clear existing data in parallel
    console.log('🗑️  Removing old data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Store.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // 2. Create Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories.`);

    // 3. Create Admin
    const adminUser = await User.create({
      id: 'U-0001',
      name: 'Super Admin',
      email: 'admin@belibeli.com',
      phone: '+1 234 567 8900',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      address: 'Admin HQ, Tech City',
      password: 'admin123', // Pass PLAIN TEXT, User model hooks will hash it
      role: 'admin',
      status: 'Active',
      isEmailVerified: true,
      needPasswordChange: false,
    });
    console.log('👤 Created Admin user.');

    // 4. Create Sellers and Stores
    for (let i = 1; i <= 5; i++) {
      const sellerId = `U-${(i + 1).toString().padStart(4, '0')}`;
      const sellerEmail = `seller${i}@test.com`;
      const seller = await User.create({
        id: sellerId,
        name: faker.person.fullName(),
        email: sellerEmail,
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
        address: faker.location.streetAddress(),
        password: 'admin123', // Plain Text
        role: 'seller',
        status: 'Active',
        needPasswordChange: false,
        isEmailVerified: true,
      });

      const store = await Store.create({
        name: faker.company.name(),
        logo: faker.image.avatar(),
        banner: `https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop`,
        description: faker.company.catchPhrase(),
        seller: seller._id,
      });

      // 5. Create Products for each Store
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
      console.log(`🏪 Created store for ${sellerEmail} with products.`);
    }

    // 7. Create some Buyers
    const buyers = [];
    for (let i = 1; i <= 5; i++) {
      // We use create() in a loop to ensure hooks run, or insertMany with plain text
      // But for safety with hooks, we'll just loop create or use plain objects
      await User.create({
        id: `U-${(i + 10).toString().padStart(4, '0')}`,
        name: faker.person.fullName(),
        email: `buyer${i}@test.com`,
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
        address: faker.location.streetAddress(),
        password: 'admin123', // Plain Text
        role: 'buyer',
        status: 'Active',
        needPasswordChange: false,
        isEmailVerified: true,
      });
    }
    console.log('👥 Created Buyer users.');

    console.log('🎉 DATABASE SEEDED SUCCESSFULLY');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDatabase();
