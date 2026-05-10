import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Share2,
  Globe,
  Rss,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  categories: [
    { label: "Fresh Vegetables", href: "/shop?category=fresh-vegetables" },
    { label: "Fresh Fruits", href: "/shop?category=fresh-fruits" },
    { label: "Dairy & Eggs", href: "/shop?category=dairy-eggs" },
    { label: "Meat & Fish", href: "/shop?category=meat-fish" },
    { label: "Bakery", href: "/shop?category=bakery" },
    { label: "Beverages", href: "/shop?category=beverages" },
  ],
  account: [
    { label: "My Account", href: "/account" },
    { label: "My Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter section */}
      <div className="bg-[#6366F1]">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-white/80 text-sm mt-1">
              Get fresh deals, recipes & updates delivered to your inbox.
            </p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <Input
              type="email"
              placeholder="Enter your email address..."
              className="bg-white/15 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50 h-11"
            />
            <Button className="bg-[#fbb400] hover:bg-[#e6a200] text-black font-semibold h-11 px-6 shrink-0">
              Subscribe
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center">
                <span className="text-white font-bold text-lg">SS</span>
              </div>
              <span className="text-xl font-bold text-white">
                Super<span className="text-[#6366F1]">shop</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Your trusted online grocery store delivering fresh, organic, and
              high-quality food products right to your doorstep.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 text-[#6366F1] shrink-0" />
                123 Green Market St, New York, NY 10001
              </div>
              <div className="flex items-center gap-2.5 text-gray-400">
                <Phone className="w-4 h-4 text-[#6366F1] shrink-0" />
                +1 800 123 4567
              </div>
              <div className="flex items-center gap-2.5 text-gray-400">
                <Mail className="w-4 h-4 text-[#6366F1] shrink-0" />
                hello@supershop.com
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#6366F1] transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#6366F1] transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">My Account</h4>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#6366F1] transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © 2024 supershop. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {[
            { icon: Globe, href: "#", label: "Facebook" },
            { icon: Share2, href: "#", label: "Twitter" },
            { icon: Rss, href: "#", label: "Instagram" },
            { icon: Play, href: "#", label: "YouTube" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#6366F1] hover:text-white transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-300">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
