import Link from "next/link";
import { Clock, User, Tag, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/ui/SectionHeading";
import { blogPosts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog" };

const categories = ["All", "Tips & Tricks", "Health & Wellness", "Recipes", "Sustainability"];

export default function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <section className="hero-gradient py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeading badge="Our Blog" title="Fresh " highlight="Insights" description="Tips, recipes, and stories from our farm to your kitchen." centered />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === "All"
                  ? "bg-[#6366F1] text-white"
                  : "bg-white border border-[#D1D5DB] text-gray-600 hover:border-[#6366F1] hover:text-[#6366F1]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="block mb-10">
          <div className="relative overflow-hidden rounded-3xl group">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <Badge className="bg-[#6366F1] text-white border-0 mb-3">
                {featured.category}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                {featured.title}
              </h2>
              <p className="text-white/80 text-sm line-clamp-2 mb-3 max-w-xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {featured.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(featured.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Blog grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 left-3 bg-[#6366F1] text-white border-0 text-[10px]">
                    {post.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6366F1] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-7 h-7 rounded-full bg-[#EEF2FF]"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {post.author}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}m
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter in blog */}
        <div className="bg-[#6366F1] rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Get Fresh Content Weekly
          </h3>
          <p className="text-white/80 mb-5 text-sm">
            Subscribe for recipes, tips, and exclusive offers.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email..."
              className="bg-white/15 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50"
            />
            <Button className="bg-[#fbb400] hover:bg-[#e6a200] text-black font-semibold shrink-0">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
