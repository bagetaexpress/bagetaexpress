import { Button } from "@/components/ui/button";
import UserDropdown from "@/app/auth/(customer)/_components/userDropdown";
import { ShoppingCart, User } from "lucide-react";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function authLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return (
      <div className="h-screen flex flex-col gap-2 justify-center items-center">
        <h1 className="text-2xl font-semibold">You are not logged in</h1>
        <a href="/">
          <Button>Login</Button>
        </a>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
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
            <a href="/auth/store">
              <Button variant="ghost">Home</Button>
            </a>
            <a href="/auth/cart">
              <Button variant="ghost" className="hidden sm:flex">
                Shopping car
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <UserDropdown />
          </div>
        </nav>
      </div>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
