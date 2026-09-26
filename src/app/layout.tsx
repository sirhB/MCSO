import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Figtree,
  Fraunces,
  Manrope,
} from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const editorialDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-editorial-display",
});

const editorialBody = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-editorial-body",
});

const authorityDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-authority-display",
});

const authorityBody = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-authority-body",
});

export const metadata: Metadata = {
  title: "MCSO Security Group | Professional Protection",
  description:
    "Veteran-owned private security. Executive protection, residential, commercial, and special event security in Florida and New York.",
  openGraph: {
    title: "MCSO Security Group",
    description: "The standard of professional protection.",
    images: ["/assets/mcso_patrol_header.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${editorialDisplay.variable} ${editorialBody.variable} ${authorityDisplay.variable} ${authorityBody.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
