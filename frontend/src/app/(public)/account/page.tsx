"use client";

import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Edit3,
  MapPin,
  ChevronRight,
  CreditCard,
  Bell,
  Wallet,
  Clock,
  CheckCircle2,
  Package,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { toast } from "sonner";

export default function AccountPage() {
  const { user, setUser } = useAuthStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const { data: ordersData } = useGetMyOrdersQuery(undefined);
  const orders = ordersData?.data || [];

  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [address, setAddress] = useState(user?.address || "");

  // Real stats calculation
  const totalSpent = orders.reduce((acc: number, order: any) => acc + (order.total || 0), 0);
  const activeOrders = orders.filter((order: any) => order.status !== 'delivered' && order.status !== 'cancelled').length;

  const stats = [
    { label: "Total Spent", value: formatPrice(totalSpent), icon: Wallet, color: "bg-blue-500" },
    { label: "Active Orders", value: activeOrders.toString(), icon: Package, color: "bg-amber-500" },
    { label: "Wishlist Items", value: wishlistItems.length.toString(), icon: Heart, color: "bg-rose-500" },
    { label: "Rewards Points", value: "850", icon: Star, color: "bg-emerald-500" },
  ];

  const handleUpdateAddress = async () => {
    try {
      const res = await api.users.updateProfile({ address });
      if (res.success) {
        setUser(res.data);
        toast.success("Shipping address updated!");
        setIsUpdatingAddress(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update address");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* ─── Hero Section ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1E1B4B] to-[#312E81] p-8 text-white shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl">
              <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
              <AvatarFallback className="bg-indigo-500 text-2xl font-bold">{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[#1E1B4B] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <Badge className="bg-white/10 hover:bg-white/20 border-white/20 text-indigo-100 backdrop-blur-sm">
                Gold Member
              </Badge>
            </div>
            <p className="text-indigo-200/80 max-w-lg">
              Manage your orders, edit your profile, and track your loyalty rewards all in one place.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl shadow-lg shadow-indigo-600/30">
              Check Rewards
            </Button>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-100px] left-[10%] w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
      </section>

      {/* ─── Stats Grid ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2.5 rounded-xl text-white shadow-lg", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-2xl font-black text-gray-900 mb-0.5 tracking-tight">{stat.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Main Content Grid ───────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Recent Orders (Left/Main Column) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <Link href="/account/orders" className="text-sm font-bold text-[#6366F1] hover:underline">
              View All History
            </Link>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 3).map((order: any) => (
              <div key={order._id || order.id} className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                      <ShoppingBag className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Order #{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 font-medium">{formatDate(order.createdAt)} • {order.products?.length || 0} Items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">{formatPrice(order.total)}</p>
                    <Badge variant="outline" className={cn("mt-1 capitalize text-[10px] font-bold px-2 py-0 border-0",
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    )}>
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {order.products?.map((item: any, i: number) => (
                    <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                      <img src={item.product?.image || item.product?.productImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.products?.length > 4 && (
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                      +{order.products.length - 4}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-bold text-gray-500">Fast Delivery Choice</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg" asChild>
                    <Link href={`/account/orders/${order._id || order.id}`}>Track Shipment</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              Quick Management
            </h3>
            <div className="space-y-2">
              <Dialog open={isUpdatingAddress} onOpenChange={setIsUpdatingAddress}>
                <DialogTrigger>
                  <div className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-blue-50">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <span className="block text-sm font-bold text-gray-700">Shipping Address</span>
                      {user?.address && <p className="text-[10px] text-gray-400 truncate">{user.address}</p>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update Shipping Address</DialogTitle>
                    <DialogDescription>
                      This address will be pre-filled when you go to checkout.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <textarea
                        id="address"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your full shipping address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUpdatingAddress(false)}>Cancel</Button>
                    <Button onClick={handleUpdateAddress} className="bg-[#6366F1] hover:bg-[#4F46E5]">Save Address</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {[
                { label: "Payment Methods", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Communication", icon: Bell, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Support Tickets", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
              ].map((action) => (
                <button key={action.label} className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", action.bg)}>
                    <action.icon className={cn("w-5 h-5", action.color)} />
                  </div>
                  <span className="flex-1 text-left text-sm font-bold text-gray-700">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#000000] p-6 text-white">
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-2">Upgrade to Prime</h3>
              <p className="text-white/60 text-xs mb-4">Get free shipping on all orders and exclusive member-only deals.</p>
              <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] h-10 text-xs font-bold rounded-xl">
                Upgrade Now
              </Button>
            </div>
            {/* Background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl" />
          </div>
        </div>

      </div>
    </div>
  );
}
