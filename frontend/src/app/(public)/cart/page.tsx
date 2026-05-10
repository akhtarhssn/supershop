"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getItemCount } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 3.99;
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "FRESH30" || coupon.toUpperCase() === "SAVE10") {
      setAppliedCoupon(coupon.toUpperCase());
      toast.success("Coupon applied! 10% discount added.");
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  console.log(items)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#6366F1]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Add some fresh products to your cart!
          </p>
          <Button asChild className="bg-[#6366F1] hover:bg-[#4F46E5]">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-[#D1D5DB] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping <span className="text-[#6366F1]">Cart</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {getItemCount()} items in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-md border border-[#D1D5DB] p-5 flex gap-4"
              >
                <Link href={`/shop/${product.slug}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F9FAFB]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-[#6366F1] font-medium">
                        {typeof product.category === 'object' && product.category !== null
                          ? (product.category as any).name
                          : product.category}
                      </p>
                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 text-sm hover:text-[#6366F1] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.weight} · {product.brand}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(product.id);
                        toast.success("Item removed from cart.");
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 border border-[#D1D5DB] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-[#F9FAFB] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-[#F9FAFB] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatPrice(product.price * quantity)}
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-gray-400">
                          {formatPrice(product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping + clear */}
            <div className="flex items-center justify-between">
              <Button
                asChild
                variant="outline"
                className="border-[#6366F1] text-[#6366F1] hover:bg-[#EEF2FF] rounded p-5"
              >
                <Link href="/shop">← Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-md border border-[#D1D5DB] p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#6366F1]" />
                Coupon Code
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#4baf4f] text-white border-0">
                      Applied
                    </Badge>
                    <span className="font-mono font-bold text-green-700">
                      {appliedCoupon}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCoupon("");
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    className="border-[#D1D5DB] text-sm"
                  />
                  <Button
                    onClick={applyCoupon}
                    size="sm"
                    className="bg-[#6366F1] hover:bg-[#4F46E5] shrink-0"
                  >
                    Apply
                  </Button>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Try: FRESH30 or SAVE10
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-md border border-[#D1D5DB] p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({getItemCount()} items)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Shipping
                  </span>
                  <span
                    className={shipping === 0 ? "font-medium text-[#4baf4f]" : "font-medium"}
                  >
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#4baf4f]">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                {subtotal < 50 && (
                  <p className="text-[10px] text-[#6366F1] bg-[#EEF2FF] px-2 py-1.5 rounded-lg">
                    Add {formatPrice(50 - subtotal)} more for free shipping!
                  </p>
                )}
                <Separator className="bg-[#D1D5DB]" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-[#6366F1]">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full mt-5 bg-[#6366F1] hover:bg-[#4F46E5] h-12 text-base font-semibold shadow-lg shadow-[#6366F1]/25"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-xs text-center text-gray-400 mt-3">
                🔒 Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
