"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useGetMeQuery, useLoginMutation } from "@/redux/api/authApi";
import { useAuthStore } from "@/store/auth";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = { email: string; password: string };

const ROLE_DASHBOARD: Record<string, string> = {
  superAdmin: "/dashboard",
  admin: "/dashboard",
  seller: "/dashboard",
  buyer: "/account",
};

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [login] = useLoginMutation();
  const { data: meRes, refetch: refetchMe } = useGetMeQuery();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // 1. Login
      const loginRes = await login(data).unwrap();
      const accessToken = loginRes.accessToken;

      setAuth(null, accessToken);

      // 3. Fetch user
      const meRes = await refetchMe().then((res) => res.data);
      const user = meRes?.data;

      // 4. Save to Zustand
      if (!user) throw new Error("Failed to fetch user");
      setAuth(user, accessToken);

      toast.success(`Welcome back, ${user.name}!`);

      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get("redirect");
      const destination = redirectParam || ROLE_DASHBOARD[user.role] || "/";

      router.push(destination);
    } catch (err: any) {
      console.log("LOGIN ERROR 👉", err);
      toast.error(err?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#6366F1] to-[#4F46E5] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded bg-white"
              style={{
                width: `${40 + ((i * 17) % 120)}px`,
                height: `${40 + ((i * 17) % 120)}px`,
                top: `${(i * 13) % 100}%`,
                left: `${(i * 19) % 100}%`,
                opacity: 1,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="py-10 px-8 rounded-2xl bg-white flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Image
              src="/logo.png"
              width={200}
              height={200}
              alt="logo"
              className="w-40 rounded-2xl"
            />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Welcome Back!</h2>
          <p className="text-white/80 text-lg max-w-xs mx-auto">
            Sign in to continue shopping and manage your orders.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { value: "50K+", label: "Customers" },
              { value: "4.9★", label: "Rating" },
              { value: "10K+", label: "Products" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-white/70 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Super<span className="text-[#6366F1]">pal</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Sign In
          </h1>
          <p className="text-gray-500 text-sm mb-7">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/signup${typeof window !== "undefined" && window.location.search ? window.location.search : ""}`}
              className="text-[#6366F1] font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="login-email"
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className={cn(
                  "border-[#D1D5DB] h-11",
                  errors.email && "border-red-400",
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#6366F1] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="••••••••"
                  className={cn(
                    "border-[#D1D5DB] h-11 pr-10",
                    errors.password && "border-red-400",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] font-semibold shadow-lg shadow-[#6366F1]/25"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator className="bg-[#D1D5DB]" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F9FAFB] px-3 text-xs text-gray-400">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 border-[#D1D5DB] gap-2 font-medium"
              type="button"
              onClick={() => {
                toast.error("Google Signin is currently Unavailable");
              }}
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                width={200}
                height={200}
                className="w-4 h-4"
                alt="Google"
              />
              Google
            </Button>
            <Button
              variant="outline"
              className="h-11 border-[#D1D5DB] gap-2 font-medium"
              type="button"
            >
              <Image
                src="https://www.svgrepo.com/show/448224/facebook.svg"
                width={200}
                height={200}
                className="w-4 h-4"
                alt="Facebook"
              />
              Facebook
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
          </p>

          {/* Email verification reminder */}
          <div className="mt-4 flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
            <ShieldCheck className="w-4 h-4 text-[#6366F1] mt-0.5 shrink-0" />
            <p className="text-xs text-indigo-700">
              New user? Check your inbox to verify your email before accessing
              all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
