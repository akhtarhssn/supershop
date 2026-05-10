"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus, CheckCircle2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { api } from "@/lib/api-client";

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "buyer" | "seller";
  terms: boolean;
};

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { role: "buyer", terms: false } });

  const password = watch("password");
  const selectedRole = watch("role");

  const passwordStrength = password
    ? password.length < 6
      ? "weak"
      : password.length < 10
        ? "medium"
        : "strong"
    : null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (!data.terms) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      // If avatar was selected, convert to base64 string for now
      // (In production you'd upload to Cloudinary first)
      let avatarUrl: string | undefined;
      if (avatarPreview) {
        avatarUrl = avatarPreview;
      }

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      await api.users.create(payload);

      toast.success("Account created! Please check your email to verify your account.", {
        duration: 6000,
        position: "bottom-right",
      });
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get('redirect');
      if (redirectParam) {
        router.push(`/auth/login?redirect=${redirectParam}`);
      } else {
        router.push("/auth/login");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message, { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4baf4f] to-[#16a34a] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${40 + (i * 23) % 130}px`,
                height: `${40 + (i * 23) % 130}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 13) % 100}%`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-white">
          <div className="py-10 px-8 rounded-2xl bg-white flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Image src="/logo.png" width={200} height={200} alt="logo" className="w-40 rounded-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Join SuperShop Today!</h2>
          <p className="text-white/80 text-lg max-w-xs mb-8">
            Create your account and start enjoying fresh groceries delivered to your door.
          </p>
          <div className="space-y-3 text-left">
            {[
              "Free delivery on orders over $50",
              "Exclusive member discounts & deals",
              "Easy order tracking & management",
              "Priority customer support",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white/80 shrink-0" />
                <span className="text-white/90 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Super<span className="text-[#6366F1]">pal</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Already have an account?{" "}
            <Link href={`/auth/login${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`} className="text-[#6366F1] font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#6366F1] transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAvatarPreview(null); setAvatarFile(null); }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-[#6366F1]">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-gray-400">Upload a profile photo (optional)</p>
            </div>

            {/* Full name */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Full Name</Label>
              <Input
                {...register("name", { required: "Full name is required" })}
                placeholder="John Doe"
                className={cn("border-[#D1D5DB] h-11", errors.name && "border-red-400")}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email Address</Label>
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className={cn("border-[#D1D5DB] h-11", errors.email && "border-red-400")}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Phone Number</Label>
              <Input
                type="tel"
                {...register("phone", { required: "Phone number is required" })}
                placeholder="+1 800 123 4567"
                className={cn("border-[#D1D5DB] h-11", errors.phone && "border-red-400")}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Role selector */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">I want to join as</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["buyer", "seller"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue("role", r)}
                    className={cn(
                      "h-11 rounded-lg border-2 text-sm font-medium capitalize transition-all",
                      selectedRole === r
                        ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]"
                        : "border-[#D1D5DB] text-gray-600 hover:border-gray-400"
                    )}
                  >
                    {r === "buyer" ? "🛒 Buyer" : "🏪 Seller"}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  placeholder="Create a strong password"
                  className={cn("border-[#D1D5DB] h-11 pr-10", errors.password && "border-red-400")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              {passwordStrength && (
                <div className="flex gap-1 mt-1">
                  {["weak", "medium", "strong"].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-1 rounded-full transition-colors ${passwordStrength === "strong"
                        ? "bg-[#4baf4f]"
                        : passwordStrength === "medium" && level !== "strong"
                          ? "bg-[#fbb400]"
                          : passwordStrength === "weak" && level === "weak"
                            ? "bg-red-500"
                            : "bg-gray-200"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Confirm Password</Label>
              <Input
                type="password"
                {...register("confirmPassword", { required: "Please confirm password" })}
                placeholder="Repeat your password"
                className={cn("border-[#D1D5DB] h-11", errors.confirmPassword && "border-red-400")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="signup-terms"
                checked={watch("terms")}
                onCheckedChange={(checked) => setValue("terms", checked === true)}
                className="mt-0.5 border-[#D1D5DB] data-[state=checked]:bg-[#6366F1] data-[state=checked]:border-[#6366F1]"
              />
              <Label htmlFor="signup-terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-[#6366F1] hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="text-[#6366F1] hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] font-semibold shadow-lg shadow-[#6366F1]/25"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="relative my-5">
            <Separator className="bg-[#D1D5DB]" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F9FAFB] px-3 text-xs text-gray-400">
              or sign up with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 border-[#D1D5DB] gap-2 font-medium" type="button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Google
            </Button>
            <Button variant="outline" className="h-11 border-[#D1D5DB] gap-2 font-medium" type="button">
              <img src="https://www.svgrepo.com/show/448224/facebook.svg" className="w-4 h-4" alt="Facebook" />
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
