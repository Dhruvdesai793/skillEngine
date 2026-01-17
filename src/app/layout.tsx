import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for that clean Google look
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import Dock from "@/components/ui/Dock";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Skill Intelligence Engine",
  description: "AI-powered skill analysis and matching platform.",
};

import { AuthProvider } from "@/lib/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen bg-background text-foreground selection:bg-lando selection:text-black pb-32`}>
        <AuthProvider>
          <SmoothScrolling>
            {children}
            <Dock />
          </SmoothScrolling>
        </AuthProvider>
      </body>
    </html>
  );
}
