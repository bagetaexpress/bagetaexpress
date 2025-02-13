import LoginServices from "./_components/login-services";
import {
  BlobFullPrimary,
  BlobOutlineWhite,
  BlobOutlineSecondary,
  BlobPatternBlack,
  BlurGradientBackground,
  BlobOutlineSecondary2,
  BlobFullPrimary2,
  BlobPatternBlack2,
} from "@/components/blob";

import MockUpStore from "@/assets/images/landing_page_store.png";
import MockUpDashboard from "@/assets/images/landing_page_dashboard.png";
import MockUpSeller from "@/assets/images/landing_page_seller.png";
import MockUpSeller1 from "@/assets/images/landing_page_seller_1.png";
import MockUpSeller2 from "@/assets/images/landing_page_seller_2.png";
import MockUpSeller3 from "@/assets/images/landing_page_seller_3.png";
import MockUpOrder from "@/assets/images/landing_page_order.png";
import MockUpOrder1 from "@/assets/images/landing_page_order_1.png";
import MockUpOrder2 from "@/assets/images/landing_page_order_2.png";
import MockUpOrder3 from "@/assets/images/landing_page_order_3.png";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import LogomarkJS from "@/components/nav/logomark-js";
import UserDropdown from "@/components/nav/user-dropdown";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Github, Instagram, Pointer } from "lucide-react";
import { PopupCarousel } from "@/components/ui/custom/popup-carousel";
import { Suspense } from "react";
import EmailForm from "./_components/email-form";
import { getUser } from "@/lib/user-utils";
import { redirect, RedirectType } from "next/navigation";

export default function HomeWrapper() {
  return (
    <>
      <Home />
      <Suspense fallback={null}>
        <RedirectWrapper />
      </Suspense>
    </>
  );
}

