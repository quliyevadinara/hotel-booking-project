import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Booking - Find Your Perfect Stay in Azerbaijan",
  description:
    "Book hotels in Azerbaijan with the best prices. Browse luxury hotels, resorts, and boutique accommodations across Baku, Gabala, Sheki, and more.",
  keywords:
    "hotel booking, Azerbaijan hotels, Baku hotels, luxury resorts, accommodation",
  authors: [
    { name: "Dinara Quliyeva", url: "https://github.com/quliyevadinara" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hotel-booking.az",
    title: "Hotel Booking - Find Your Perfect Stay",
    description: "Book hotels in Azerbaijan with the best prices",
    siteName: "Hotel Booking",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Booking - Find Your Perfect Stay",
    description: "Book hotels in Azerbaijan with the best prices",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
