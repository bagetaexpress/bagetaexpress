import { ReactNode } from "react";
import UserDropdown from "./userDropdown";
import logo from "@/assets/logomark.svg";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/userUtils";

export default async function NavWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  let home = "/";
  switch (true) {
    case user.isSeller:
      home = "/auth/s/summary";
      break;
    case user.isEmployee:
      home = "/auth/e/dashboard";
      break;
    case user.isCustomer:
      home = "/auth/c/store";
      break;
  }

  return (
    <div className="bg-primary text-primary-foreground p-2">
      <nav
        className="
          w-full h-fit flex flex-row items-center
          justify-between max-w-screen-lg mx-auto"
      >
        <div className="relative h-10 w-28">
          {/* <p className="text-xl font-semibold">bagetaExpress</p> */}
          <a href={home}>
            <Image src={logo} alt="bagetaExpress" fill className=" max-h-10" />
          </a>
        </div>
        <div className="flex gap-1">
          {children}
          <UserDropdown />
        </div>
      </nav>
    </div>
  );
}
