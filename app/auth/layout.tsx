import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ReactNode } from "react";

export default function authLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="bg-primary text-primary-foreground p-2">
        <nav
          className="
          w-full h-fit flex flex-row items-center
          justify-between max-w-screen-lg mx-auto"
        >
          <div>
            <p className="text-xl font-semibold">bagetaExpress</p>
          </div>
          <div className="flex gap-2">
            <a href="/auth/store">
              <Button variant="ghost">Home</Button>
            </a>
            <a href="/auth/cart">
              <Button variant="ghost">
                Shopping car
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </nav>
      </div>
      <main className="max-w-screen-lg mx-auto p-2">{children}</main>
    </div>
  );
}
