import { ReactNode } from "react";
import UserDropdown from "./userDropdown";
import logo from "@/assets/logomark.svg";
import Image from "next/image";

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
        <div className="relative h-10 w-28">
          {/* <p className="text-xl font-semibold">bagetaExpress</p> */}
          <Image src={logo} alt="bagetaExpress" fill className=" max-h-10" />
        </div>
        <div className="flex gap-1">
          {children}
          <UserDropdown />
        </div>
      </nav>
    </div>
  );
}
