import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { MainLayoutWrapper } from "@/components/main-layout-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getUser } from "@/lib/user-utils";

export const metadata: Metadata = {
  title: "bagetaEXPRESS - Rýchle objednávanie bagiet pre študentov",
  description: "Rýchle a jednoduché objednávanie bagiet pre študentov! Objednajte si čerstvú desiatu online a nechajte si ju doručiť priamo do školy.",
  keywords: ["bageta", "express", "objednávka", "študenti", "jedlo", "desiata", "doručenie", "online objednávka", "školské jedlo"],
  authors: [{ name: "Tomáš Žifčák" }],
  creator: "Tomáš Žifčák",
  publisher: "Tomáš Žifčák",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bageta.express'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    url: "https://bageta.express",
    title: "bagetaEXPRESS - Rýchle objednávanie bagiet pre študentov",
    description: "Objednajte si čerstvú desiatu online a nechajte si ju doručiť priamo do školy!",
    siteName: "bagetaEXPRESS",
    locale: "sk_SK",
    images: [
      {
        url: "https://utfs.io/f/a9aac9ef-bfd1-4809-ac96-ea741a47f888-inw0fb.png",
        width: 800,
        height: 600,
        alt: "bagetaEXPRESS - Rýchle objednávanie bagiet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bagetaEXPRESS - Rýchle objednávanie bagiet pre študentov",
    description: "Objednajte si čerstvú desiatu online a nechajte si ju doručiť priamo do školy!",
    images: ["https://utfs.io/f/a9aac9ef-bfd1-4809-ac96-ea741a47f888-inw0fb.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="canonical" href="https://bageta.express" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodService",
              "name": "bagetaEXPRESS",
              "description": "Rýchle a jednoduché objednávanie bagiet pre študentov",
              "url": "https://bageta.express",
              "image": "https://utfs.io/f/a9aac9ef-bfd1-4809-ac96-ea741a47f888-inw0fb.png",
              "servesCuisine": "Fast Food",
              "priceRange": "€",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "SK"
              }
            })
          }}
        />
      </head>
      <body>
        <MainLayoutWrapper attribute="class" defaultTheme="light">
          {children}
        </MainLayoutWrapper>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
