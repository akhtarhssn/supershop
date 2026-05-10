"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleStoreQuery } from "@/redux/api/storeApi";
import { useGetProductsQuery } from "@/redux/api/productApi";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Star, 
  Users, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Info,
  Calendar,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const SellerDetailPage = () => {
  const { id } = useParams();
  const { data: store, isLoading: isStoreLoading } = useGetSingleStoreQuery(id as string, { skip: !id });
  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({ store: id }, { skip: !id });

  const products = productsData?.data?.result || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Banner Section */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        {isStoreLoading ? (
          <Skeleton className="w-full h-full" />
        ) : store?.data?.banner ? (
          <Image
            src={store.data.banner}
            alt={store.data.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-primary/30 uppercase tracking-widest">{store?.data?.name}</h1>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Profile Header Overlay */}
      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="relative h-32 w-32 md:h-44 md:w-44 rounded-2xl border-8 border-white overflow-hidden shadow-2xl bg-white -mt-16 md:-mt-24">
              {isStoreLoading ? (
                <Skeleton className="w-full h-full" />
              ) : store?.data?.logo ? (
                <Image
                  src={store.data.logo}
                  alt={`${store.data.name} logo`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-4xl font-bold text-primary">{store?.data?.name[0]}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {isStoreLoading ? <Skeleton className="h-10 w-48" /> : store?.data?.name}
                </h1>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1">
                  Verified Seller
                </Badge>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{isStoreLoading ? <Skeleton className="h-5 w-24" /> : store?.data?.location || "USA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-slate-900 font-bold">{isStoreLoading ? <Skeleton className="h-5 w-10" /> : store?.data?.rating || "4.8"}</span>
                  <span className="text-slate-400">(120 Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{isStoreLoading ? <Skeleton className="h-5 w-24" /> : `${store?.data?.followers || 850} Followers`}</span>
                </div>
              </div>

              <div className="text-slate-500 max-w-3xl leading-relaxed">
                {isStoreLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  store?.data?.description || 
                  "Welcome to our premium store. We are dedicated to providing you with the highest quality products and an exceptional shopping experience. Explore our wide range of carefully curated items."
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                  Follow Store
                </button>
                <button className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                  Message
                </button>
              </div>
            </div>

            {/* Contact Card */}
            <div className="w-full md:w-80 bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Store Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 truncate">{store?.data?.supportEmail || "contact@seller.com"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{store?.data?.supportPhone || "+1 (555) 000-0000"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Joined October 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs / Filter Area */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-primary" />
              Products from this Seller
            </h2>
            <div className="flex items-center gap-2 text-primary font-bold hover:underline cursor-pointer">
              All Products <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {isProductsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-xl font-semibold text-slate-500">No products found for this seller.</p>
              <Link href="/shop" className="text-primary font-bold mt-2 inline-block">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDetailPage;
