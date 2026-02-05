import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Switch to Inter
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://stmarysschool.co.bw"),
  title: {
    default: "St Mary's English Medium Primary School | Tlokweng, Gaborone & Botswana",
    template: "%s | St Mary's Primary School",
  },
  description: "St Mary's English Medium Primary School in Tlokweng, Gaborone, Botswana offers quality education with a focus on academic excellence, cultural heritage, and holistic development. Admissions open for 2026.",
  keywords: [
    "St Mary's School",
    "Primary School Botswana",
    "English Medium School Tlokweng",
    "Best Primary Schools in Gaborone",
    "Private School Tlokweng",
    "St Mary's English Medium",
    "Botswana Education",
    "Standard 1 Admissions 2026",
    "Motswana Culture School"
  ],
  authors: [{ name: "St Mary's School" }, { name: "Lolita Investment PTY LTD", url: "https://lolitainvestment.com" }],
  creator: "Lolita Investment PTY LTD",
  publisher: "St Mary's English Medium Primary School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "St Mary's English Medium Primary School",
    description: "Onward, Onward, Forever Onward. Excellence in primary education rooted in cultural values.",
    url: "https://stmarysschool.co.bw",
    siteName: "St Mary's School",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // We'll need to recommend adding this file later
        width: 1200,
        height: 630,
        alt: "St Mary's School Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "St Mary's English Medium Primary School",
    description: "Join us at St Mary's! Admissions open for 2026. Quality education in Tlokweng.",
    // images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  // Geo-tags for Local SEO
  other: {
    "geo.region": "BW-SE", // South-East District
    "geo.placename": "Tlokweng",
    "geo.position": "-24.6583;25.9225", // Approx coordinates
    "ICBM": "-24.6583, 25.9225",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-gray-50`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <StructuredData />
      </body>
    </html>
  );
}
