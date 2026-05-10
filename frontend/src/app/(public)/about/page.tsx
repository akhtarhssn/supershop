import Link from "next/link";
import { Target, Heart, Users, Leaf, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/ui/SectionHeading";

const team = [
  { name: "Alex Morgan", role: "CEO & Founder", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
  { name: "Sarah Kim", role: "Head of Operations", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah2" },
  { name: "James Carter", role: "Head of Sourcing", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=james2" },
  { name: "Emma Patel", role: "Customer Success", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma2" },
];

const values = [
  { icon: Leaf, title: "Farm to Table", desc: "We work directly with local farmers to bring you the freshest produce possible.", color: "text-green-600 bg-green-50" },
  { icon: Heart, title: "Community First", desc: "Supporting local farmers and communities is at the heart of everything we do.", color: "text-red-500 bg-red-50" },
  { icon: Target, title: "Quality Assured", desc: "Every product goes through rigorous quality checks before reaching your door.", color: "text-[#6366F1] bg-[#EEF2FF]" },
  { icon: Award, title: "Award-Winning", desc: "Recognized as the best online grocery platform 3 years in a row.", color: "text-[#fbb400] bg-amber-50" },
];

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-[#6366F1] bg-[#EEF2FF] px-4 py-1.5 rounded-full mb-4">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 max-w-2xl mx-auto leading-tight">
            Bringing Freshness to Your{" "}
            <span className="text-[#6366F1]">Doorstep</span> Every Day
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
            supershop was founded with a simple mission: make fresh, healthy
            food accessible to everyone. We connect local farmers directly
            with customers for maximum freshness and fairness.
          </p>
        </div>
        <div className="absolute -bottom-10 left-0 right-0 h-20 bg-white rounded-t-[50px]" />
      </section>

      {/* Stats */}
      <section className="bg-white pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "5+", label: "Years Operating" },
            { value: "50K+", label: "Happy Customers" },
            { value: "200+", label: "Partner Farmers" },
            { value: "10K+", label: "Products Listed" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold text-[#6366F1]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading badge="Mission" title="Why We " highlight="Do This" />
            <p className="text-gray-600 mt-4 leading-relaxed">
              We believe everyone deserves access to fresh, nutritious food without
              compromise. Starting with a small warehouse in New York in 2019, we've
              grown to serve over 50,000 families across the country.
            </p>
            <p className="text-gray-600 mt-3 leading-relaxed">
              Our direct-farm partnerships mean farmers get fair prices, and you
              get products that are fresher than anything you'd find in a
              supermarket. No middlemen, no markups, just pure freshness.
            </p>
            <Button asChild className="mt-6 bg-[#6366F1] hover:bg-[#4F46E5]">
              <Link href="/shop">Shop With Us <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"
              alt="Fresh produce at farm"
              className="rounded-2xl object-cover h-full"
            />
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=180&fit=crop"
                alt="Farmer working"
                className="rounded-2xl object-cover w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=180&fit=crop"
                alt="Fresh vegetables"
                className="rounded-2xl object-cover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionHeading badge="Our Values" title="What We " highlight="Stand For" centered />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-2xl border border-[#D1D5DB] hover:shadow-lg transition-shadow text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${v.color}`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionHeading badge="The Team" title="Meet Our " highlight="Leaders" centered />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-[#D1D5DB] p-6 text-center hover:shadow-lg transition-shadow">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-20 h-20 rounded-full bg-[#EEF2FF] mx-auto mb-4"
                />
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-[#6366F1]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#6366F1]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Shop Fresh?
          </h2>
          <p className="text-white/80 mb-6">
            Join thousands of happy customers enjoying fresh groceries delivered daily.
          </p>
          <Button asChild size="lg" className="bg-white text-[#6366F1] hover:bg-gray-50 font-semibold">
            <Link href="/shop">Start Shopping <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
