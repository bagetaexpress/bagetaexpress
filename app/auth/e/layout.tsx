import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/user-utils";
import NavWrapper from "@/components/nav/nav-wrapper";
import NavButton from "@/components/nav/nav-button";
import type { Metadata } from "next";
import SwitchSchoolStore from "@/components/switch-school-store";

export const metadata: Metadata = {
  title: "bageta.express | Dashboard",
};

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
      <NavWrapper>
        <NavButton href="/auth/e/dashboard" text="Dashboard" />
        <NavButton href="/auth/e/access" text="Správa" />
      </NavWrapper>
      <SwitchSchoolStore adminOnly showChangeStore path="/auth/e/dashboard" />
      <div className="p-2 pb-20 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
