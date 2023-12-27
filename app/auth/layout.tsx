import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import { ReactNode } from "react";

export default function authLayout({ children }: { children: ReactNode }) {
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
              <Button variant="ghost">
                Shopping car
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="/auth/user">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </nav>
      </div>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
