"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MsLogo from "@/assets/ms-symbollockup.svg";

export default function LoginServices() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log(session);
  if (session && session.user) {
    return (
      <Button
        className="w-full"
        onClick={() => {
          switch (true) {
            case session.user.isEmployee:
              router.push("/auth/e/dashboard");
              break;
            case session.user.isSeller:
              router.push("/auth/s/summary");
              break;
            case session.user.isCustomer:
              router.push("/auth/c/store");
              break;
            default:
              router.push("/auth/redirect");
          }
        }}
      >
        Prejsť do aplikácie
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className=" px-3 gap-3"
        onClick={() => {
          signIn("azure-ad", { callbackUrl: "/auth/redirect" });
        }}
      >
        <Image height={24} width={24} src={MsLogo} alt="Ms logo" />
        Prihlásiť sa cez Microsoft
      </Button>
    </>
  );
}
