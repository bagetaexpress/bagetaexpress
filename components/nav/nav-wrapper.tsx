import { ReactNode } from "react";
import Link from "next/link";
import UserDropdown from "./user-dropdown";
import LogomarkJS from "./logomark-js";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user-utils";

export default async function NavWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  let home = "/";
  switch (true) {
    case user?.isSeller:
      home = "/auth/s/summary";
      break;
    case user?.isEmployee:
      home = "/auth/e/dashboard";
      break;
    case user?.isCustomer:
      home = "/auth/c/store";
      break;
    case user?.isAdmin:
      home = "/auth/a/dashboard";
      break;
    default:
      home = "/";
      break;
  }

  return (
    <div className="bg-primary text-primary-foreground p-2">
      <nav className="w-full h-fit flex flex-row items-center justify-between max-w-screen-lg mx-auto">
        <div className="relative h-10 w-28">
          <Link prefetch={false} href={home}>
            <LogomarkJS
              style={{ fill: "hsl(var(--primary-foreground))" }}
              className="max-h-10 flex-1"
            />
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex rounded-md overflow-hidden divide-x divide-muted-foreground">
            {children}
          </div>
          {user && <UserDropdown />}
        </div>
      </nav>
    </div>
  );
}
