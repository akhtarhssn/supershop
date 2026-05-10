"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { useDeleteProductMutation, useGetProductsQuery, useGetMyProductsQuery } from "@/redux/api/productApi";
import { useAuthStore } from "@/store/auth";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";


export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { user } = useAuthStore();
  const isSeller = user?.role === "seller";

  // RTK Query hooks
  const allProductsQuery = useGetProductsQuery({
    page,
    limit,
    searchTerm: search,
  }, { skip: isSeller });

  const myProductsQuery = useGetMyProductsQuery(undefined, { skip: !isSeller });

  const [deleteProduct] = useDeleteProductMutation();

  const response = isSeller ? myProductsQuery.data : allProductsQuery.data;
  const isLoading = isSeller ? myProductsQuery.isLoading : allProductsQuery.isLoading;
  const isFetching = isSeller ? myProductsQuery.isFetching : allProductsQuery.isFetching;

  const items = response?.data?.result || response?.data || [];
  const total = response?.data?.meta?.total || items.length;

  const handleDelete = async (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      toast.success("Product deleted.");
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{total} products total</p>
        </div>
        <Button asChild className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2">
          <Link href="/dashboard/products/add">
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search & Limit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // reset to first page on search
              }}
              className="pl-8 h-9 text-sm border-[#D1D5DB]"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-[#D1D5DB]">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </Button>
        </div>

        {/* Items per page limit */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="h-9 rounded-md border border-[#D1D5DB] text-sm px-2 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D1D5DB] bg-[#F9FAFB]">
                {["Product", "Category", "Price", "Stock", "Status", "Rating", ""].map((h) => (
                  <th key={h} className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                items.map((product: any) => {
                  const pId = product._id;
                  const catName = typeof product.category === "object" ? product.category?.name : product.category;
                  const image = product.image || (product.images && product.images[0]) || "/placeholder.jpg";

                  return (
                    <tr key={pId} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F9FAFB] shrink-0 border border-gray-100">
                            <Image src={image} alt={product.name}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-xs line-clamp-1 max-w-[160px]">
                              {product.name}
                            </p>
                            {product.brand && <p className="text-[10px] text-gray-400">{product.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="secondary" className="text-[10px] bg-[#EEF2FF] text-[#6366F1] border-0">
                          {catName || "Uncategorized"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</p>
                          {(product.originalPrice ?? 0) > product.price && (
                            <p className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice!)}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            product.stock <= 5 ? "text-red-500" : product.stock <= 20 ? "text-orange-500" : "text-[#4baf4f]"
                          )}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {product.isFeatured && (
                            <Badge className="text-[9px] bg-[#6366F1] text-white border-0 px-1.5 py-0 w-fit">Featured</Badge>
                          )}
                          {product.isBestSeller && (
                            <Badge className="text-[9px] bg-[#fbb400] text-black border-0 px-1.5 py-0 w-fit">Best Seller</Badge>
                          )}
                          {product.isOrganic && (
                            <Badge className="text-[9px] bg-[#4baf4f] text-white border-0 px-1.5 py-0 w-fit">Organic</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-[#fbb400] text-xs">★</span>
                          <span className="text-xs font-medium">{product.rating || 0}</span>
                          <span className="text-[10px] text-gray-400">({product.reviewCount || 0})</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {product.slug && (
                              <Link href={`/shop/${product.slug}`} target="_blank" className="w-full">
                                <DropdownMenuItem>
                                  View on Site
                                </DropdownMenuItem>
                              </Link>
                            )}
                            <Link href={`/dashboard/products/${pId}/edit`} className="w-full">
                              <DropdownMenuItem>
                                <Edit className="w-3.5 h-3.5 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500 cursor-pointer"
                              onClick={() => handleDelete(pId)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <div className="px-4 py-3 border-t border-[#D1D5DB] flex items-center justify-between bg-gray-50 mt-auto">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
              <span className="font-medium">{total}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium px-2">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-[#D1D5DB]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete It!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
