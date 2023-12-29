import UserDropdown from "@/app/auth/(customer)/_components/userDropdown";

import { ReactNode } from "react";

export default async function NavWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-primary text-primary-foreground p-2">
      <nav
        className="
          w-full h-fit flex flex-row items-center
          justify-between max-w-screen-lg mx-auto"
      >
        <div>
          <p className="text-xl font-semibold">bagetaExpress</p>
        </div>
        <div className="flex gap-1">
          {children}
          <UserDropdown />
        </div>
      </nav>
    </div>
  );
}
