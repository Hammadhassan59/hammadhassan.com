import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hammad Hassan — Builder. Founder. Writer.",
    template: "%s — Hammad Hassan",
  },
  description:
    "Raw notes on business, entrepreneurship, marketing, and human behavior.",
  openGraph: {
    title: "Hammad Hassan — Builder. Founder. Writer.",
    description:
      "Raw notes on business, entrepreneurship, marketing, and human behavior.",
    url: "https://hammadhassan.com",
    siteName: "Hammad Hassan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hammad Hassan — Builder. Founder. Writer.",
    description:
      "Raw notes on business, entrepreneurship, marketing, and human behavior.",
  },
  metadataBase: new URL("https://hammadhassan.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}
      >
        <Header />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
