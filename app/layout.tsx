import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { MainLayoutWrapper } from "@/components/main-layout-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getUser } from "@/lib/user-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    <html lang="sk" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <MainLayoutWrapper attribute="class" defaultTheme="light" enableSystem enableColorScheme={false}>
          <main className="flex-1">
            {children}
          </main>
        </MainLayoutWrapper>
        <SpeedInsights />
        <Analytics />
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-background border-t">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Sledujte nás</h3>
            <div className="flex gap-3">
              <Link
                prefetch={false}
                href="https://www.instagram.com/bagetaexpress/"
                target="_blank"
              >
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="w-5 h-5" />
                </Button>
              </Link>
              <Link
                prefetch={false}
                href="https://www.github.com/bagetaexpress/bagetaexpress"
                target="_blank"
              >
                <Button variant="outline" size="icon" className="rounded-full">
                  <Github className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Rýchle odkazy</h3>
            <div className="flex flex-col gap-2">
              <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                Podpora
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Domov
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Kontakt</h3>
            <p className="text-muted-foreground">
              Máte otázky? Neváhajte nás kontaktovať.
            </p>
          </div>
        </div>

        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} Tomáš Ž.
          </p>
          <p className="text-sm text-muted-foreground">
            bageta.express - rýchle a jednoduché objednávanie bagiet
          </p>
        </div>
      </div>
    </footer>
  );
}
