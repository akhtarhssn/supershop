"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import Image from "next/image";

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const statusColors: Record<string, string> = {
  delivered: "bg-green-50 text-green-700 border-green-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  pending: "bg-orange-50 text-orange-700 border-orange-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.orders
      .getSingle(id)
      .then((res) => setOrder(res.data))
      .catch((err) => {
        toast.error("Failed to load order");
        router.push("/dashboard/orders");
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  if (!order) return null;

  const currentStep =
    order.status === "cancelled"
      ? -1
      : statusSteps.indexOf((order.status || "").toLowerCase());
  const oId = order.id || order._id;
  const customerName = order.user?.name || order.customer?.name || "Guest";
  const customerEmail =
    order.user?.email || order.customer?.email || order.email || "No email";
  const customerPhone =
    order.user?.phone || order.customer?.phone || order.phone || "No phone";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600"
          >
            <Link href="/dashboard/orders">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Order #{order.orderNumber || oId.slice(-6).toUpperCase()}
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                statusColors[(order.status || "").toLowerCase()] ||
                  statusColors.pending,
              )}
            >
              {order.status || "Pending"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-[#D1D5DB]"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>
          <Button size="sm" className="gap-2 bg-[#6366F1] hover:bg-[#4F46E5]">
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Progress tracker */}
      {order.status !== "cancelled" && (
        <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6">
          <h3 className="font-semibold text-gray-900 mb-5 text-sm">
            Order Status
          </h3>
          <div className="flex items-center">
            {statusSteps.map((step, idx) => {
              const isCompleted = currentStep >= idx;
              const isCurrent = currentStep === idx;

              return (
                <div key={step} className="flex-1 text-center relative z-10">
                  <div
                    className={cn(
                      "w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300",
                      isCompleted
                        ? "border-[#6366F1] text-[#6366F1]"
                        : "border-[#D1D5DB] text-gray-300",
                      isCurrent && "ring-4 ring-[#6366F1]/20",
                    )}
                  >
                    {idx === 0 && <Package className="w-5 h-5" />}
                    {idx === 1 && <Clock className="w-5 h-5" />}
                    {idx === 2 && <Truck className="w-5 h-5" />}
                    {idx === 3 && <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-xs font-semibold capitalize",
                      isCompleted ? "text-gray-900" : "text-gray-400",
                    )}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Invoice */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden">
            <div className="p-5 border-b border-[#D1D5DB]">
              <h3 className="font-bold text-gray-900">Order Items</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#D1D5DB]">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500">
                    Product
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500">
                    Price
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500">
                    Qty
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {(order.items || order.products || []).map(
                  (item: any, i: number) => {
                    console.log({ item });
                    const prod = item.product || {};
                    return (
                      <tr
                        key={i}
                        className="border-b border-[#E5E7EB] last:border-0"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[#F9FAFB] overflow-hidden shrink-0">
                              {prod.image ? (
                                <Image
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                  width={500}
                                  height={400}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {prod.name || "Unknown Product"}
                              </p>
                              {prod.brand && (
                                <p className="text-xs text-gray-500">
                                  {prod.brand}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-500 text-right">
                          {formatPrice(item.price || prod.price || 0)}
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-500 text-right">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-5 text-sm font-medium text-gray-900 text-right">
                          {formatPrice(
                            (item.price || prod.price || 0) * item.quantity,
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
            <div className="p-5 border-t border-[#D1D5DB] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.subtotal || order.total || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-gray-900">
                  {order.shipping === 0
                    ? "Free"
                    : formatPrice(order.shipping || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.tax || 0)}
                </span>
              </div>
              <Separator className="bg-[#D1D5DB] my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-[#6366F1] text-lg">
                  {formatPrice(order.total || order.totalPrice || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Customer</h3>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={order.customer?.avatar || "/avatar-placeholder.png"}
                alt={customerName}
                className="w-10 h-10 rounded-full bg-[#EEF2FF]"
              />
              <div>
                <p className="font-medium text-gray-900">{customerName}</p>
                <p className="text-gray-500 text-xs">{customerEmail}</p>
                <p className="text-gray-500 text-xs">{customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">
              Shipping Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress?.street}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
              {order.shippingAddress?.zipCode}
              <br />
              {order.shippingAddress?.country}
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod || "Credit Card"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize text-[10px] border",
                    (order.paymentStatus || "pending").toLowerCase() === "paid"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-orange-50 text-orange-700 border-orange-200",
                  )}
                >
                  {order.paymentStatus || "Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">
              Order Status
            </h3>
            <Badge
              variant="outline"
              className={cn(
                "capitalize border text-sm px-3 py-1",
                statusColors[order.status],
              )}
            >
              {order.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
