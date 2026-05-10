"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface StripePaymentFormProps {
  total: number;
  onSuccess: () => void;
}

export default function StripePaymentForm({ total, onSuccess }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL for redirection after payment
        return_url: window.location.origin + "/checkout/success",
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
      toast.error(error.message || "Payment failed");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      toast.success("Payment successful!");
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('successful') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] h-12 text-base font-semibold shadow-lg shadow-[#6366F1]/25"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Pay Now · ${total.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
}
