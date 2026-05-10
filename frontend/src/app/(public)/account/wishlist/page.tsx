'use client'

import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { useWishlistStore } from '@/store/wishlist';

const WishListPage = () => {
  const wishlistItems = useWishlistStore((s) => s.items);
  
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-xl">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">My Wishlist</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {wishlistItems.length} Saved Items
            </p>
          </div>
        </div>
        
        {wishlistItems.length > 0 && (
          <Button asChild variant="outline" className="border-indigo-100 text-[#6366F1] font-bold rounded-xl hover:bg-indigo-50">
            <Link href="/shop" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Add More
            </Link>
          </Button>
        )}
      </div>

      {/* Grid */}
      <div className="min-h-[400px]">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is lonely</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
              Save your favorite items here to keep track of them and get alerts on price drops.
            </p>
            <Button asChild className="bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl px-10 h-12 font-bold shadow-lg shadow-indigo-600/20">
              <Link href="/shop">Start Exploring</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="transition-transform duration-300 hover:-translate-y-2">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Suggestions/Footer */}
      {wishlistItems.length > 0 && (
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden mt-10">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black mb-2">Ready to checkout?</h3>
              <p className="text-indigo-100/70 text-sm">Convert your wishlist items into a purchase today.</p>
            </div>
            <Button asChild className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl px-8 font-bold h-12 shrink-0">
              <Link href="/cart" className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Go to Cart
              </Link>
            </Button>
          </div>
          {/* Decorative background */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
      )}
    </section>
  )
}

export default WishListPage