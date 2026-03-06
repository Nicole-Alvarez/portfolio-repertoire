import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manropeMono = Manrope({
  variable: "--font-manrope-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Repertoire",
  description: "A modern one-page portfolio in wine red and gold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable} ${manropeMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
