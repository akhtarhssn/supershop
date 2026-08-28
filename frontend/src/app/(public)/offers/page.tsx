"use client"
import { useGetProductsQuery } from "@/redux/api/productApi";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types/types";

export default function OffersPage() {
  // Mock filtered offers
  const { data: products, isLoading } = useGetProductsQuery({})
  const offers = products?.data?.filter((p: Product) => p.discount > 0);

  return (
    <div className="bg-[#EEF2FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-red-500 pl-4 mb-8">Special Offers</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">Discover exclusive discounts and seasonal promotions on premium frozen foods. These limited-time offers ensure you get the best value without compromising on quality.</p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {offers.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">No special offers available at the moment. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
