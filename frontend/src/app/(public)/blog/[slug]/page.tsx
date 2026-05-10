import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ChevronRight, ArrowLeft, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  const related = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-[#D1D5DB] py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#6366F1]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-[#6366F1]">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-10">
        {/* Badge + category */}
        <div className="mb-5">
          <Badge className="bg-[#EEF2FF] text-[#6366F1] border-0 mb-3">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full bg-[#EEF2FF]" />
              <span>{post.author}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} min read
            </span>
          </div>
        </div>

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full aspect-video object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <p className="text-lg font-medium text-gray-800 mb-4">{post.excerpt}</p>
          <p>
            Fresh produce at its peak ripeness offers significantly more nutrients than produce that has been sitting in transit or storage for days. When you shop at supershop, you're choosing food that was harvested at exactly the right time and delivered fresh to your door.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">The Importance of Freshness</h2>
          <p>
            Studies show that fruits and vegetables lose up to 50% of their nutrients within the first few days of harvesting. This is why our direct-farm model matters so much — we eliminate unnecessary steps in the supply chain.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Tips for Maximum Freshness</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Store most fruits at room temperature until ripe, then refrigerate</li>
            <li>Keep vegetables in the crisper drawer with optimal humidity</li>
            <li>Never wash produce until you're ready to eat it</li>
            <li>Use proper containers to maintain moisture balance</li>
          </ul>
          <p className="mt-6">
            By following these simple guidelines and choosing quality produce from trusted sources, you can maximize both the nutritional value and the taste of your food.
          </p>
        </div>

        {/* Share + Back */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#D1D5DB]">
          <Button asChild variant="outline" className="border-[#6366F1] text-[#6366F1] gap-2">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6366F1] transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related <span className="text-[#6366F1]">Articles</span></h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((rp) => (
              <Link key={rp.id} href={`/blog/${rp.slug}`} className="group bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden hover:shadow-md transition-shadow">
                <img src={rp.image} alt={rp.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#6366F1] transition-colors">{rp.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(rp.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
