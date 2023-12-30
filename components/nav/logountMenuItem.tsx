"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function LogoutMenuItem() {
  return (
    <DropdownMenuItem
      onClick={() => {
        void signOut({ callbackUrl: "/" });
      }}
    >
      Logout
    </DropdownMenuItem>
  );
}
