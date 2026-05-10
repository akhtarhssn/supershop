"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";
import {
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  User,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";

const navItems = [
  { id: "overview", label: "Dashboard", href: "/account", icon: LayoutGrid },
  { id: "orders", label: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { id: "settings", label: "Settings", href: "/account/settings", icon: Settings },
];

export const statusColors: Record<string, string> = {
  delivered: "bg-green-50 text-green-700",
  shipped: "bg-blue-50 text-blue-700",
  processing: "bg-yellow-50 text-yellow-700",
  pending: "bg-orange-50 text-orange-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isMounted, isAuthenticated, router]);

  const { data, isLoading } = useGetMyOrdersQuery(undefined);
  const orders = data?.data || [];

  // If non-buyer tries to access account, show 404
  if (isMounted && isAuthenticated && user?.role !== "buyer") {
    return notFound();
  }

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully.");
    router.push("/");
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F3F4F6]">
        <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (user?.role !== "buyer") return notFound();

  return (
    <div className="min-h-screen bg-[#F9FAFB] selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ─── Sidebar ────────────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-8">
              {/* Profile Brief */}
              <div className="flex flex-col items-center text-center p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="relative mb-4">
                  <Avatar className="w-20 h-20 ring-4 ring-indigo-50 ring-offset-4 ring-offset-white">
                    <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                    <AvatarFallback className="bg-indigo-500 text-white font-bold">{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-[#6366F1] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                    <User className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <h2 className="font-black text-gray-900 tracking-tight">{user?.name}</h2>
                <p className="text-xs font-semibold text-gray-400 truncate w-full px-2 mt-0.5">{user?.email}</p>

                <div className="flex gap-6 mt-6 pt-6 border-t border-gray-50 w-full">
                  <div className="flex-1">
                    <p className="font-black text-gray-900">{orders.length}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                  </div>
                  <Separator orientation="vertical" className="h-8 self-center" />
                  <div className="flex-1">
                    <p className="font-black text-gray-900">{wishlistItems.length}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saved</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all group",
                        active
                          ? "bg-[#6366F1] text-white shadow-xl shadow-indigo-600/20"
                          : "text-gray-500 hover:bg-white hover:text-gray-900"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-white" : "text-gray-400 group-hover:text-gray-600")} />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all group"
                  >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* ─── Main Content ───────────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
