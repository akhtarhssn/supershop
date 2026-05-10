"use client";

import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ICategory, Product } from "@/types/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
  view?: "grid" | "list";
}

export default function ProductCard({
  product,
  className,
  view = "grid",
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, _id: product._id });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn(
        "group flex flex-col bg-white border border-[#E5E7EB] hover:shadow-md transition-shadow relative overflow-hidden rounded-md",
        className,
      )}
    >
      {/* Badges / Labels */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
        {product.discount > 0 && (
          <Badge className="bg-[#EF4444] text-white hover:bg-[#EF4444] border-0 text-[10px] font-bold px-2 py-0.5 rounded-sm">
            SALE
          </Badge>
        )}
        {product.isNewProduct && (
          <Badge className="bg-[#10B981] text-white hover:bg-[#10B981] border-0 text-[10px] font-bold px-2 py-0.5 rounded-sm">
            NEW
          </Badge>
        )}
        {product.isOrganic && (
          <Badge className="bg-[#F59E0B] text-white hover:bg-[#F59E0B] border-0 text-[10px] font-bold px-2 py-0.5 rounded-sm">
            ORGANIC
          </Badge>
        )}
      </div>

      <div className="relative aspect-4/3 bg-gray-50 flex overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out will-change-transform"
          loading="lazy"
          width={250}
          height={250}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 border-t border-[#E5E7EB]">
        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
            {typeof product.category === "object"
              ? (product.category as ICategory).name
              : product.category}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-2.5 h-2.5",
                  i < Math.floor(product.rating || 0)
                    ? "fill-[#F59E0B] text-[#F59E0B]"
                    : "fill-gray-200 text-gray-200",
                )}
              />
            ))}
            <span className="text-[10px] font-semibold text-[#F59E0B] ml-0.5">
              {product.rating}
            </span>
          </div>
        </div>

        {/* Title & Desc */}
        <h3 className="font-bold text-gray-900 text-sm mb-1.5 line-clamp-1 group-hover:text-[#6366F1] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-end gap-1.5">
              <span className="font-bold text-gray-900 text-sm">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
              / {product.weight || product.unit}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[10px] font-bold px-3 py-2 rounded-sm transition-colors whitespace-nowrap active:scale-95 z-20 relative"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
