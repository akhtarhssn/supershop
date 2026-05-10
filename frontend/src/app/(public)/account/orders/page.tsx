'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import { useGetMyOrdersQuery } from '@/redux/api/orderApi'
import { ChevronRight, Clock, Loader2, Package, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { statusColors } from '../layout'

const OrderPage = () => {
  const { data, isLoading } = useGetMyOrdersQuery(undefined);
  const orders = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Your Orders...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order History</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {orders.length} total orders
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center shadow-sm">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Once you make a purchase, your order history will appear here.</p>
            <Button asChild className="bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl px-8">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order._id || order.id}
              className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-indigo-50 transition-colors">
                    <Clock className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 tracking-tight">Order #{order.orderNumber}</p>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900">{formatPrice(order.total)}</p>
                    <Badge className={cn("border-0 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mt-1", statusColors[order.status])}>
                      {order.status}
                    </Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>

              {/* Product Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {order.products?.map((item: any) => (
                  <div key={item.product?._id || item.product?.id} className="shrink-0 relative group/thumb">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 transition-transform group-hover/thumb:scale-105">
                      <img src={item.product?.image || item.product?.productImage} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-bold text-gray-400">
                  {order.products?.length || 0} {order.products?.length === 1 ? 'Item' : 'Items'} purchased via <span className="text-gray-600">{order.paymentMethod}</span>
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button asChild variant="outline" className="flex-1 sm:flex-none border-gray-200 rounded-xl font-bold text-xs h-10 hover:bg-gray-50">
                    <Link href={`/account/orders/${order._id || order.id}`}>Details</Link>
                  </Button>
                  <Button asChild className="flex-1 sm:flex-none bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl font-bold text-xs h-10 shadow-lg shadow-indigo-600/20">
                    <Link href={`/account/orders/${order._id || order.id}`}>Track Order</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default OrderPage