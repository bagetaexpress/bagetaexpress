"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function LogoutMenuItem() {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={() => {
        router.push("/");
        void signOut({ callbackUrl: "/" });
      }}
    >
      Odhlásiť sa
    </DropdownMenuItem>
  );
}
