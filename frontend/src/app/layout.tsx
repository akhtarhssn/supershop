import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import LenisProvider from "@/components/providers/LenisProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Supershop — Fresh Grocery & Organic Food",
    template: "%s | Supershop",
  },
  description:
    "Shop fresh groceries, organic food, and daily essentials delivered to your door. Supershop offers quality products at unbeatable prices.",
  keywords: ["grocery", "organic food", "fresh produce", "online shopping", "supershop"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://supershop.com",
    siteName: "supershop",
    title: "supershop — Fresh Grocery & Organic Food",
    description:
      "Shop fresh groceries, organic food, and daily essentials delivered to your door.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LenisProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
          <Toaster position="top-center" />
        </LenisProvider>
      </body>
    </html>
  );
}
