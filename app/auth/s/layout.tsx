import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/userUtils";
import NavWrapper from "@/components/nav/NavWrapper.1";
import NavButton from "@/components/nav/navButton";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className=" hidden sm:inline-block">
        <NavWrapper>
          <NavButton href="/auth/s/summary" text="Summary" />
          <NavButton href="/auth/s/take" text="Take" />
          <NavButton href="/auth/s/unblock" text="Unblock" />
          <NavButton href="/auth/s/block" text="Block" />
        </NavWrapper>
      </div>
      <div className="sm:hidden">
        <NavWrapper>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <a href="/auth/s/summary">
                <DropdownMenuItem>Summary</DropdownMenuItem>
              </a>
              <a href="/auth/s/take">
                <DropdownMenuItem>Take</DropdownMenuItem>
              </a>
              <a href="/auth/s/unblock">
                <DropdownMenuItem>Unblock</DropdownMenuItem>
              </a>
              <a href="/auth/s/block">
                <DropdownMenuItem>Block</DropdownMenuItem>
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavWrapper>
      </div>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