async function RedirectWrapper() {
  const user = await getUser();
  if (user == null) {
    return;
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

export function Home() {
  return (
    <div className="min-h-[100dvh] overflow-hidden relative">
      <BlurGradientBackground className="absolute left-0 top-0 w-full aspect-square opacity-50 z-[-10]" />
      <div className="flex min-h-screen flex-col items-center justify-center gap-10 relative px-5">
        <BlobOutlineWhite className="z-[-1] absolute top-[50dvh] left-1/2 aspect-square max-w-[150%] w-[75rem] scale-[0.8] translate-x-[-40%] translate-y-[-70%]" />
        <BlobPatternBlack className="z-[-1] absolute top-[50dvh] left-1/2 aspect-square max-w-[150%] w-[75rem] scale-[0.8] translate-x-[-30%] translate-y-[-29%]" />
        <BlobFullPrimary className="z-[-1] absolute top-[50dvh] left-1/2 aspect-square max-w-[150%] w-[75rem] scale-[1.2] translate-x-[-60%] translate-y-[-30%]" />
        <BlobOutlineSecondary className="z-[-1] absolute top-[50dvh] left-1/2 aspect-square max-w-[150%] w-[75rem] scale-[0.8] translate-x-[-60%] translate-y-[0%]" />
        <nav className="h-fit flex flex-row items-center justify-between max-w-screen-lg sm:mt-5 w-full sm:w-[calc(100%-2.5rem)] bg-background p-5 sm:rounded-xl absolute top-0 left-1/2 translate-x-[-50%] shadow-2xl">
          <div className="relative h-10 w-28">
            <Link prefetch={false} href="/">
              <LogomarkJS
                style={{ fill: "hsl(var(--primary-foreground))" }}
                className="max-h-10 flex-1"
              />
            </Link>
          </div>
          <div className="flex gap-1">
            <Link prefetch={false} href="/#description">
              <Button variant="ghost">Čo robíme?</Button>
            </Link>
            <Link prefetch={false} href="/#contact">
              <Button variant="ghost">Kontakt</Button>
            </Link>
            <Suspense fallback={null}>
              <UserDropdown />
            </Suspense>
          </div>
        </nav>
        <div className="text-center mt-[20dvh]">
          <h1
            className="font-extrabold"
            style={{
              fontSize: "clamp(3rem, 10vw, 6rem)",
              lineHeight: 1,
            }}
          >
            NASKENUJ
            <br />
            <span
              style={{
                WebkitTextStroke: "clamp(2px, 0.5vw, 4px) black",
                color: "transparent",
              }}
            >
              OBJEDNAJ
            </span>
            <br />
            VYCHUTNAJ
          </h1>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold max-w-prose pb-4">
            <span className="underline">BagetaExpress</span> je objednávací
            systém pre študentov ktorý ponúka jednoduché a bezproblémové
            riešenie objednávania jedla na školy
          </p>
          <LoginServices />
        </div>
        <Image
          src={MockUpStore}
          alt="Bageta Express store mockup"
          className="w-[1024px] max-w-[140%]"
        />
      </div>
      <div
        id="description"
        className="grid max-w-screen-lg mx-auto mt-52 gap-y-40 px-5"
      >
        <div className="grid sm:grid-cols-2">
          <div className="flex flex-col justify-center gap-4">
            <h3 className="font-bold text-3xl">Jednoduchá správa</h3>
            <p className="max-w-prose font-ligh text-lg">
              Pridaj nové jedlá, uprav ceny, sleduj objednávky a získaj podrobný
              prehľad o svojom obchode, individuálne spravuj školy, tlač štítky,
              spravuj zamestnancov a viac! Všetko na jednom mieste, dostupné
              kedykoľvek a odkiaľkoľvek.
            </p>
          </div>
          <div className="relative">
            <BlobFullPrimary className="absolute left-0 bottom-0 z-[-1] w-[50rem] aspect-square rotate-90 translate-x-[-25%] translate-y-[10%]" />
            <BlobPatternBlack className="absolute left-0 bottom-0 z-[-1] w-[50rem] scale-[0.8] aspect-square rotate-90 translate-x-[-25%] translate-y-[25%]" />
            <PopupCarousel
              items={[
                <Image
                  key="dashboard1"
                  src={MockUpDashboard}
                  alt="Managment dashboard"
                  className="drop-shadow-xl aspect-[4/3] object-cover max-h-dvh"
                />,
              ]}
              className="flex"
            >
              <Image
                src={MockUpDashboard}
                alt="Managment dashboard"
                className="flex-1 sm:translate-x-[35%] scale-[1.3] sm:scale-[1.7] sm:hover:scale-[1.8] transition-transform duration-300 ease-in-out cursor-pointer"
              />
            </PopupCarousel>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 relative">
          <BlobOutlineSecondary2 className="absolute left-0 top-0 z-[-1] w-[50rem] scale-[0.9] aspect-square translate-x-[-20%] translate-y-[-10%]" />
          <BlobPatternBlack className="absolute left-0 top-0 z-[-1] w-[50rem] scale-[0.7] rotate-45 aspect-square translate-x-[-30%] translate-y-[0%]" />
          <PopupCarousel
            className="flex landing-page-seller"
            items={[
              <Image
                key="seller3"
                src={MockUpSeller3}
                alt="Seller page"
                className="drop-shadow-xl aspect-[9/13] object-cover max-h-dvh"
              />,
              <Image
                key="seller1"
                src={MockUpSeller1}
                alt="Seller page"
                className="drop-shadow-xl aspect-[9/13] object-cover max-h-dvh"
              />,
              <Image
                key="seller2"
                src={MockUpSeller2}
                alt="Seller page"
                className="drop-shadow-xl aspect-[9/13] object-cover max-h-dvh"
              />,
            ]}
          >
            <div className="hidden lg:inline relative cursor-pointer flex-1">
              <Pointer className="absolute right-[35%] bottom-0 translate-y-[100%] z-[10] w-[4rem] h-[4rem] shadow-lg p-3 rounded-full bg-muted text-muted-foreground pointer-events-none" />
              <Image
                src={MockUpSeller1}
                id="seller1"
                alt="Seller page"
                className="transition-transform duration-300 ease-in-out drop-shadow-2xl"
              />
              <Image
                id="seller2"
                src={MockUpSeller2}
                alt="Seller page"
                className="transition-transform duration-300 ease-in-out drop-shadow-2xl"
              />
              <Image
                id="seller3"
                src={MockUpSeller3}
                alt="Seller page"
                className="transition-transform duration-300 ease-in-out drop-shadow-2xl"
              />
              <Image
                src={MockUpSeller1}
                alt="Seller page"
                className="hidden sm:inline invisible"
              />
            </div>
            <Image
              src={MockUpSeller}
              alt="Seller summary and QR code scnanner"
              className="hidden sm:inline lg:hidden translate-x-[-35%] scale-[1.7] hover:scale-[1.8] transition-transform duration-300 ease-in-out cursor-pointer"
            />
            <Image
              src={MockUpSeller}
              alt="Seller summary and QR code scnanner"
              className="sm:hidden scale-[1.3] transition-transform duration-300 ease-in-out cursor-pointer"
            />
            <Pointer className="hidden sm:inline lg:hidden absolute right-[60%] bottom-0 translate-y-[50%] z-[10] w-[4rem] h-[4rem] shadow-lg p-3 rounded-full bg-muted text-muted-foreground pointer-events-none" />
            <Pointer className="sm:hidden absolute right-0 bottom-0 z-[10] w-[4rem] h-[4rem] translate-y-[-50%] translate-x-[-50%] shadow-lg p-3 rounded-full bg-muted text-muted-foreground pointer-events-none" />
          </PopupCarousel>
          <div className="flex flex-col order-first sm:order-last justify-center gap-4 transition-transform duration-300 ease-in-out landing-page-seller-text">
            <h3 className="font-bold text-3xl">Bezprobémové prevzanie</h3>
            <p className="max-w-prose font-ligh text-lg">
              Prevezmi objednávky jednoducho a rýchlo. Stačí naskenovať QR kód
              alebo zadať kód manuálne a objednávka je tvoja. Prehľadne
              zobrazené informácie o objednávke, možnosť zobraziť detaily a
              získať prehľad o objednávkach. To všetko v jednej aplikácii!
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 relative">
          <BlobFullPrimary2 className="absolute right-0 bottom-0 z-[-1] w-[50rem] aspect-square rotate-[-45deg] scale-[1.1] translate-x-[35%] sm:translate-y-[20%]" />
          <BlobOutlineSecondary className="absolute right-0 bottom-0 z-[-1] w-[50rem] aspect-square rotate-[-45deg] scale-[0.9] translate-x-[35%] sm:translate-y-[30%]" />
          <div className="flex flex-col justify-center gap-4 transition-transform duration-300 ease-in-out">
            <h3 className="font-bold text-3xl">Rýchle objednanie</h3>
            <p className="max-w-prose font-ligh text-lg">
              Prihlás sa skrz svoj školský účet a objednaj si svoje obľúbené
              jedlo jednoducho a rýchlo. Prehľadné zobrazenie jedál, rýchle
              objednanie, interaktívne rozhranie a možnosť sledovať svoju
              objednávku. Dostupné vždy a všade cez našu webovú stránku.
            </p>
          </div>
          <PopupCarousel
            className="flex landing-page-order"
            items={[
              <Image
                key="order3"
                src={MockUpOrder3}
                alt="Seller summary "
                className="drop-shadow-xl aspect-[9/13] object-cover max-h-dvh"
              />,
              <Image
                key="order1"
                src={MockUpOrder1}
                alt="Seller summary "
                className="drop-shadow-xl aspect-[9/13] object-cover max-h-dvh"
              />,
              <Image
                key="order2"
                src={MockUpOrder2}
                alt="Seller summary "
                className="drop-shadow-xl aspect-[9/13] object-cover max-h-dvh"
              />,
            ]}
          >
            <div className="hidden lg:inline relative cursor-pointer flex-1">
              <Pointer className="absolute left-[35%] bottom-0 translate-y-[100%] z-[10] w-[4rem] h-[4rem] shadow-lg p-3 rounded-full bg-muted text-muted-foreground pointer-events-none" />
              <Image
                src={MockUpOrder1}
                id="order1"
                alt="Seller summary and QR code scnanner"
                className="transition-transform duration-300 ease-in-out drop-shadow-2xl"
              />
              <Image
                id="order2"
                src={MockUpOrder2}
                alt="Seller summary and QR code scnanner"
                className="transition-transform duration-300 ease-in-out drop-shadow-2xl"
              />
              <Image
                id="order3"
                src={MockUpOrder3}
                alt="Seller summary and QR code scnanner"
                className="transition-transform duration-300 ease-in-out drop-shadow-2xl"
              />
              <Image
                src={MockUpOrder1}
                alt="Seller summary and QR code scnanner"
                className="hidden sm:inline invisible"
              />
            </div>
            <Image
              src={MockUpOrder}
              alt="Order screen"
              className="lg:hidden sm:translate-x-[35%] scale-[1.3] sm:scale-[1.7] sm:hover:scale-[1.8] transition-transform duration-300 ease-in-out cursor-pointer"
            />
            <Pointer className="hidden sm:inline lg:hidden absolute left-[65%] bottom-0 translate-y-[50%] z-[10] w-[4rem] h-[4rem] shadow-lg p-3 rounded-full bg-muted text-muted-foreground pointer-events-none" />
            <Pointer className="sm:hidden absolute right-0 bottom-0 z-[10] w-[4rem] h-[4rem] translate-y-[-75%] translate-x-[-75%] shadow-lg p-3 rounded-full bg-muted text-muted-foreground pointer-events-none" />
          </PopupCarousel>
        </div>
      </div>

      <div
        id="contact"
        className="relative flex flex-col gap-4 sm:gap-0 mt-52 lg:mt-80 bg-background rounded-xl p-5 shadow-2xl max-w-screen-lg mx-auto"
      >
        <BlobFullPrimary2 className="absolute top-0 left-0 z-[-1] w-[50rem] aspect-square scale-[1.2] translate-x-[-20%] translate-y-[-30%]" />
        <BlobOutlineSecondary2 className="absolute top-0 left-0 z-[-1] w-[50rem] aspect-square rotate-90 scale-[0.9] translate-x-[-30%] translate-y-[-20%]" />
        <BlobPatternBlack2 className="absolute right-0 bottom-0 z-[-1] w-[50rem] aspect-square rotate-45 scale-[0.9] translate-x-[35%] translate-y-[30%]" />
        <div className="text-center">
          <h2 className="text-4xl font-bold text-center">Máš Záujem?</h2>
          <p className="text-xl leading-loose">
            Zadajte email a my vás kontaktujeme!
          </p>
        </div>
        <Suspense fallback={null}>
          <EmailForm />
        </Suspense>
      </div>
      {/*
       */}

      <footer className="w-full min-h-40 bg-background mt-52 flex flex-col gap-2">
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
            href="https://www.github.com/tomz197"
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
          Copyright &copy; 2024 Tomáš Ž.
        </p>
      </footer>
    </div>
  );
}
