"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Heart, ShoppingCart, User, Menu, ChevronDown,
  LayoutDashboard, LogOut, Settings, Package, ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { CartSheet } from "@/components/cart/CartSheet";
import { api } from "@/lib/api-client";
import Image from "next/image";
import { toast } from "sonner";
import NotificationBell from "./NotificationBell";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Sellers", href: "/sellers" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  superAdmin: { label: "Super Admin", color: "bg-purple-100 text-purple-700" },
  admin: { label: "Admin", color: "bg-blue-100 text-blue-700" },
  seller: { label: "Seller", color: "bg-amber-100 text-amber-700" },
  buyer: { label: "Buyer", color: "bg-green-100 text-green-700" },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);

  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
    api.categories.getAll().then((res) => setCategories(res.data || [])).catch(console.error);
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully.", { position: "bottom-right" });
    router.push("/");
  };

  const roleMeta = user ? ROLE_BADGE[user.role] : null;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-50">
      <div className={cn("bg-white transition-shadow duration-300", isScrolled ? "shadow-md" : "shadow-sm")}>
        <div className="max-w-7xl mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between lg:justify-start gap-3 lg:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image src="/logo.png" width={160} height={160} alt="logo" className="w-24 lg:w-32 rounded-2xl" />
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 items-center max-w-2xl">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center rounded-md border border-r-0 border-[#e8e8f0] bg-white text-sm text-gray-600 h-11 px-3 gap-1 shrink-0 hover:bg-gray-50 transition-colors">
                  All Categories <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {categories.map((cat) => (
                    <Link key={cat._id} href={`/shop?category=${cat.slug}`} className="w-full">
                      <DropdownMenuItem>{cat.name}</DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && searchQuery) router.push(`/shop?q=${searchQuery}`); }}
                className="rounded-none border-x-0 h-11 focus-visible:ring-0 focus-visible:border-[#635ad9] border-[#e8e8f0]"
              />
              <Button
                className="rounded-l-none h-11 bg-[#635ad9] hover:bg-[#4f46e5] text-white px-5 shrink-0"
                onClick={() => { if (searchQuery) router.push(`/shop?q=${searchQuery}`); }}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn("text-sm font-medium transition-colors",
                    pathname === link.href ? "text-[#635ad9]" : "text-gray-700 hover:text-[#635ad9]"
                  )}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0 ml-auto lg:ml-0">
              {/* Wishlist */}
              <Link href="/account/wishlist" className="hidden sm:block relative p-2 text-gray-600 hover:text-[#6366F1] transition-colors">
                <Heart className="w-5 h-5" />
                {isMounted && wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-[#fbb400] text-black text-[10px] border-0">{wishlistCount}</Badge>
                )}
              </Link>

              {/* Cart */}
              <CartSheet>
                <div className="relative p-2 text-gray-600 hover:text-[#6366F1] transition-colors focus:outline-none">
                  <ShoppingCart className="w-5 h-5" />
                  {isMounted && cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-[#635ad9] text-white text-[10px] border-0">{cartCount}</Badge>
                  )}
                </div>
              </CartSheet>

              {/* Notifications */}
              {isAuthenticated && (
                <NotificationBell />
              )}

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 rounded-full hover:ring-2 hover:ring-[#6366F1]/30 transition-all">
                  {isMounted && isAuthenticated && user ? (
                    <Avatar className="w-8 h-8">
                      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                      <AvatarFallback className="bg-[#6366F1] text-white text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="p-1 text-gray-600 hover:text-[#635ad9]"><User className="w-5 h-5" /></div>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  {isMounted && isAuthenticated && user ? (
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="pb-2">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 font-normal truncate">{user.email}</p>
                        <span className={cn("inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium", roleMeta?.color)}>
                          {roleMeta?.label}
                        </span>
                        {!user.isEmailVerified && (
                          <div className="mt-1.5 flex items-center gap-1 text-amber-600 text-xs">
                            <ShieldCheck className="w-3 h-3" /> Email not verified
                          </div>
                        )}
                      </DropdownMenuLabel>
                      <Link href={`${user.role === "seller" || user.role === 'admin' || user.role === 'superAdmin' ? "/dashboard" : "/account"}`} className="w-full">
                        <DropdownMenuItem className="gap-2"><User className="size-4" />{user.role === "seller" || user.role === 'admin' || user.role === 'superAdmin' ? "Dashboard" : "My Account"}</DropdownMenuItem>
                      </Link>
                      <Link href={`${user.role === "seller" || user.role === 'admin' || user.role === 'superAdmin' ? "/dashboard/orders" : "/account/orders"}`} className="w-full">
                        <DropdownMenuItem className="gap-2"><Package className="size-4" />{user.role === "seller" || user.role === 'admin' || user.role === 'superAdmin' ? "Orders" : "My Orders"}</DropdownMenuItem>
                      </Link>
                      <Link href={`${user.role === "seller" || user.role === 'admin' || user.role === 'superAdmin' ? "/dashboard/settings" : "/account/settings"}`} className="w-full">
                        <DropdownMenuItem className="gap-2"><Settings className="size-4" />Settings</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="size-4" />Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  ) : (
                    <>
                      <Link href="/account" className="w-full"><DropdownMenuItem>My Account</DropdownMenuItem></Link>
                      <Link href="/account/orders" className="w-full"><DropdownMenuItem>My Orders</DropdownMenuItem></Link>
                      <Link href="/account/wishlist" className="w-full"><DropdownMenuItem>Wishlist</DropdownMenuItem></Link>
                      <DropdownMenuSeparator />
                      <Link href="/auth/login" className="w-full"><DropdownMenuItem>Sign In</DropdownMenuItem></Link>
                      <Link href="/auth/signup" className="w-full"><DropdownMenuItem>Create Account</DropdownMenuItem></Link>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="p-6 border-b bg-[#635ad9] text-white">
                    <SheetTitle className="text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                      </div>
                      SuperShop
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="p-4 flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                        className={cn("px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          pathname === link.href ? "bg-[#f5f3ff] text-[#635ad9]" : "text-gray-700 hover:bg-gray-50"
                        )}>
                        {link.label}
                      </Link>
                    ))}
                    <div className="my-2 border-t" />
                    {isMounted && isAuthenticated ? (
                      <>
                        <Link href="/account" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">My Account</Link>
                        <Link href="/account/orders" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">My Orders</Link>
                        <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Wishlist</Link>
                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Dashboard</Link>
                        <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 text-left">Sign Out</button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Sign In</Link>
                        <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium bg-[#635ad9] text-white text-center">Register</Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 flex lg:hidden items-center w-full">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && searchQuery) router.push(`/shop?q=${searchQuery}`); }}
              className="rounded-r-none h-10 focus-visible:ring-0 focus-visible:border-[#635ad9] border-[#e8e8f0]"
            />
            <Button
              className="rounded-l-none h-10 bg-[#635ad9] hover:bg-[#4f46e5] text-white px-4 shrink-0"
              onClick={() => { if (searchQuery) router.push(`/shop?q=${searchQuery}`); }}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category strip */}
        <div className="border-t border-[#e8e8f0] hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <Link key={cat._id} href={`/shop?category=${cat.slug}`}
                className="text-xs font-medium text-gray-600 hover:text-[#635ad9] whitespace-nowrap transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}