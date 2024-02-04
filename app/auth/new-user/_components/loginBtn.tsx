"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LoginBtn() {
  useEffect(() => {
    (async () => {
      await signOut({ callbackUrl: "/?created=True" });
    })();
  }, []);

  return (
    <Button
      onClick={async () => {
        await signOut({ callbackUrl: "/" });
      }}
      className="w-full gap-3"
    >
      Prihlásiť sa
      <LogIn size={22} />
    </Button>
  );
}
