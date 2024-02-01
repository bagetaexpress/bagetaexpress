"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginServices from "./_components/LoginServices";
import SvgLogo from "@/assets/bagetaExpress_logo.svg";
import SvgBrandmark from "@/assets/bagetaExpress_brandmark.svg";
import SvgLogomark from "@/assets/logomark.svg";

import Image from "next/image";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,215,16,1) 100%)",
        }}
        className=" justify-center items-center hidden md:flex"
      >
        <Image src={SvgBrandmark} alt="Bageta Express logo" width={300} />
        <Image
          src={SvgLogomark}
          alt="Bageta Express logo"
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            padding: "1.5rem",
          }}
          width={250}
        />
      </div>
      <div className="flex min-h-screen flex-col gap-4 items-center justify-center">
        <div className=" md:hidden p-4 pb-8">
          <Image src={SvgLogo} alt="Bageta Express logo" width={225} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle> Prihlásiť sa</CardTitle>
            <CardDescription>
              Pre prístup do aplikácie sa prihláste
              <br /> pomocou svojho <b>školského</b> účtu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginServices />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
