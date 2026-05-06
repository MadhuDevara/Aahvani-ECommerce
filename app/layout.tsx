import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientMain from "@/components/ClientMain";
import { LuxuryProviders } from "@/components/providers/LuxuryProviders";
import PageTransition from "@/components/providers/PageTransition";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CartDrawer from "@/components/cart/CartDrawer";
import ScrollToTop from "@/components/ui/ScrollToTop";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aahvani Jewels — An Invitation to Elegance",
  description:
    "Discover exquisite jewellery crafted for timeless elegance. Shop curated collections at Aahvani Jewels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-lux-ivory text-lux-ink">
        <LuxuryProviders>
          <ScrollProgress />
          <Navbar />
          <ClientMain>
            <PageTransition>{children}</PageTransition>
          </ClientMain>
          <Footer />
          <CartDrawer />
          <ScrollToTop />
        </LuxuryProviders>
      </body>
    </html>
  );
}
