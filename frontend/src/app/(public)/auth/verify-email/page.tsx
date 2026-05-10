"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import Link from "next/link";

type VerifyState = "loading" | "success" | "error" | "idle";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>(token ? "loading" : "idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await api.auth.verifyEmail(token);
        setState("success");
        setMessage("Your email has been verified successfully! You can now sign in.");
      } catch (err: unknown) {
        setState("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "The verification link is invalid or has expired."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-[#6366F1] font-extrabold text-2xl">S</span>
        </div>

        {state === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="w-12 h-12 text-[#6366F1] animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verifying your email…</h1>
            <p className="text-gray-500 text-sm">Please wait a moment.</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-500 text-sm mb-8">{message}</p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] font-semibold"
            >
              Sign In Now
            </Button>
          </>
        )}

        {state === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="w-14 h-14 text-red-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-500 text-sm mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/auth/signup")}
                className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] font-semibold"
              >
                Sign Up Again
              </Button>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full h-11 border-[#D1D5DB]">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </>
        )}

        {state === "idle" && (
          <>
            <div className="flex justify-center mb-4">
              <Mail className="w-14 h-14 text-[#6366F1]" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Check Your Inbox</h1>
            <p className="text-gray-500 text-sm mb-8">
              We sent a verification link to your email address. Click the link to activate your account.
              <br />
              <span className="text-xs text-gray-400 mt-2 block">
                The link expires in 24 hours.
              </span>
            </p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full h-11 border-[#D1D5DB] font-semibold">
                Back to Sign In
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
