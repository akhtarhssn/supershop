"use client";

import HeroCarousel from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import CategorySkeleton from "@/components/ui/CategorySkeleton";
import ProductListSkeleton from "@/components/ui/ProductListSkeleton";
import SectionHeading from "@/components/ui/SectionHeading";
import { api } from "@/lib/api-client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Leaf,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ICategory, Product } from "@/types/types";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On orders above $50",
    color: "text-[#635ad9] bg-[#f5f3ff]",
  },
  {
    icon: Leaf,
    title: "Fresh & Organic",
    desc: "100% natural products",
    color: "text-[#4baf4f] bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% protected payments",
    color: "text-[#fbb400] bg-amber-50",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Dedicated customer care",
    color: "text-blue-500 bg-blue-50",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    rating: 5,
    text: "Amazing quality and super fast delivery! The vegetables are always fresh and I love the organic selection.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    name: "Mike R.",
    rating: 5,
    text: "Best grocery app I've ever used. The prices are great and the produce quality is exceptional.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
  },
  {
    name: "Emma L.",
    rating: 4,
    text: "Love the variety of products. The checkout process is smooth and they always deliver on time.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [fetchedCategories, setFetchedCategories] = useState<ICategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, featured, best, arrivals] = await Promise.all([
          api.categories.getAll(),
          api.products.getFeatured(),
          api.products.getBestSellers(),
          api.products.getNewArrivals(),
        ]);
        setFetchedCategories(cats.data || []);
        setFeaturedProducts(featured.data?.result || []);
        setBestSellers(best.data?.result || []);
        setNewArrivals(arrivals.data?.result || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const ctx = gsap.context(() => {
      // Scroll-triggered reveals
      gsap.utils.toArray(".scroll-reveal").forEach((el) => {
        gsap.from(el as Element, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el as Element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="bg-white">
      {/* ─── Hero Carousel ─── */}
      <section>
        <HeroCarousel />
      </section>

      {/* ─── Features ─── */}
      <section className="bg-white py-10 border-b border-[#e8e8f0]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="scroll-reveal flex items-center gap-3 p-4 rounded-xl hover:bg-[#f8f8fd] transition-colors"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}
              >
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-16 bg-[#f8f8fd]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal flex items-end justify-between mb-8">
            <SectionHeading
              badge="Browse"
              title="Shop by "
              highlight="Category"
            />
            <Link
              href="/shop"
              className="flex items-center gap-1 text-sm text-[#635ad9] font-medium hover:gap-2 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <CategorySkeleton key={i} />
                ))
              : fetchedCategories.map((cat, i) => (
                  <Link
                    key={i}
                    href={`/shop?category=${cat.slug}`}
                    className="scroll-reveal group"
                  >
                    <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-md border border-[#e8e8f0] hover:border-[#635ad9] hover:shadow-lg transition-all duration-300 text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                            unoptimized={true}
                          />
                        ) : (
                          <span>🥦</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-[#635ad9] transition-colors leading-tight">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal flex items-end justify-between mb-8">
            <SectionHeading
              badge="Handpicked"
              title="Featured "
              highlight="Products"
              description="Discover our most popular and highly-rated items"
            />
            <Link
              href="/shop"
              className="flex items-center gap-1 text-sm text-[#635ad9] font-medium hover:gap-2 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : featuredProducts.map((product) => (
                  <div key={product._id} className="scroll-reveal">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ─── Promo Banner ─── */}
      <section className="py-12 bg-[#f8f8fd]">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="scroll-reveal relative overflow-hidden rounded-3xl bg-linear-to-br from-[#635ad9] to-[#7c6fe0] p-8 flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm font-medium opacity-80 mb-1">
                Special Offer
              </p>
              <h3 className="text-2xl font-bold leading-tight mb-2">
                Get 30% Off
                <br />
                Fresh Vegetables
              </h3>
              <p className="text-sm opacity-75 mb-4">
                Use code: <strong>FRESH30</strong>
              </p>
              <Button
                asChild
                size="sm"
                className="bg-white text-[#635ad9] hover:bg-gray-50"
              >
                <Link href="/shop?category=fresh-vegetables">
                  Shop Now <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="text-8xl opacity-30 absolute -right-4 -bottom-4">
              🥦
            </div>
            <div className="text-6xl">🥦</div>
          </div>

          {/* Banner 2 */}
          <div className="scroll-reveal relative overflow-hidden rounded-3xl bg-linear-to-br from-[#fbb400] to-[#f97316] p-8 flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm font-medium opacity-80 mb-1">
                Limited Time
              </p>
              <h3 className="text-2xl font-bold leading-tight mb-2">
                Buy 2 Get 1
                <br />
                Free on Fruits
              </h3>
              <p className="text-sm opacity-75 mb-4">Valid this week only!</p>
              <Button
                asChild
                size="sm"
                className="bg-white text-[#f97316] hover:bg-gray-50"
              >
                <Link href="/shop?category=fresh-fruits">
                  Shop Now <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="text-8xl opacity-30 absolute -right-4 -bottom-4">
              🍎
            </div>
            <div className="text-6xl">🍎</div>
          </div>
        </div>
      </section>

      {/* ─── Best Sellers + New Arrivals ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          {/* Best Sellers */}
          <div>
            <div className="scroll-reveal flex items-end justify-between mb-6">
              <SectionHeading
                badge="🔥 Hot"
                title="Best "
                highlight="Sellers"
              />
              <Link
                href="/shop?sort=best-seller"
                className="flex items-center gap-1 text-sm text-[#635ad9] font-medium hover:gap-2 transition-all"
              >
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <ProductListSkeleton key={i} />
                  ))
                : bestSellers.map((product) => (
                    <div key={product._id} className="scroll-reveal">
                      <ProductCard product={product} view="list" />
                    </div>
                  ))}
            </div>
          </div>

          {/* New Arrivals */}
          <div>
            <div className="scroll-reveal flex items-end justify-between mb-6">
              <SectionHeading
                badge="✨ New"
                title="New "
                highlight="Arrivals"
              />
              <Link
                href="/shop?sort=new"
                className="flex items-center gap-1 text-sm text-[#635ad9] font-medium hover:gap-2 transition-all"
              >
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <ProductListSkeleton key={i} />
                  ))
                : newArrivals.map((product) => (
                    <div key={product._id} className="scroll-reveal">
                      <ProductCard product={product} view="list" />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Banner ─── */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10,000+", label: "Products Available" },
            { value: "50,000+", label: "Happy Customers" },
            { value: "200+", label: "Local Farmers" },
            { value: "99.8%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label} className="scroll-reveal">
              <p className="text-3xl font-extrabold text-[#635ad9] mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-16 bg-[#f8f8fd]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal text-center mb-10">
            <SectionHeading
              badge="Testimonials"
              title="What Our "
              highlight="Customers"
              description="Don't just take our word for it — hear from happy shoppers!"
              centered
            />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="scroll-reveal bg-white rounded-2xl p-6 border border-[#e8e8f0] hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#fbb400] fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full bg-[#f5f3ff]"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
