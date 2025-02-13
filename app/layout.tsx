import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { MainLayoutWrapper } from "@/components/main-layout-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getUser } from "@/lib/user-utils";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title:
    "bageta.express - rýchle a jednoduché objednávanie bagiet pre študentov",
  description:
    "Objednaj si svoju desiatu už teraz! Rýchlo a jednoducho! Široký výber bagiet pre študentov.",
  keywords: ["bageta", "express", "objednávka", "študenti", "jedlo", "desiata"],
  openGraph: {
    type: "website",
    url: "https://bageta.express",
    title: "bagetaEXPRESS",
    description:
      "Objednaj si svoju desiatu už teraz! Rýchlo a jednoducho! Široký výber bagiet pre študentov.",
    images: [
      {
        url: "https://utfs.io/f/a9aac9ef-bfd1-4809-ac96-ea741a47f888-inw0fb.png",
        width: 800,
        height: 600,
        alt: "bagetaEXPRESS",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void getUser();

  return (
    <html lang="sk" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <MainLayoutWrapper attribute="class" defaultTheme="light">
          {children}
        </MainLayoutWrapper>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
      {process.env.GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  );
}
