"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  FileText,
  Package,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { weeklyRevenueData } from "@/lib/mock-data"; // Keeping chart data mock for now unless there's an API for it
import { useRouter } from "next/navigation";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0, // Using users as customers
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await api.dashboard.getStats();
        if (statsRes.success) {
          setStats({
            revenue: statsRes?.data?.revenue || 0,
            orders: statsRes?.data?.orders || 0,
            customers: statsRes?.data?.users || 0,
          });
        }

        // Fetch recent orders
        const ordersRes = await api.orders.getAll({ limit: 5 });
        const fetchedOrders = ordersRes.data?.result || ordersRes.data || [];
        setRecentOrders(fetchedOrders);
      } catch (error: unknown) {
        console.error(error);
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          error.message === "jwt expired"
        ) {
          router.push("/auth/login");
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Total Income",
      value: formatPrice(stats.revenue),
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: stats.orders.toLocaleString(),
      icon: ShoppingBag,
    },
    {
      label: "Total Customers",
      value: stats.customers.toLocaleString(),
      icon: Users,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-xl border border-[#E5E7EB]">
        <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl border border-[#E5E7EB] min-h-[calc(100vh-8rem)]">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#F3F4F6] rounded-2xl p-6 flex flex-col justify-between items-start relative h-32"
            >
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>

              <Icon className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 stroke-[1.5]" />
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chart Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Overview</h3>
            <div className="flex items-center gap-6">
              <div className="flex gap-4 text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5 before:w-2 before:h-2 before:rounded-full before:bg-[#2563EB]">
                  Income
                </span>
                <span className="flex items-center gap-1.5 before:w-2 before:h-2 before:rounded-full before:bg-[#10B981]">
                  Order
                </span>
                <span className="flex items-center gap-1.5 before:w-2 before:h-2 before:rounded-full before:bg-gray-300">
                  Total Customer
                </span>
              </div>
              <select className="text-xs font-medium text-gray-500 bg-transparent focus:outline-none border-0 pr-4">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          {/* Chart Area */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyRevenueData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#1F2937" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#D1D5DB"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order List Table */}
          <div className="pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Button
                asChild
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs px-6 py-2 h-auto rounded-lg"
              >
                <Link href="/dashboard/orders">See All</Link>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-900 border-b border-[#E5E7EB]">
                    <th className="pb-4 font-bold">Order number</th>
                    <th className="pb-4 font-bold">Name</th>
                    <th className="pb-4 font-bold">Email address</th>
                    <th className="pb-4 font-bold">Items</th>
                    <th className="pb-4 font-bold">Price</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-gray-400"
                      >
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        No recent orders
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => {
                      const oId = order.id || order._id;
                      const customerName =
                        order.user?.name || order.customer?.name || "Guest";
                      const customerEmail =
                        order.user?.email || order.customer?.email || "";
                      const itemsCount =
                        order.items?.length || order.products?.length || 0;

                      return (
                        <tr
                          key={oId}
                          className="text-gray-600 hover:bg-[#F9FAFB] transition-colors"
                        >
                          <td className="py-4">
                            <span className="font-mono text-[#6366F1] font-medium text-xs">
                              {order.orderNumber || oId.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 font-medium text-gray-900">
                            {customerName}
                          </td>
                          <td className="py-4">{customerEmail}</td>
                          <td className="py-4">{itemsCount} items</td>
                          <td className="py-4 font-bold text-gray-900">
                            {formatPrice(order.totalPrice || order.total || 0)}
                          </td>
                          <td className="py-4 capitalize text-xs">
                            <span
                              className={`px-2 py-1 rounded-full border ${order.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                          <td className="py-4">
                            <Link
                              href={`/dashboard/orders/${oId}`}
                              className="text-gray-400 hover:text-gray-900 block border border-gray-200 rounded p-1.5 w-max"
                            >
                              <FileText className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
