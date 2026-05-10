"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Leaf, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    badge: "Limited Time Offer",
    badgeIcon: Zap,
    badgeColor: "bg-amber-100 text-amber-700",
    title: "Organic Fresh Harvest",
    subtitle: "Up to 50% OFF!",
    description: "Experience the peak of freshness with our locally sourced, 100% organic vegetable selection.",
    image: "/images/hero_vegetables_1776590134425.png",
    cta: "Shop Vegetables",
    accentColor: "text-[#4baf4f]",
    bgColor: "bg-[#f8fafc]",
  },
  {
    id: 2,
    badge: "New Arrival",
    badgeIcon: Sparkles,
    badgeColor: "bg-blue-100 text-blue-700",
    title: "Sunshine in a Bottle",
    subtitle: "100% Pure Juices",
    description: "Cold-pressed, never from concentrate. Pure natural vitamins delivered straight to your home.",
    image: "/images/hero_juice_1776590148519.png",
    cta: "Explore Juices",
    accentColor: "text-orange-500",
    bgColor: "bg-[#fffdfa]",
  },
  {
    id: 3,
    badge: "Farm Fresh",
    badgeIcon: Leaf,
    badgeColor: "bg-green-100 text-green-700",
    title: "Real Milk, Real Eggs",
    subtitle: "Farm to Your Table",
    description: "Sustainable dairy and free-range eggs from local pastures. Quality you can taste in every bite.",
    image: "/images/hero_dairy_1776590176157.png",
    cta: "Shop Dairy",
    accentColor: "text-[#6366F1]",
    bgColor: "bg-[#fefeff]",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <div className="relative overflow-hidden group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={cn(
                "flex-[0_0_100%] min-w-0 min-h-[500px] md:min-h-[600px] flex items-center transition-colors duration-1000",
                slide.bgColor
              )}
            >
              <div className="max-w-7xl mx-auto px-4 w-full grid md:grid-cols-2 gap-10 items-center py-12">
                {/* Text Content */}
                <div className="space-y-6 text-left order-2 md:order-1 relative z-10">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700",
                      slide.badgeColor
                    )}
                  >
                    <slide.badgeIcon className="w-4 h-4" />
                    {slide.badge}
                  </div>

                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                      {slide.title}
                      <br />
                      <span className={slide.accentColor}>{slide.subtitle}</span>
                    </h2>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gray-900 hover:bg-black text-white px-8 h-14 text-base font-bold rounded-2xl shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
                    >
                      <Link href="/shop">
                        {slide.cta}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-2 border-gray-200 hover:bg-white px-8 h-14 text-base font-bold rounded-2xl transition-all"
                    >
                      <Link href="/shop">Redefine Your Style</Link>
                    </Button>
                  </div>
                </div>

                {/* Image Section */}
                <div className="relative order-1 md:order-2 animate-in fade-in zoom-in-95 duration-1000">
                  <div className="relative aspect-[4/3] md:aspect-square flex items-center justify-center">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                    />
                    {/* Decorative Background Element */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full scale-90 blur-3xl -z-0" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 md:left-4 md:right-auto md:w-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-center md:justify-start gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "w-8 bg-gray-900"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
