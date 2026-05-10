'use client'

import { toast } from "sonner";
import {
  Lock,
  Bell,
  ShieldAlert,
  Check,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";
import { useState } from "react";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifs, setNotifs] = useState({
    orders: true,
    newsletter: false,
    newProducts: true,
    priceDrops: true,
  });

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification settings updated.");
  };

  return (
    <section className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gray-100 rounded-xl">
          <Settings className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Settings</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
            Privacy, security & notifications
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Password Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Security</h3>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Current Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
              />
            </div>

            <Button
              className="w-full sm:w-auto px-8 bg-[#6366F1] hover:bg-[#4F46E5] h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20"
              onClick={() => toast.success("Password updated successfully!")}
            >
              Update Security
            </Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          </div>

          <div className="divide-y divide-gray-50">
            {[
              { id: "orders", label: "Order Status Updates", desc: "Get real-time updates on your shipping and delivery status." },
              { id: "newsletter", label: "Newsletter & Promotions", desc: "Weekly digest of the best deals and new arrivals." },
              { id: "newProducts", label: "New Product Alerts", desc: "Be the first to know when brands you follow release new items." },
              { id: "priceDrops", label: "Price Drop Alerts", desc: "Instant alerts when items in your wishlist go on sale." },
            ].map((notif) => (
              <div key={notif.id} className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-gray-900">{notif.label}</p>
                  <p className="text-xs text-gray-400 max-w-sm">{notif.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(notif.id as any)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    notifs[notif.id as keyof typeof notifs] ? "bg-[#6366F1]" : "bg-gray-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                    notifs[notif.id as keyof typeof notifs] ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-50/50 rounded-[2rem] border border-rose-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-rose-900">Danger Zone</h3>
          </div>

          <p className="text-sm text-rose-700/70 mb-6 max-w-md">
            Deleting your account is permanent and will remove all your order history, wishlist items, and earned rewards points.
          </p>

          <Button
            variant="destructive"
            className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-rose-600/10"
            onClick={() => toast.error("Please contact support to delete your account.")}
          >
            Delete My Account
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SettingsPage