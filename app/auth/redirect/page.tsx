import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutBtn from "./_components/LogoutBtn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Facebook, Instagram, Link } from "lucide-react";
import { getSchoolDomains } from "@/db/controllers/schoolController";
import { authOptions } from "@/lib/authOptions";

export default async function RedirectPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/");
  }
  if (session.user.isEmployee && !session.user.isAdmin) {
    redirect("/auth/e/dashboard");
  }
  if (session.user.isSeller && !session.user.isAdmin) {
    redirect("/auth/s/summary");
  }
  if (session.user.isCustomer && !session.user.isAdmin) {
    redirect("/auth/c/store");
  }

  const schoolDomains = await getSchoolDomains();

  return (
    <div
      style={{ minHeight: "100dvh" }}
      className="flex flex-col justify-center items-center p-2"
    >
      <div className="flex flex-col">
        <h1 className=" font-semibold text-xl">
          Nenašla sa škola k emailu {session.user.email}
        </h1>
        <p className=" text-lg mb-4">Prihlálste sa cez Váš školský účet</p>
        <p className=" text-lg mb-4">
          Váš email by mal končiť na jednu z adries:
          <br />
          <span className=" font-medium">{schoolDomains.join(", ")}</span>
        </p>
        <h2 className="text-lg font-semibold">Časté problémy</h2>
        <Accordion type="single" defaultValue="Problem1">
          <AccordionItem value="Problem1">
            <AccordionTrigger>
              <p>Automaticky ma prihlasuje na tento účet</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className=" max-w-[55ch]">
                Ak pri prihlásení nemáte možnosť vybrania microsoft účtu ale
                prihlási vás automaticky na tento, tak sa z neho musíte odhlásiť
                cez{" "}
                <a
                  target="_blank"
                  href="https://www.microsoft.com/"
                  className=" underline text-blue-500 hover:text-blue-700"
                >
                  stránku microsoftu
                  <Link className="w-4 h-4 ml-1 inline-block" />
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Problem2">
            <AccordionTrigger>
              <p>Niečo iné</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className=" max-w-[55ch]">
                Napíšte nám správu na{" "}
                <a
                  target="_blank"
                  href="https://www.instagram.com/bagetaexpress?igsh=Zmt0eTZqMXE5cnZx"
                  className=" underline text-blue-500 hover:text-blue-700"
                >
                  instagram @bagetaexpress
                </a>{" "}
                alebo{" "}
                <a
                  target="_blank"
                  href="https://www.instagram.com/bagetaexpress?igsh=Zmt0eTZqMXE5cnZx"
                  className=" underline text-blue-500 hover:text-blue-700"
                >
                  facebook Bagetaexpress
                </a>{" "}
                a my Vám s radosťou pomôžeme
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <LogoutBtn />
      </div>
    </div>
  );
}
