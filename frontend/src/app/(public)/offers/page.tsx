import { products } from "@/lib/mock-data";
import ProductCard from "@/components/ui/ProductCard";

export default function OffersPage() {
  // Mock filtered offers
  const offers = products.filter(p => p.discount > 0);

  return (
    <div className="bg-[#EEF2FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-red-500 pl-4 mb-8">Special Offers</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">Discover exclusive discounts and seasonal promotions on premium frozen foods. These limited-time offers ensure you get the best value without compromising on quality.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {offers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
