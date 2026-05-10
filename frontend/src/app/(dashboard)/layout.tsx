"use client";

import { usePathname, useRouter, notFound } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Grid3X3,
  Phone,
  Handshake,
  Wrench,
  FileText,
  Star,
  LogOut,
  Bell,
  Search,
  Menu,
  Users,
  Store,
  Heart,
  Settings,
  ShieldCheck,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";
import NotificationBell from "@/components/layout/NotificationBell";

// ─── Nav items per role ───────────────────────────────────────────────────────
const SUPER_ADMIN_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Order list", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: Grid3X3 },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Partners", href: "/dashboard/partners", icon: Handshake },
  { label: "Services", href: "/dashboard/services", icon: Wrench },
  { label: "Blog", href: "/dashboard/blog", icon: FileText },
  { label: "Brand", href: "/dashboard/brand", icon: Star },
  { label: "Contact Info", href: "/dashboard/contact-info", icon: Phone },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const SELLER_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Earnings", href: "/dashboard/earnings", icon: LayoutDashboard },
  { label: "My Store", href: "/dashboard/settings", icon: Store },
];

function getNavItems(role?: string) {
  if (role === "superAdmin" || role === "admin") return SUPER_ADMIN_NAV;
  if (role === "seller") return SELLER_NAV;
  return [];
}

const ROLE_COLOR: Record<string, string> = {
  superAdmin: "text-purple-400",
  admin: "text-blue-400",
  seller: "text-amber-400",
  buyer: "text-green-400",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function SidebarContent({
  pathname,
  onLogout,
}: {
  pathname: string;
  onLogout: () => void;
}) {
  const { user } = useAuthStore();
  const navItems = getNavItems(user?.role);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  console.log({ user });
  return (
    <div className="flex flex-col h-full bg-[#000000]">
      {/* Avatar */}
      <div className="p-8 flex flex-col items-center justify-center border-b border-white/5">
        <Avatar className="w-20 h-20 mb-4 border-2 border-white/10">
          {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className="bg-[#6366F1] text-white text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold text-lg tracking-wide mb-0.5">
          {user?.name || "Guest"}
        </span>
        <p className="text-white/60 text-xs truncate max-w-full px-4 text-center">
          {user?.email}
        </p>
        {user?.role && (
          <span
            className={cn(
              "text-xs font-medium mt-1 capitalize",
              ROLE_COLOR[user.role],
            )}
          >
            {user.role === "superAdmin" ? "Super Admin" : user.role}
          </span>
        )}
        {user && !user.isEmailVerified && (
          <div className="mt-2 flex items-center gap-1 bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded-lg">
            <ShieldCheck className="w-3 h-3" /> Email not verified
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-4 py-6 space-y-2 overflow-y-auto"
        data-lenis-prevent
      >
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  active
                    ? "text-white"
                    : "text-white/40 group-hover:text-white/80",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

function EmailVerificationBanner() {
  const { user, setUser } = useAuthStore();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const COOLDOWN_KEY = "verify_resend_ts";
  const COOLDOWN_SECONDS = 60;

  // Restore cooldown from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COOLDOWN_KEY);
    if (stored) {
      const elapsed = Math.floor((Date.now() - parseInt(stored)) / 1000);
      const remaining = COOLDOWN_SECONDS - elapsed;
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || sending) return;
    setSending(true);
    setSent(false);
    try {
      await api.auth.resendVerificationEmail();
      setSent(true);
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      setCooldown(COOLDOWN_SECONDS);
      toast.success("Verification email sent! Check your inbox.", {
        position: "bottom-right",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send email";
      toast.error(message, { position: "bottom-right" });
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerified = async () => {
    setChecking(true);
    try {
      const res = await api.auth.getMe();
      const updatedUser = res.data;
      setUser(updatedUser);
      if (updatedUser.isEmailVerified) {
        toast.success("Email verified! Welcome to your dashboard.", {
          position: "bottom-right",
        });
      } else {
        toast.error(
          "Email not verified yet. Please check your inbox and click the link.",
          {
            position: "bottom-right",
            style: { color: "#ff2626" },
          },
        );
      }
    } catch {
      toast.error("Could not check verification status. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg text-center py-20 px-6">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
        <Mail className="w-9 h-9 text-amber-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
        Verify Your Email
      </h2>
      <p className="text-gray-500 text-sm mb-2">
        Your account is pending email verification. Please check your inbox and
        click the verification link we sent to{" "}
        <span className="font-semibold text-gray-700">{user?.email}</span>.
      </p>
      <p className="text-xs text-gray-400 mb-8">
        The link expires in 24 hours.
      </p>

      {sent && (
        <div className="mb-4 flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Email sent! Check your inbox.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {/* I've verified — re-fetches user from API */}
        <Button
          className="bg-[#6366F1] hover:bg-[#4F46E5] font-semibold px-6"
          onClick={handleCheckVerified}
          disabled={checking}
        >
          {checking ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Checking…
            </span>
          ) : (
            "I've Verified My Email"
          )}
        </Button>

        {/* Send Again with cooldown */}
        <Button
          variant="outline"
          className="px-6 border-[#E5E7EB] gap-2 font-semibold"
          onClick={handleResend}
          disabled={cooldown > 0 || sending}
        >
          {sending ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Sending…
            </>
          ) : cooldown > 0 ? (
            <>
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold tabular-nums">
                {cooldown}
              </span>
              Send Again
            </>
          ) : (
            "Send Again"
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not logged in or if buyer (buyers go to /account)
  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F3F4F6]">
        <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  // If buyer tries to access dashboard, show 404
  if (isMounted && isAuthenticated && user?.role === "buyer") {
    return notFound();
  }

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully.", { position: "bottom-right" });
    router.push("/");
  };

  const navItems = getNavItems(user?.role);
  const currentPageLabel =
    navItems.find(
      (n) =>
        pathname === n.href ||
        (n.href !== "/dashboard" && pathname.startsWith(n.href)),
    )?.label || "Dashboard";

  // Redirect if not logged in
  if (!isAuthenticated) return null;

  // If buyer tries to access dashboard, show 404 immediately
  if (user?.role === "buyer") {
    return notFound();
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 h-full">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white px-8 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger className="md:hidden p-2 mt-1 -ml-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 bg-[#000000] w-72 border-r-0"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent pathname={pathname} onLogout={handleLogout} />
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold text-gray-900 capitalize">
              {currentPageLabel}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-9 h-10 w-64 text-sm bg-gray-50 border-transparent focus-visible:ring-0 focus-visible:bg-white focus-visible:border-[#6366F1]"
              />
            </div>
            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}
            <Link href="/" className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                className="font-semibold px-4 border-[#E5E7EB]"
              >
                View Store
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content — show verification gate if not verified */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8" data-lenis-prevent>
          {user && !user.isEmailVerified ? (
            <EmailVerificationBanner />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
