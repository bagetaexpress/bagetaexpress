"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";

type SearchParams = { [key: string]: string | string[] | undefined };

const ERROR_COPY: Record<
  string,
  { title: string; description: string }
> = {
  AccessDenied: {
    title: "Prístup zamietnutý",
    description:
      "Nemáte povolenie na prístup. Skúste použiť správny účet alebo kontaktujte podporu.",
  },
  OAuthAccountNotLinked: {
    title: "Účet nie je prepojený",
    description:
      "Účet s týmto emailom je už registrovaný iným spôsobom prihlasovania. Prihláste sa rovnakým poskytovateľom ako pri registrácii.",
  },
  OAuthSignin: {
    title: "Chyba pri prihlasovaní",
    description:
      "Prihlásenie zlyhalo. Skúste to znova alebo použite iný účet.",
  },
  OAuthCallback: {
    title: "Chyba pri návrate z poskytovateľa",
    description:
      "Nastala chyba počas prihlasovania u poskytovateľa. Skúste to znova.",
  },
  Callback: {
    title: "Chyba pri spracovaní prihlásenia",
    description: "Niečo sa pokazilo počas spracovania prihlásenia.",
  },
  Configuration: {
    title: "Chybná konfigurácia",
    description:
      "Prihlásenie nie je správne nakonfigurované. Kontaktujte podporu.",
  },
  EmailSignin: {
    title: "Chyba pri emailovom prihlásení",
    description: "Overte email alebo skúste to znova neskôr.",
  },
  CredentialsSignin: {
    title: "Neplatné prihlasovacie údaje",
    description: "Skontrolujte údaje a skúste to znova.",
  },
  SessionRequired: {
    title: "Relácia vyžadovaná",
    description: "Na zobrazenie tejto stránky sa musíte prihlásiť.",
  },
  Default: {
    title: "Niečo sa pokazilo",
    description:
      "Vyskytla sa neočakávaná chyba. Skúste to znova alebo sa vráťte späť.",
  },
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const code = typeof searchParams.error === "string" ? searchParams.error : "";
  const { title, description } = ERROR_COPY[code] ?? ERROR_COPY.Default;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm10.5-5.25a1.5 1.5 0 10-3 0v6a1.5 1.5 0 003 0v-6Zm-1.5 10.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {code ? (
          <p className="mt-2 text-xs text-muted-foreground">Kód chyby: {code}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => signIn("azure-ad", { callbackUrl: "/auth/redirect" })}>
            Skúsiť znova
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">Domov</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}