"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  view?: "grid" | "list";
  className?: string;
}

export default function ProductCardSkeleton({
  view = "grid",
  className,
}: ProductCardSkeletonProps) {
  if (view === "list") {
    return (
      <div className="flex gap-4 bg-white border border-[#E5E7EB] rounded-md p-4">
        <Skeleton className="w-32 h-32 rounded-md" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col bg-white border border-[#E5E7EB] rounded-md overflow-hidden", className)}
    >
      <Skeleton className="aspect-4/3" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24 rounded-sm" />
        </div>
      </div>
    </div>
  );
}