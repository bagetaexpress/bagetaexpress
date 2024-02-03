"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MsLogo from "@/assets/ms-symbollockup.svg";

export default function LoginServices() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    return (
      <Button
        className="w-full"
        title="Prejsť do aplikácie"
        onClick={() => router.push("/auth/redirect")}
      />
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
