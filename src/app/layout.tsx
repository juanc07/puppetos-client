import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header"; // Fix: Use @/ alias

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PuppetOS Chat",
  description: "Chat with PuppetOS agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}