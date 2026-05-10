'use client'

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Package,
  CreditCard,
  MapPin,
  User,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import OrderActionButtons from "./OrderActionButtons";
import { useGetSingleOrderQuery } from "@/redux/api/orderApi";

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const statusColors: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  shipped: "bg-blue-50 text-blue-700 border-blue-100",
  processing: "bg-amber-50 text-amber-700 border-amber-100",
  pending: "bg-orange-50 text-orange-700 border-orange-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function OrderInvoicePage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetSingleOrderQuery(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Order Details...</p>
      </div>
    );
  }

  if (error || !data?.data) {
    return notFound();
  }

  const order = data.data;
  const currentStep = order.status === "cancelled" ? -1 : statusSteps.indexOf(order.status);

  return (
    <div className="space-y-8 pb-10">
      {/* ─── Header Section ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="w-10 h-10 p-0 rounded-xl border-gray-100 hover:bg-white hover:shadow-md transition-all group">
            <Link href="/account/orders">
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order #{order.orderNumber}</h1>
              <Badge className={cn("border-0 text-[10px] font-black uppercase px-3 py-0.5 rounded-full", statusColors[order.status])}>
                {order.status}
              </Badge>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <OrderActionButtons orderId={order._id || order.id} orderNumber={order.orderNumber} />
      </div>

      {/* ─── Status Tracker ──────────────────────────────────────────────────────── */}
      {order.status !== "cancelled" && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm overflow-hidden relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
            {statusSteps.map((step, i) => {
              const isActive = i <= currentStep;
              const isPast = i < currentStep;
              return (
                <div key={step} className="flex flex-col items-center flex-1 w-full sm:w-auto">
                  <div className="flex items-center w-full">
                    {/* Line before */}
                    <div className={cn("hidden sm:block h-1 flex-1 rounded-full",
                      i === 0 ? "invisible" : (isActive ? "bg-indigo-500" : "bg-gray-100")
                    )} />

                    {/* Circle */}
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                      isActive ? "bg-indigo-600 text-white shadow-indigo-500/30 scale-110" : "bg-gray-50 text-gray-300"
                    )}>
                      {isPast ? <CheckCircle2 className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                    </div>

                    {/* Line after */}
                    <div className={cn("hidden sm:block h-1 flex-1 rounded-full",
                      i === statusSteps.length - 1 ? "invisible" : (isPast ? "bg-indigo-500" : "bg-gray-100")
                    )} />
                  </div>
                  <p className={cn("mt-4 text-[11px] font-black uppercase tracking-widest",
                    isActive ? "text-indigo-600" : "text-gray-300"
                  )}>
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
          {/* Subtle background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-gray-50 opacity-[0.03] select-none pointer-events-none">
            TRACKING
          </div>
        </div>
      )}

      {/* ─── Main Content Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column (Items & Billing) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Items Purchased</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50">
                    <th className="py-4 px-8">Product Details</th>
                    <th className="py-4 px-4 text-center">Qty</th>
                    <th className="py-4 px-8 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.products.map((item: any) => (
                    <tr key={item.product?._id || item.product?.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <img src={item.product?.image || item.product?.productImage} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.product?.name}</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">{formatPrice(item.price)} per unit</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className="font-black text-gray-600 text-sm">{item.quantity}</span>
                      </td>
                      <td className="py-5 px-8 text-right font-black text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-black">{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Tax</span>
                  <span className="text-gray-900">{formatPrice(order.tax)}</span>
                </div>
                <Separator className="my-2 bg-gray-200" />
                <div className="flex justify-between text-xl font-black text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebars) */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Delivery Details
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-indigo-50 rounded-xl">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Receiver</p>
                  <p className="font-bold text-gray-900">{order.user?.name || 'Customer'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.user?.phone || 'No phone provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">
                    {order.shippingAddress?.street},<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode},<br />
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-[#000000] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 relative z-10">Payment</h3>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-lg font-black">{order.paymentMethod}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    order.paymentStatus === 'paid' ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-wider",
                    order.paymentStatus === 'paid' ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {order.paymentStatus === 'paid' ? "Successfully Processed" : "Payment Pending"}
                  </p>
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          </div>

          {/* Need help? */}
          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 text-center">
            <h4 className="font-bold text-gray-900 mb-2">Need help with this order?</h4>
            <p className="text-xs text-gray-500 mb-6">Our support team is available 24/7 to assist you with any issues.</p>
            <Button variant="outline" className="w-full rounded-xl border-gray-200 h-11 font-bold text-xs hover:bg-white shadow-sm transition-all">
              Contact Support
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
