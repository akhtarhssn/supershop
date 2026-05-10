"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useUpdateOrderStatusMutation } from "@/redux/api/orderApi";

const statusColors: Record<string, string> = {
  delivered: "bg-green-50 text-green-700 border-green-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  pending: "bg-orange-50 text-orange-700 border-orange-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const tabs = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateStatus] = useUpdateOrderStatusMutation();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.searchTerm = search;
      if (activeTab !== "All") params.status = activeTab;

      const res = await api.orders.getAll(params);
      const fetchedItems = res.data?.result || res.data || [];
      const meta = res.data?.meta || {};

      setOrders(fetchedItems);
      setTotal(meta.total || fetchedItems.length);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeTab, page, limit]);

  const totalPages = Math.ceil(total / limit) || 1;

  console.log({ orders });

  return (
    <div className="space-y-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{total} total orders</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 border-[#D1D5DB]">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 pb-1 bg-white rounded-xl border border-[#D1D5DB] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
              activeTab === tab
                ? "bg-[#6366F1] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Limit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search orders or customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8 h-9 text-sm border-[#D1D5DB]"
          />
        </div>

        {/* Items per page limit */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <select
            title="Item Limit"
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
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3.5 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const oId = order.id || order._id;
                  const customerName =
                    order.user?.name || order.customer?.name || "Guest";
                  const customerEmail =
                    order.user?.email || order.customer?.email || "";
                  const customerAvatar =
                    order.user?.avatar || order.customer?.avatar;

                  return (
                    <tr
                      key={oId}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-medium text-[#6366F1] text-xs">
                          {order.orderNumber || oId.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={customerAvatar} />
                            <AvatarFallback className="text-[10px]">
                              {customerName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 text-xs">
                              {customerName}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        {order.items?.length || order.products?.length || 0}{" "}
                        items
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 text-sm">
                          {formatPrice(order.totalPrice || order.total || 0)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize text-[10px] border",
                            statusColors[(order.status || "").toLowerCase()] ||
                              statusColors.pending,
                          )}
                        >
                          {order.status || "Pending"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize text-[10px] border",
                            (order.paymentStatus || "").toLowerCase() === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : (order.paymentStatus || "").toLowerCase() ===
                                  "pending"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-red-50 text-red-700 border-red-200",
                          )}
                        >
                          {order.paymentStatus || "Pending"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link
                              href={`/dashboard/orders/${oId}`}
                              className="w-full"
                            >
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  await updateStatus({
                                    id: oId,
                                    status: "processing",
                                  }).unwrap();
                                  toast.success("Order marked as processing");
                                } catch (error) {
                                  toast.error("Failed to update order status");
                                }
                              }}
                            >
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  await updateStatus({
                                    id: oId,
                                    status: "shipped",
                                  }).unwrap();
                                  toast.success("Order marked as shipped");
                                } catch (error) {
                                  toast.error("Failed to update order status");
                                }
                              }}
                            >
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  await updateStatus({
                                    id: oId,
                                    status: "cancelled",
                                  }).unwrap();
                                  toast.success("Order marked as cancelled");
                                } catch (error) {
                                  toast.error("Failed to update order status");
                                }
                              }}
                              className="text-red-500"
                            >
                              Cancel Order
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
              Showing{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
