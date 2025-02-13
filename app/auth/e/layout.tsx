import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/user-utils";
import NavWrapper from "@/components/nav/nav-wrapper";
import NavButton from "@/components/nav/nav-button";
import Head from "next/head";

export default async function authLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user || !user.isEmployee) {
    redirect("/");
  }

  return (
    <div style={{ minHeight: "100dvh" }} className="flex flex-col">
      <Head>
        <title>bageta.express | Dashboard</title>
      </Head>
      <NavWrapper>
        <NavButton href="/auth/e/dashboard" text="Dashboard" />
        <NavButton href="/auth/e/access" text="Správa" />
      </NavWrapper>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
