"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartSheet({ children }: { children?: React.ReactNode }) {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <Sheet>
      <SheetTrigger
        render={
          children ? undefined : (
            <Button variant="ghost" size="icon" className="relative h-10 w-10">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-[#635ad9] text-white text-[10px] border-0">
                  {itemCount}
                </Badge>
              )}
            </Button>
          )
        }
      >
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-l border-[#e8e8f0]">
        <SheetHeader className="p-6 border-b border-[#e8e8f0]">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#635ad9]" />
            Your Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#f5f3ff] flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-[#635ad9] opacity-20" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[200px]">
                Looks like you haven't added anything to your cart yet.
              </p>
              <SheetClose render={<Button className="bg-[#635ad9] hover:bg-[#4f46e5]" />}>
                Start Shopping
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#e8e8f0] bg-white shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-[#635ad9] transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.product.weight || item.product.unit}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#e8e8f0] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-[#635ad9] text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#e8e8f0] space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="grid gap-3">
              <Button asChild className="w-full bg-[#635ad9] hover:bg-[#4f46e5] h-12 text-base font-semibold group">
                <Link href="/checkout">
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <SheetClose render={<Button variant="outline" className="w-full border-[#e8e8f0] h-12 text-gray-600" />}>
                Continue Shopping
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
