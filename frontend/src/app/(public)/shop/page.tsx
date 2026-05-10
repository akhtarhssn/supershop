"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/lib/api-client";
import { gsap } from "gsap";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";

  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [organicOnly, setOrganicOnly] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    api.categories.getAll().then((res) => setCategories(res.data || []));
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerm: initialQuery,
        };

        if (selectedCategories.length > 0) {
          // The backend expects category ID or slug. Our categories in DB have slugs.
          params.category = selectedCategories.join(",");
        }

        if (selectedBrands.length > 0) {
          params.brand = selectedBrands.join(",");
        }

        if (organicOnly) {
          params.isOrganic = true;
        }

        // Handle sorting
        if (sortBy === "price-asc") params.sort = "price";
        if (sortBy === "price-desc") params.sort = "-price";
        if (sortBy === "rating") params.sort = "-rating";
        if (sortBy === "new") params.sort = "-createdAt";

        const res = await api.products.getAll(params);
        setProducts(res.data.result || []);
        setTotalProducts(res.data.meta.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    selectedCategories,
    selectedBrands,
    organicOnly,
    sortBy,
    initialQuery,
  ]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 20]);
    setOrganicOnly(false);
    setCurrentPage(1);
  };

  const brandNames = [
    "Nestle",
    "Organic Farms",
    "Fresh Choice",
    "Green Life",
    "Farm House",
  ];

  const activeFilterCount =
    selectedCategories.filter(Boolean).length +
    selectedBrands.length +
    (organicOnly ? 1 : 0);

  console.log({ products });

  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Active Filters ({activeFilterCount})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Categories</h4>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
                className="border-[#D1D5DB] data-[state=checked]:bg-[#6366F1] data-[state=checked]:border-[#6366F1]"
              />
              <Label
                htmlFor={`cat-${cat.slug}`}
                className="text-sm text-gray-600 cursor-pointer"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[#D1D5DB]" />

      {/* Organic filter */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Options</h4>
        <div className="flex items-center gap-2">
          <Checkbox
            id="organic"
            checked={organicOnly}
            onCheckedChange={(checked) => {
              setOrganicOnly(!!checked);
              setCurrentPage(1);
            }}
            className="border-[#D1D5DB] data-[state=checked]:bg-[#6366F1] data-[state=checked]:border-[#6366F1]"
          />
          <Label
            htmlFor="organic"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Organic Only
          </Label>
        </div>
      </div>

      <Separator className="bg-[#D1D5DB]" />

      {/* Brands */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Brands</h4>
        <div className="space-y-2.5">
          {brandNames.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="border-[#D1D5DB] data-[state=checked]:bg-[#6366F1] data-[state=checked]:border-[#6366F1]"
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm text-gray-600 cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-[#D1D5DB] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <SectionHeading
              title="Shop "
              highlight="Products"
              description={`${totalProducts} products found`}
            />
            <div className="flex items-center gap-3">
              {/* Mobile filter trigger */}
              <Sheet>
                <SheetTrigger className="lg:hidden border border-[#6366F1] text-[#6366F1] h-8 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#6366F1]/10 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </SheetTrigger>
                <SheetContent side="left" className="w-72 overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filter Products</SheetTitle>
                  </SheetHeader>
                  {renderFilterSidebar()}
                </SheetContent>
              </Sheet>

              <Select
                value={sortBy}
                onValueChange={(val: any) => setSortBy(val || "")}
              >
                <SelectTrigger className="w-44 h-9 border-[#D1D5DB] text-sm rounded">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="new">New Arrivals</SelectItem>
                  <SelectItem value="best-seller">Best Sellers</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border border-[#D1D5DB] rounded p-0.5">
                <Button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    view === "grid"
                      ? "bg-[#6366F1] text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    view === "list"
                      ? "bg-[#6366F1] text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-md border border-[#D1D5DB] p-5 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#6366F1]" />
                Filter Products
              </h3>
              {renderFilterSidebar()}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                }
              >
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <ProductCardSkeleton key={i} view={view} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🔍</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-[#6366F1] hover:bg-[#4F46E5]"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  ref={gridRef}
                  className={
                    view === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 gap-5"
                      : "flex flex-col gap-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      view={view}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-[#D1D5DB]"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === i + 1
                            ? "bg-[#6366F1] text-white"
                            : "bg-white border border-[#D1D5DB] text-gray-600 hover:border-[#6366F1] hover:text-[#6366F1]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-[#D1D5DB]"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-64">
          <p className="text-gray-500">Loading products...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
