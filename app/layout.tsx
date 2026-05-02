import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientMain from "@/components/ClientMain";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDF6EC] text-[#1A1A1A]">
        <Navbar />
        <ClientMain>{children}</ClientMain>
        <Footer />
      </body>
    </html>
  );
}
