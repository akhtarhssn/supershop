import { Order } from '../Order/order.model';
import { Product } from '../Product/product.model';
import { Store } from '../Store/store.model';
import { User } from '../user/user.model';

const getAdminStats = async () => {
  const totalSales = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalStores = await Store.countDocuments();

  return {
    revenue: totalSales[0]?.total || 0,
    orders: totalOrders,
    products: totalProducts,
    users: totalUsers,
    stores: totalStores,
  };
};

const getSellerStats = async (sellerId: string) => {
  const store = await Store.findOne({ seller: sellerId });
  if (!store) return null;

  const storeOrders = await Order.find({
    isDeleted: false,
    'products.seller': sellerId,
  })
    .populate('user')
    .populate('products.product')
    .sort('-createdAt');

  console.log({ storeOrders });

  const totalSales = storeOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const totalProducts = await Product.countDocuments({ store: store._id });

  return {
    revenue: totalSales,
    orders: storeOrders.length,
    products: totalProducts,
    storeName: store.name,
  };
};

export const DashboardServices = {
  getAdminStats,
  getSellerStats,
};
