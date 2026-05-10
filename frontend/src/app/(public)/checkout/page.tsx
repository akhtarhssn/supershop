"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const schema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  zipCode: z.string().min(4, "ZIP code required"),
  country: z.string().min(2, "Country required"),
});

type FormData = z.infer<typeof schema>;

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "mobile", label: "Mobile Payment", icon: Smartphone },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
];

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<"form" | "success">("form");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      toast.error("Please log in or create an account to proceed to checkout.");
      router.push("/auth/login?redirect=/checkout");
    }
  }, [isMounted, user, router]);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, reset]);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 3.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const initPayment = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields first");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await api.payments.createPaymentIntent(total);
      const { clientSecret, transactionId } = res.data;
      setClientSecret(clientSecret);

      // Create pending order in DB
      const formData = getValues();
      const orderData = {
        products: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: "Credit Card",
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        email: formData.email,
        transactionId,
      };

      const orderRes = await api.orders.create(orderData);
      setOrderNumber(orderRes.data.orderNumber);
    } catch (error: any) {
      console.error("Payment init failed", error);
      toast.error(error.message || "Failed to initialize payment");
      setClientSecret(""); // Reset clientSecret so Stripe form doesn't show
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (paymentMethod === "card") return;

    setIsProcessing(true);
    try {
      const orderData = {
        products: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Mobile Payment",
        shippingAddress: {
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        email: data.email,
      };

      const res = await api.orders.create(orderData);
      setOrderNumber(res.data.orderNumber);

      clearCart();
      setStep("success");
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-[#D1D5DB] p-10">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-[#4baf4f]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed!
          </h2>
          <p className="text-gray-500 mb-1">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <p className="text-[#6366F1] font-mono font-bold mb-6">
            Order #{orderNumber}
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[#6366F1] text-[#6366F1]"
            >
              <Link href="/account/orders">View Orders</Link>
            </Button>
            <Button asChild className="flex-1 bg-[#6366F1] hover:bg-[#4F46E5]">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted || !user) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#6366F1]/30 border-t-[#6366F1] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No items in cart</p>
          <Button asChild className="bg-[#6366F1] hover:bg-[#4F46E5]">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-[#D1D5DB] py-5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/cart" className="hover:text-[#6366F1]">Cart</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Secure <span className="text-[#6366F1]">Checkout</span>
          </h1>
        </div>
      </div>
      <div>
        <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping info */}
            <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#6366F1] text-white text-sm flex items-center justify-center font-bold">
                  1
                </span>
                Shipping Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="John"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.firstName && "border-red-400"
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Doe"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.lastName && "border-red-400"
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    {...register("email")}
                    placeholder="john@example.com"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.email && "border-red-400"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+1 234 567 8900"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.phone && "border-red-400"
                    )}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="123 Main Street, Apt 4B"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.address && "border-red-400"
                    )}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="New York"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.city && "border-red-400"
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State
                  </Label>
                  <Input
                    id="state"
                    {...register("state")}
                    placeholder="NY"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.state && "border-red-400"
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zipCode" className="text-sm font-medium">
                    ZIP Code
                  </Label>
                  <Input
                    id="zipCode"
                    {...register("zipCode")}
                    placeholder="10001"
                    className={cn(
                      "border-[#D1D5DB]",
                      errors.zipCode && "border-red-400"
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country
                  </Label>
                  <Input
                    id="country"
                    {...register("country")}
                    placeholder="United States"
                    defaultValue="United States"
                    className="border-[#D1D5DB]"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#6366F1] text-white text-sm flex items-center justify-center font-bold">
                  2
                </span>
                Payment Method
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      paymentMethod === method.id
                        ? "border-[#6366F1] bg-[#EEF2FF]"
                        : "border-[#D1D5DB] hover:border-[#6366F1]/50"
                    )}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} className="border-[#6366F1] text-[#6366F1]" />
                    <method.icon className="w-5 h-5 text-[#6366F1]" />
                    <Label htmlFor={method.id} className="cursor-pointer font-medium">
                      {method.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4 p-5 bg-[#F9FAFB] rounded-2xl border border-[#D1D5DB]">
                  {!clientSecret ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Securely pay with your credit or debit card using Stripe.
                      </p>
                      <Button
                        type="button"
                        onClick={initPayment}
                        disabled={isProcessing}
                        className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                      >
                        {isProcessing ? "Initialzing..." : "Configure Payment"}
                      </Button>
                    </div>
                  ) : (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#6366F1',
                          },
                        }
                      }}
                    >
                      <StripePaymentForm
                        total={total}
                        onSuccess={() => {
                          clearCart();
                          setStep("success");
                        }}
                      />
                    </Elements>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 p-3 bg-[#F9FAFB] rounded-xl">
                <Lock className="w-4 h-4 text-[#6366F1]" />
                <p className="text-xs text-gray-500">
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5 sticky top-40">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F9FAFB] shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-900 shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-[#D1D5DB] mb-4" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-[#4baf4f]" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator className="bg-[#D1D5DB]" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-[#6366F1]">{formatPrice(total)}</span>
                </div>
              </div>

              {paymentMethod !== "card" ? (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isProcessing}
                  className="w-full mt-5 bg-[#6366F1] hover:bg-[#4F46E5] h-12 text-base font-semibold shadow-lg shadow-[#6366F1]/25"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Place Order · {formatPrice(total)}
                    </>
                  )}
                </Button>
              ) : (
                !clientSecret && (
                  <Button
                    type="button"
                    onClick={initPayment}
                    disabled={isProcessing}
                    className="w-full mt-5 bg-[#6366F1] hover:bg-[#4F46E5] h-12 text-base font-semibold shadow-lg shadow-[#6366F1]/25"
                  >
                    {isProcessing ? "Initializing..." : "Configure Card Payment"}
                  </Button>
                )
              )}

              <div className="flex items-center justify-center gap-2 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4baf4f]" />
                <p className="text-[10px] text-gray-400">
                  SSL Secured · 100% Safe Transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
