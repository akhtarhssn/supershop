import dns from 'node:dns';
(dns as any).setServers(['1.1.1.1', '8.8.8.8']);
dns.setDefaultResultOrder('ipv4first');

import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import config from '../config';
import { Category } from '../modules/Category/category.model';
import { Product } from '../modules/Product/product.model';
import { Store } from '../modules/Store/store.model';
import { User } from '../modules/user/user.model';
import { Order } from '../modules/Order/order.model';
import { Notification } from '../modules/Notification/notification.model';
import { SellerWallet } from '../modules/Withdrawal/withdrawal.model';

async function seedDatabase() {
  try {
    const MONGO_URI = config.database_URL as string;
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined');

    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    console.log('🗑️  Removing old data...');
    await User.deleteMany({}); console.log('  - Users');
    await Category.deleteMany({}); console.log('  - Categories');
    await Store.deleteMany({}); console.log('  - Stores');
    await Product.deleteMany({}); console.log('  - Products');
    await Order.deleteMany({}); console.log('  - Orders');
    await Notification.deleteMany({}); console.log('  - Notifications');
    await SellerWallet.deleteMany({}); console.log('  - Wallets');
    console.log('✅ Old data removed.');

    const categories = await Category.insertMany([
      { name: 'Fresh Vegetables', slug: 'fresh-vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4', color: '#4baf4f', description: 'Fresh veggies' },
      { name: 'Fresh Fruits', slug: 'fresh-fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b', color: '#f97316', description: 'Fresh fruits' },
      { name: 'Dairy & Eggs', slug: 'dairy-eggs', image: 'https://images.unsplash.com/photo-1550583724-125581fe2f83', color: '#fbb400', description: 'Dairy products' },
      { name: 'Meat & Fish', slug: 'meat-fish', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f', color: '#ef4444', description: 'Meat & fish' },
      { name: 'Bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff', color: '#a16207', description: 'Bakery items' },
      { name: 'Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b', color: '#635ad9', description: 'Beverages' },
      { name: 'Snacks', slug: 'snacks', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32', color: '#ec4899', description: 'Snacks' },
      { name: 'Organic', slug: 'organic', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38', color: '#16a34a', description: 'Organic products' },
    ]);
    console.log(`✅ Created ${categories.length} categories.`);

    // Create Admin
    await User.deleteMany({}); // Double delete to be sure
    
    const adminUser = await User.create({
      id: `ADM-${Date.now()}`,
      name: 'Super Admin', email: 'admin@belibeli.com', phone: '+1 234 567 8900',
      password: 'admin123', role: 'admin', status: 'Active', needPasswordChange: false, isEmailVerified: true,
    });
    const superAdminUser = await User.create({
      id: `SUP-${Date.now()}`,
      name: 'Super Admin', email: 'superadmin@belibeli.com', phone: '+1 234 567 8901',
      password: 'admin123', role: 'superAdmin', status: 'Active', needPasswordChange: false, isEmailVerified: true,
    });
    console.log('👤 Created Admin & Super Admin.');

    // Create Sellers with stores and products
    const sellers: any[] = [];
    const allProducts: any[] = [];

    for (let i = 1; i <= 8; i++) {
      const sellerEmail = `seller${i}@test.com`;
      const seller = await User.create({
        id: `U-${i.toString().padStart(4, '0')}`,
        name: faker.person.fullName(), email: sellerEmail, phone: faker.phone.number(),
        password: 'admin123', role: 'seller', status: 'Active', needPasswordChange: false, isEmailVerified: true,
      });
      sellers.push(seller);

      const store = await Store.create({
        name: faker.company.name(), logo: faker.image.avatar(),
        banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        description: faker.company.catchPhrase(), seller: seller._id,
      });

      // Create 5 products per store
      for (let j = 0; j < 5; j++) {
        const randomCat = faker.helpers.arrayElement(categories);
        const basePrice = parseFloat(faker.commerce.price({ min: 5, max: 100 }));
        const discount = j % 2 === 0 ? faker.number.int({ min: 10, max: 30 }) : 0;

        const product = await Product.create({
          name: `${faker.commerce.productAdjective()} ${randomCat.name}`,
          slug: faker.helpers.slugify(`${faker.commerce.productName()}-${i}-${j}`).toLowerCase(),
          description: faker.commerce.productDescription(),
          price: parseFloat((basePrice * (1 - discount / 100)).toFixed(2)),
          originalPrice: basePrice, discount,
          image: `https://images.unsplash.com/photo-${1500000000000 + faker.number.int(100000000000)}?w=500`,
          images: [],
          category: randomCat._id, store: store._id,
          stock: faker.number.int({ min: 10, max: 500 }),
          unit: 'pcs', weight: '1 kg', brand: faker.company.name(),
          rating: 4.5, reviewCount: 10,
          isFeatured: j < 2, isBestSeller: false, isNewProduct: false, isOrganic: j % 2 === 0,
        });
        allProducts.push({ ...product.toObject(), storeObj: store });
      }

      // Create wallet
      await SellerWallet.create({
        seller: seller._id,
        totalEarnings: parseFloat(faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }).toFixed(2)),
        pendingBalance: parseFloat(faker.number.float({ min: 0, max: 500, fractionDigits: 2 }).toFixed(2)),
        availableBalance: parseFloat(faker.number.float({ min: 50, max: 2000, fractionDigits: 2 }).toFixed(2)),
        totalWithdrawn: parseFloat(faker.number.float({ min: 0, max: 3000, fractionDigits: 2 }).toFixed(2)),
        bankDetails: [{
          bankName: faker.helpers.arrayElement(['Chase Bank', 'Bank of America', 'Wells Fargo']),
          accountName: seller.name,
          accountNumber: faker.finance.accountNumber(10),
          isDefault: true,
        }],
      });
      console.log(`🏪 Created seller ${sellerEmail}`);
    }

    // Create Buyers
    const buyers: any[] = [];
    for (let i = 1; i <= 15; i++) {
      const buyer = await User.create({
        id: `U-${(i + 100).toString().padStart(4, '0')}`,
        name: faker.person.fullName(), email: `buyer${i}@test.com`, phone: faker.phone.number(),
        password: 'admin123', role: 'buyer', status: 'Active', needPasswordChange: false, isEmailVerified: true,
      });
      buyers.push(buyer);
    }
    console.log(`👥 Created ${buyers.length} buyers.`);

    // Create Orders
    const ORDER_COUNT = 30;
    console.log(`📦 Creating ${ORDER_COUNT} orders...`);
    const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

    for (let i = 0; i < ORDER_COUNT; i++) {
      const buyer = faker.helpers.arrayElement(buyers);
      const selectedProducts = faker.helpers.arrayElements(allProducts, { min: 1, max: 4 });

      let subtotal = 0;
      let adminCommission = 0;
      const orderProducts = [];

      for (const p of selectedProducts) {
        const quantity = faker.number.int({ min: 1, max: 5 });
        const price = p.price;
        const itemTotal = price * quantity;
        subtotal += itemTotal;
        const sellerShare = itemTotal * 0.8;
        adminCommission += itemTotal * 0.2;

        orderProducts.push({
          product: p._id, quantity, price,
          seller: p.storeObj.seller, sellerEarnings: sellerShare,
        });
      }

      const shipping = faker.number.float({ min: 0, max: 10, fractionDigits: 2 });
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;
      const status = faker.helpers.arrayElement(ORDER_STATUSES);

      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}-${faker.number.int({ min: 100, max: 999 })}`,
        user: buyer._id, email: buyer.email,
        products: orderProducts,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        adminCommission: parseFloat(adminCommission.toFixed(2)),
        status,
        paymentMethod: 'Credit Card', paymentStatus: 'paid',
        shippingAddress: { street: faker.location.streetAddress(), city: faker.location.city(), state: faker.location.state(), zipCode: faker.location.zipCode(), country: 'USA' },
        transactionId: faker.string.alphanumeric(24),
      });

      // Notifications
      await Notification.create({ user: buyer._id, type: 'order', title: 'Order Placed', message: `Order #${order.orderNumber} placed. Total: $${total.toFixed(2)}`, orderId: order._id, isRead: false });
      await Notification.create({ user: adminUser._id, type: 'order', title: 'New Order', message: `Order #${order.orderNumber}. Commission: $${adminCommission.toFixed(2)}`, orderId: order._id, isRead: false });
      await Notification.create({ user: superAdminUser._id, type: 'order', title: 'New Order', message: `Order #${order.orderNumber}. Commission: $${adminCommission.toFixed(2)}`, orderId: order._id, isRead: false });
    }
    console.log(`📦 Created ${ORDER_COUNT} orders with notifications.`);

    // More notifications for variety
    for (const seller of sellers) {
      await Notification.create({ user: seller._id, type: 'order', title: 'Order Shipped', message: `Order #ORD-${faker.number.int({ min: 100000, max: 999999 })} shipped`, isRead: false });
      await Notification.create({ user: seller._id, type: 'payment', title: 'Payment Received', message: `$${faker.number.float({ min: 10, max: 100 })} received`, isRead: false });
    }
    for (const buyer of buyers) {
      await Notification.create({ user: buyer._id, type: 'system', title: 'Welcome!', message: 'Get 20% off with WELCOME20', isRead: false });
    }
    console.log('🔔 Created additional notifications.');

    console.log('\n🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('\n📋 Test Accounts:');
    console.log('  Admin: admin@belibeli.com / admin123');
    console.log('  Super Admin: superadmin@belibeli.com / admin123');
    console.log('  Sellers: seller1@test.com to seller8@test.com / admin123');
    console.log('  Buyers: buyer1@test.com to buyer15@test.com / admin123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();