import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/userUtils";
import NavWrapper from "@/components/nav/navWrapper";
import NavButton from "@/components/nav/navButton";

export default async function authLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user || !user.isSeller) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavWrapper>
        <NavButton href="/auth/s/summary" text="Summary" />
        <NavButton href="/auth/s/take" text="Take" />
        <NavButton href="/auth/s/unblock" text="Unblock" />
        <NavButton href="/auth/s/block" text="Block" />
      </NavWrapper>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
