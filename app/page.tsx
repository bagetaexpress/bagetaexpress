import LoginServices from "./_components/login-services";
import {
  BlobFullPrimary,
  BlobOutlineSecondary,
  BlobPatternBlack,
  BlurGradientBackground,
  BlobFullPrimary2,
} from "@/components/blob";

import MockUpStore from "@/assets/images/landing_page_store.png";
import MockUpDashboard from "@/assets/images/landing_page_dashboard.png";
import MockUpSeller from "@/assets/images/landing_page_seller.png";
import MockUpOrder from "@/assets/images/landing_page_order.png";

import Image from "next/image";
import LogomarkJS from "@/components/nav/logomark-js";
import UserDropdown from "@/components/nav/user-dropdown";
import Link from "next/link";
import { LayoutDashboard, QrCode, ShoppingBag, Menu } from "lucide-react";
import { Suspense } from "react";
import EmailForm from "./_components/email-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getUser } from "@/lib/user-utils";
import { redirect, RedirectType } from "next/navigation";
import {
  FeatureCardWrapper,
  SectionReveal,
  ContactReveal,
} from "./_components/landing-page-client";

// Server component wrapper for redirect logic
export default async function HomeWrapper() {
  return (
    <>
      <LandingPage />
      <RedirectWrapper />
    </>
  );
}

async function RedirectWrapper() {
  const user = await getUser();
  if (user == null) {
    return null;
  }
  switch (true) {
    case user.isEmployee || user.isAdmin:
      redirect("/auth/e/dashboard", RedirectType.replace);
    case user.isSeller:
      redirect("/auth/s/summary", RedirectType.replace);
    case user.isCustomer:
      redirect("/auth/c/store", RedirectType.replace);
  }
  return null;
}

// Feature card data type
type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  image: typeof MockUpDashboard;
  delay?: number;
};

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  image,
  delay = 0,
}: FeatureCardProps) {
  return (
    <FeatureCardWrapper delay={delay}>
      <Card className="group h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
        <div className="aspect-[3/2] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl">{title}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </FeatureCardWrapper>
  );
}

function LandingPage() {
  return (
    <div className="min-h-[100dvh] overflow-hidden relative">
      {/* Background decorations */}
      <BlurGradientBackground className="absolute left-0 top-0 w-full aspect-square opacity-40 z-[-10]" />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col relative px-5">
        {/* Blobs positioned strategically */}
        <BlobFullPrimary className="z-[-1] absolute top-[20%] right-[-20%] aspect-square w-[60rem] opacity-80" />
        <BlobPatternBlack className="z-[-1] absolute top-[30%] right-[-10%] aspect-square w-[50rem] scale-75" />
        <BlobOutlineSecondary className="z-[-1] absolute bottom-[-10%] left-[-20%] aspect-square w-[50rem]" />

        {/* Navigation */}
        <nav className="h-fit flex flex-row items-center justify-between max-w-screen-xl mx-auto sm:mt-5 w-full sm:w-[calc(100%-2.5rem)] bg-background/80 backdrop-blur-md p-4 sm:p-5 sm:rounded-xl sticky top-0 sm:top-5 shadow-lg z-50">
          <div className="relative h-8 sm:h-10 w-24 sm:w-28">
            <Link prefetch={false} href="/">
              <LogomarkJS
                style={{ fill: "hsl(var(--primary-foreground))" }}
                className="max-h-8 sm:max-h-10 flex-1"
              />
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            {/* Desktop nav links */}
            <div className="hidden sm:flex rounded-md overflow-hidden divide-x">
              <Link
                prefetch={false}
                href="#features"
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Funkcie
              </Link>
              <Link
                prefetch={false}
                href="#contact"
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Kontakt
              </Link>
              <Link
                prefetch={false}
                href="/support"
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Podpora
              </Link>
            </div>
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="sm:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Otvoriť menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-4 mt-8">
                  <Link
                    href="#features"
                    className="text-lg font-medium py-2 hover:text-primary transition-colors"
                  >
                    Funkcie
                  </Link>
                  <Link
                    href="#contact"
                    className="text-lg font-medium py-2 hover:text-primary transition-colors"
                  >
                    Kontakt
                  </Link>
                  <Link
                    href="/support"
                    className="text-lg font-medium py-2 hover:text-primary transition-colors"
                  >
                    Podpora
                  </Link>
                  <div className="pt-4 border-t">
                    <LoginServices />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Suspense fallback={null}>
              <UserDropdown />
            </Suspense>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-screen-xl mx-auto w-full py-12 lg:py-0">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left animate-[fadeInUp_0.8s_ease-out]">
            <h1
              className="font-extrabold tracking-tight mb-6"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                lineHeight: 1.1,
              }}
            >
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out]">
                NASKENUJ.
              </span>
              <br />
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out_0.1s_both] text-primary">
                OBJEDNAJ.
              </span>
              <br />
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
                VYCHUTNAJ.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              <span className="font-semibold text-foreground">
                BagetaExpress
              </span>{" "}
              je moderný objednávací systém pre študentov. Jednoduché a rýchle
              objednávanie jedla priamo na vašej škole.
            </p>
            <div className="animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
              <LoginServices />
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 relative animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl scale-95" />
              <Image
                src={MockUpStore}
                alt="BagetaExpress obchod"
                className="relative w-full max-w-[600px] mx-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <Link
            href="#features"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-sm">Zistiť viac</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 px-5 relative">
        <BlobFullPrimary2 className="z-[-1] absolute top-[50%] left-[-30%] aspect-square w-[60rem] opacity-60" />

        <div className="max-w-screen-xl mx-auto">
          {/* Section Header */}
          <SectionReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Všetko čo potrebujete
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Kompletné riešenie pre správu objednávok, od administrácie až po
              výdaj
            </p>
          </SectionReveal>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={LayoutDashboard}
              title="Jednoduchá správa"
              description="Pridávajte jedlá, upravujte ceny, sledujte objednávky a získajte podrobný prehľad o vašom obchode. Všetko na jednom mieste."
              image={MockUpDashboard}
              delay={0}
            />
            <FeatureCard
              icon={QrCode}
              title="Bezproblémové prevzatie"
              description="Naskenujte QR kód alebo zadajte kód manuálne. Prehľadné informácie o objednávke, rýchle a efektívne."
              image={MockUpSeller}
              delay={100}
            />
            <FeatureCard
              icon={ShoppingBag}
              title="Rýchle objednanie"
              description="Prihláste sa školským účtom a objednajte si obľúbené jedlo. Interaktívne rozhranie dostupné vždy a všade."
              image={MockUpOrder}
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-24 lg:py-32 px-5 relative">
        <BlobPatternBlack className="z-[-1] absolute top-0 right-[-20%] aspect-square w-[40rem] rotate-45 opacity-50" />
        <BlobOutlineSecondary className="z-[-1] absolute bottom-0 left-[-15%] aspect-square w-[35rem] opacity-70" />

        <ContactReveal className="max-w-screen-md mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
                  Máte záujem?
                </h2>
                <p className="text-lg text-primary-foreground/90">
                  Zanechajte nám svoj email a my vás kontaktujeme
                </p>
              </div>
              <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <Suspense fallback={null}>
                  <EmailForm />
                </Suspense>
              </div>
            </div>
          </div>
        </ContactReveal>
      </section>
    </div>
  );
}
