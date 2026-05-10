"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface CategorySkeletonProps {
  className?: string;
}

export default function CategorySkeleton({ className }: CategorySkeletonProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-md border border-[#e8e8f0]">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-2 w-12" />
      </div>
    </div>
  );
}