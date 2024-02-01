"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex min-h-screen flex-col gap-4 items-center justify-center">
      <Alert className=" max-w-screen-sm">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Toto je testovacia verzia!</AlertTitle>
      </Alert>
      <LoginButton />
    </div>
  );
}

const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        onClick={() => {
          signIn("azure-ad", { callbackUrl: "/auth/redirect" });
        }}
      >
        Sign in with Azure AD
      </button>
    </>
  );
};
