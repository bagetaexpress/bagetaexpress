import { ReactNode, Suspense } from "react";
import NavWrapper from "@/components/nav/nav-wrapper";
import NavButton from "@/components/nav/nav-button";
import { LoadingFill } from "@/app/loading";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavWrapper>
        <NavButton href="/auth/a/dashboard" text="Dashboard" />
      </NavWrapper>
      <main className="flex-1 max-w-screen-lg w-full mx-auto py-4">
        <Suspense fallback={<LoadingFill/>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
} 