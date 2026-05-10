import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-[120px] font-black text-gray-100 leading-none mb-4 selection:bg-transparent">
          404
        </h1>
        <div className="relative -mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2 px-8 h-12 rounded-xl text-base font-semibold">
              <Link href="/">
                <MoveLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-[#D1D5DB] px-8 h-12 rounded-xl text-base font-semibold">
              <Link href="/shop">
                Browse Shop
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-3xl" />
    </div>
  );
}
