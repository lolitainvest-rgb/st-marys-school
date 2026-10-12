import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://stmarysschool.co.bw"),
  title: {
    default: "St Mary's Catholic Primary School | Tlokweng, Botswana",
    template: "%s | St Mary's Catholic Primary School",
  },
  description: "St Mary's Catholic Primary School in Tlokweng, Botswana offers quality and affordable education centred on Christ's teachings and cultural values of Botho. Motto: Forever Onward.",
  keywords: [
    "St Mary's Catholic Primary School",
    "St Mary's School Tlokweng",
    "Catholic Primary School Botswana",
    "Primary School Botswana",
    "English Medium School Tlokweng",
    "Best Primary Schools in Gaborone",
    "Private School Tlokweng",
    "Standard 1 Admissions 2026",
    "Botswana Primary Education"
  ],
  authors: [{ name: "St Mary's School" }, { name: "Lolita Investment PTY LTD", url: "https://lolitainvestment.com" }],
  creator: "Lolita Investment PTY LTD",
  publisher: "St Mary's Catholic Primary School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "St Mary's Catholic Primary School | Forever Onward",
    description: "Forever Onward. Delivering quality and affordable primary school education centred on Christ's teachings.",
    url: "https://stmarysschool.co.bw",
    siteName: "St Mary's Catholic Primary School",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "St Mary's Catholic Primary School Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "St Mary's Catholic Primary School",
    description: "Join us at St Mary's Catholic Primary School! Admissions open for 2026. Forever Onward.",
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
  other: {
    "geo.region": "BW-SE",
    "geo.placename": "Tlokweng",
    "geo.position": "-24.6583;25.9225",
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
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-slate-50 relative selection:bg-primary/20 selection:text-primary`}>
        {/* Themed Transparent Wallpaper Layer */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.045] bg-repeat"
          style={{ backgroundImage: "url('/theme-wallpaper.svg')", backgroundSize: "320px 320px" }}
          aria-hidden="true"
        />
        <Navbar />
        <main className="flex-grow relative z-10">
          {children}
        </main>
        <Footer />
        <StructuredData />
      </body>
    </html>
  );
}
