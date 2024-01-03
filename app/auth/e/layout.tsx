import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/userUtils";
import NavWrapper from "@/components/nav/NavWrapper.1";
import NavButton from "@/components/nav/navButton";

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
        <NavButton href="/auth/e/access" text="Manager" />
      </NavWrapper>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
