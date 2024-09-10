"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <Button
      onClick={async () => {
        await signOut({ callbackUrl: "/" });
      }}
      className="w-full gap-3"
    >
      Odhlásiť sa
      <LogOut size={22} />
    </Button>
  );
}
