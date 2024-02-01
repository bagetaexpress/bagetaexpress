import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import MainLayoutWrapper from "../components/MainLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bagetaEXPRESS",
  description: "order sandwiches fast and easy",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
