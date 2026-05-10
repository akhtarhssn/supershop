/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/store/auth";
import {
  useGetMyStoreQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
} from "@/redux/api/storeApi";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bell, Shield, Store, Upload, User, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import Image from "next/image";
import ProfileSettings from "@/components/dashboard-profile";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File[]>([]);
  const [bannerFile, setBannerFile] = useState<File[]>([]);

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  // RTK Query hooks
  const { data: storeResponse, isLoading: loadingStore } = useGetMyStoreQuery(
    undefined,
    {
      skip: user?.role !== "seller",
    },
  );
  const [createStore] = useCreateStoreMutation();
  const [updateStore] = useUpdateStoreMutation();

  const store = storeResponse?.data;

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    // Profile update logic could go here
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Profile updated successfully!");
  };

  const handleStoreSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      supportEmail: formData.get("email"),
      supportPhone: formData.get("phone"),
    };

    const submitData = new FormData();

    // attach JSON
    submitData.append("data", JSON.stringify(payload));

    // attach files
    if (logoFile[0]) {
      submitData.append("logo", logoFile[0]);
    }

    if (bannerFile[0]) {
      submitData.append("banner", bannerFile[0]);
    }

    try {
      if (store) {
        await updateStore({
          id: store._id,
          data: submitData,
        }).unwrap();

        toast.success("Store updated successfully!");
      } else {
        await createStore(submitData).unwrap();
        toast.success("Store created successfully!");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error.message || "Failed to save store",
      );
    } finally {
      setSaving(false);
    }
  };

  console.log({ store });

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your store and account preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="bg-white border border-[#D1D5DB] h-11 p-1 rounded-xl">
          {[
            { value: "profile", label: "Profile", icon: User },
            { value: "store", label: "Store", icon: Store },
            { value: "notifications", label: "Notifications", icon: Bell },
            { value: "security", label: "Security", icon: Shield },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs gap-1.5 rounded-lg data-[state=active]:bg-[#6366F1] data-[state=active]:text-white"
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile */}
        {/* <TabsContent value="profile">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl border border-[#D1D5DB] p-6 space-y-6 max-w-xl"
          >
            <h3 className="font-bold text-gray-900">Profile Information</h3>
            <div className="flex items-center gap-5">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                  }
                />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="border-[#6366F1] text-[#6366F1]"
              >
                Change Photo
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Full Name</Label>
                <Input
                  name="name"
                  defaultValue={user?.name}
                  className="border-[#D1D5DB]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  name="email"
                  defaultValue={user?.email}
                  type="email"
                  disabled
                  className="border-[#D1D5DB] bg-gray-50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Phone</Label>
                <Input
                  name="phone"
                  defaultValue={user?.phone}
                  className="border-[#D1D5DB]"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#6366F1] hover:bg-[#4F46E5]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </TabsContent> */}

        <TabsContent value="profile">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 max-w-2xl shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-500">
                  Update your personal details and account info
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  user?.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.status}
              </span>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-5">
              <Avatar className="w-20 h-20 border">
                <AvatarImage
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                  }
                />
                <AvatarFallback className="text-lg">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-[#6366F1] text-[#6366F1]"
                >
                  Change Photo
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-500">Full Name</Label>
                <Input
                  name="name"
                  defaultValue={user?.name}
                  className="border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-gray-500">Phone</Label>
                <Input
                  name="phone"
                  defaultValue={user?.phone}
                  className="border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-sm text-gray-500">Email</Label>
                <Input
                  name="email"
                  defaultValue={user?.email}
                  type="email"
                  disabled
                  className="border-gray-200 bg-gray-50 text-gray-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-sm text-gray-500">Address</Label>
                <Input
                  name="address"
                  defaultValue={user?.address}
                  placeholder="Enter your address"
                  className="border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Account Meta Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Role</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  {user?.role}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email Verification</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    user?.isEmailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user?.isEmailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Password</span>
                <span className="text-gray-400">
                  {user?.passwordChangedAt
                    ? `Changed ${new Date(
                        user.passwordChangedAt,
                      ).toLocaleDateString()}`
                    : "Never changed"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#6366F1] hover:bg-[#4F46E5] px-6"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* {user && <ProfileSettings user={user} />} */}

        {/* Store */}
        <TabsContent value="store">
          {user?.role !== "seller" ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-3">
              <Store className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                Not a Seller
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                Only seller accounts can manage a store. Contact support to
                upgrade.
              </p>
            </div>
          ) : loadingStore ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 flex justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form
              onSubmit={handleStoreSubmit}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-w-2xl shadow-sm"
            >
              {/* 🔥 HERO SECTION */}
              <div className="relative">
                {/* Banner */}
                <div className="relative group">
                  <Image
                    src={
                      (bannerFile[0] && URL.createObjectURL(bannerFile[0])) ||
                      store?.banner ||
                      "/placeholder-banner.jpg"
                    }
                    alt="Store Banner"
                    width={800}
                    height={300}
                    className="w-full h-44 object-cover"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                  <label className="absolute bottom-3 right-3 text-xs px-3 py-1 rounded-full bg-white/90 cursor-pointer shadow opacity-0 group-hover:opacity-100">
                    Change Banner
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        setBannerFile([e.target.files[0]])
                      }
                    />
                  </label>
                </div>

                {/* Logo */}
                <div className="absolute -bottom-10 left-6 group">
                  <Image
                    src={
                      (logoFile[0] && URL.createObjectURL(logoFile[0])) ||
                      store?.logo ||
                      "/placeholder-logo.png"
                    }
                    alt="Logo"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-white object-cover shadow"
                  />

                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 cursor-pointer">
                    Change
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && setLogoFile([e.target.files[0]])
                      }
                    />
                  </label>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 pt-14 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <Input
                      name="name"
                      defaultValue={store?.name}
                      placeholder="Store Name"
                      className="text-lg font-semibold border-none px-0 focus-visible:ring-0"
                    />
                    <p className="text-xs text-gray-500">
                      This is how your store appears publicly
                    </p>
                  </div>

                  {store && (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  )}
                </div>

                {!store && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    You haven’t created a store yet. Create one to start
                    selling.
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-500">
                    Store Description
                  </Label>
                  <textarea
                    name="description"
                    defaultValue={store?.description}
                    rows={3}
                    placeholder="Describe your store..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Contact */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm text-gray-500">
                      Support Email
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      defaultValue={store?.supportEmail}
                      placeholder="support@store.com"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm text-gray-500">
                      Support Phone
                    </Label>
                    <Input
                      name="phone"
                      defaultValue={store?.supportPhone}
                      placeholder="+1..."
                      className="border-gray-300"
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6"
                  >
                    {saving
                      ? "Saving..."
                      : store
                        ? "Save Changes"
                        : "Create Store"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6 space-y-5">
            <h3 className="font-bold text-gray-900">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "New Order Notifications",
                  desc: "Get notified when a new order is placed",
                },
                {
                  label: "Low Stock Alerts",
                  desc: "Alert when product stock falls below 10 units",
                },
                {
                  label: "Customer Reviews",
                  desc: "Get notified when a customer leaves a review",
                },
                {
                  label: "Payment Confirmations",
                  desc: "Receive payment success/failure notifications",
                },
                {
                  label: "Weekly Reports",
                  desc: "Receive weekly performance reports via email",
                },
                {
                  label: "Marketing Emails",
                  desc: "Receive tips and marketing recommendations",
                },
              ].map((notif) => (
                <div
                  key={notif.label}
                  className="flex items-start justify-between gap-4 py-3 border-b border-[#E5E7EB] last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {notif.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.desc}</p>
                  </div>
                  <div className="w-10 h-5 bg-[#6366F1] rounded-full relative cursor-pointer shrink-0 mt-0.5">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6 space-y-6 max-w-xl">
            <h3 className="font-bold text-gray-900">Security Settings</h3>
            <div className="space-y-4 max-w-sm">
              <h4 className="font-semibold text-gray-700 text-sm">
                Change Password
              </h4>
              {[
                { label: "Current Password", id: "currentPass" },
                { label: "New Password", id: "newPass" },
                { label: "Confirm New Password", id: "confirmPass" },
              ].map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label className="text-sm font-medium">{field.label}</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="border-[#D1D5DB]"
                  />
                </div>
              ))}
              <Button
                onClick={() => toast.success("Password updated!")}
                className="bg-[#6366F1] hover:bg-[#4F46E5]"
              >
                Update Password
              </Button>
            </div>

            <Separator className="bg-[#D1D5DB]" />

            <div>
              <h4 className="font-semibold text-gray-700 text-sm mb-3">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500 mb-3">
                Add an extra layer of security to your account.
              </p>
              <Button
                variant="outline"
                className="border-[#6366F1] text-[#6366F1]"
              >
                Enable 2FA
              </Button>
            </div>

            <Separator className="bg-[#D1D5DB]" />

            <div>
              <h4 className="font-semibold text-red-500 text-sm mb-3">
                Danger Zone
              </h4>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  toast.error("This action requires additional confirmation.")
                }
              >
                Delete Account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
