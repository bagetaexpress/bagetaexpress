import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check, AlertTriangle } from "lucide-react";
import Scanner from "../_components/scanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bageta.express | Odblokovať užívateľa",
};

export default async function UnblockPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className=" relative min-h-full max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-semibold pt-2">Odblokovať</h1>
      {searchParams.success === "true" && (
        <Alert className=" mb-4 bg-green-300 border-green-500 bg-opacity-50">
          <Check className="w-6 h-6" />
          <AlertTitle>Účet bol úspešne odblokovaný</AlertTitle>
        </Alert>
      )}
      {searchParams.success === "false" && (
        <Alert className=" mb-4 bg-red-300 border-red-500 bg-opacity-50">
          <AlertTriangle className="w-6 h-6" />
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>
            Účet sa nepodarilo odblokovať. Skúste to znova.
          </AlertDescription>
        </Alert>
      )}
      <Scanner url="/auth/s/unblock" />
    </div>
  );
}
