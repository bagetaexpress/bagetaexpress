"use client";

import QrScanner from "@/components/qr-reader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Scanner({ url }: { url: string }) {
  const [pinError, setPinError] = useState("");
  const router = useRouter();

  return (
    <>
      <div className="">
        <QrScanner
          onResult={(result, error, controls) => {
            if (!!error) return;
            if (!!result) {
              const pin = result.getText();
              if (pin.length !== 4) return;
              if (pin.match(/\D/)) return;

              controls?.stop();
              router.replace(`${url}/${pin}`);
            }
          }}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const pin = formData.get("pin") as string;

            if (pin.length !== 4 || pin.match(/\D/)) {
              setPinError("Kód musí obsahovať 4 čísla.");
              return;
            }

            router.replace(`${url}/${pin}`);
          }}
          className="flex justify-center items-center gap-2 mt-2"
        >
          <Input
            name="pin"
            inputMode="text"
            required
            onChange={() => setPinError("")}
          />
          <Button type="submit" size="icon" className="aspect-square">
            <Search />
          </Button>
        </form>
        {!!pinError && <p className="text-red-500 pt-1">{pinError}</p>}
      </div>
    </>
  );
}
