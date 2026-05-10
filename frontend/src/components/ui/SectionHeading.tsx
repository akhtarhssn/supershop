import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  description,
  centered = false,
  className,
}: SectionHeadingProps) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <div className={cn(centered && "text-center", className)}>
      {badge && (
        <span className="inline-block text-xs font-semibold text-[#6366F1] bg-[#EEF2FF] px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {highlight ? (
          <>
            {parts[0]}
            <span className="text-[#6366F1]">{highlight}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p className="text-gray-500 text-sm mt-2 max-w-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
