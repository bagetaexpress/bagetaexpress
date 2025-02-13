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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    <html
      lang="sk"
      className={`${GeistSans.variable} ${GeistMono.variable} light`}
      style={{ colorScheme: "light" }}
    >
      <body>
        <MainLayoutWrapper attribute="class" defaultTheme="light">
          {children}
        </MainLayoutWrapper>
        <SpeedInsights />
        <Analytics />
        <Toaster />
        <Footer />
      </body>
      {process.env.GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  );
}

function Footer() {
  return (
    <footer className="w-full min-h-40 bg-background flex flex-col gap-2">
      <Separator />
      <div className="flex-1 flex justify-center items-center gap-2 flex-wrap">
        <Link
          prefetch={false}
          href="https://www.instagram.com/bagetaexpress/"
          target="_blank"
        >
          <Button variant="outline" className="gap-2">
            Instagram
            <Instagram className="w-6 h-6" />
          </Button>
        </Link>
        <Link
          prefetch={false}
          href="https://www.github.com/bagetaexpress/bagetaexpress"
          target="_blank"
        >
          <Button variant="outline" className="gap-2">
            Github
            <Github className="w-6 h-6" />
          </Button>
        </Link>
      </div>
      <Separator />
      <p className="text-sm color-muted-background text-center pb-2">
        Copyright &copy; 2025 Tomáš Ž.
      </p>
    </footer>
  );
}
