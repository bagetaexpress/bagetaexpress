import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { MainLayoutWrapper } from "@/components/MainLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bagetaEXPRESS",
  description: "Rýchle a jednoduché objednávanie bagiet pre študentov!",
  keywords: ["bageta", "express", "objednávka", "študenti", "jedlo", "desiata"],
  openGraph: {
    type: "website",
    url: "bageta.express",
    title: "bagetaEXPRESS",
    description: "Objednaj si desiatu už teraz!",
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
  return (
    <html lang="en">
      <meta property="og:type" content="website" />
      <meta property="og:title" content="bagetaEXPRESS" />
      <meta property="og:url" content="bageta.express" />
      <meta
        property="og:image"
        content="https://utfs.io/f/a9aac9ef-bfd1-4809-ac96-ea741a47f888-inw0fb.png"
      />
      <meta
        property="og:description"
        content="Objednaj si desiatu už teraz!"
      ></meta>
      <body className={inter.className}>
        <MainLayoutWrapper attribute="class" defaultTheme="light">
          {children}
        </MainLayoutWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
