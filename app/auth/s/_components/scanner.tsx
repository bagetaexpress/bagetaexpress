"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function Scanner({ url }: { url: string }) {
  const [pinError, setPinError] = useState("");
  const router = useRouter();

  return (
    <>
      <div className="">
        <QrReader
          onResult={(result, error) => {
            if (!!error) return;
            if (!!result) {
              // @ts-ignore
              const pin = result.text as string;
              if (pin.length !== 4) return;
              if (pin.match(/\D/)) return;

              router.push(`${url}/${pin}`);
            }
          }}
          constraints={{ facingMode: "environment" }}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const pin = formData.get("pin") as string;

            if (pin.length !== 4 || pin.match(/\D/)) {
              setPinError("Pin must be 4 digits");
              return;
            }

            router.push(`${url}/${pin}`);
          }}
          className="flex justify-center items-center gap-2 mt-2"
        >
          <Input name="pin" required onChange={() => setPinError("")} />
          <Button type="submit" size="icon" className=" aspect-square">
            <Search />
          </Button>
        </form>
        {!!pinError && <p className="text-red-500 pt-1">{pinError}</p>}
      </div>
    </>
  );
}
