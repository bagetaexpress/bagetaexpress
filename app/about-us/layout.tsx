import { Metadata } from "next";
import { ReactNode } from "react";
import NavWrapper from "@/components/nav/nav-wrapper";
import NavButton from "@/components/nav/nav-button";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const metadata: Metadata = {
  title: "bageta.express | O nás",
  description: "Zistite viac o BagetaExpress a nás",
};

export default function AboutUsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="hidden sm:inline-block">
        <NavWrapper>
          <NavButton href="/" text="Domov" />
          <NavButton href="/about-us" text="O nás" />
          <NavButton href="/support" text="Podpora" />
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
              <Link prefetch={false} href="/">
                <DropdownMenuItem>Domov</DropdownMenuItem>
              </Link>
              <Link prefetch={false} href="/about-us">
                <DropdownMenuItem>O nás</DropdownMenuItem>
              </Link>
              <Link prefetch={false} href="/support">
                <DropdownMenuItem>Podpora</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavWrapper>
      </div>
      <div className="p-2 pb-20 flex-1">
        <main className="max-w-screen-lg mx-auto">{children}</main>
      </div>
    </div>
  );
} 