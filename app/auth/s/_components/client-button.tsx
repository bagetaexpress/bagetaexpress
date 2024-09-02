"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";

interface IProps {
  action: () => void | Promise<void>;
  text: string;
}

export default function ClientButton({ action, text }: IProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      await action();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      className=" flex flex-row gap-2"
      disabled={isLoading}
    >
      {isLoading && <LoaderIcon className=" animate-spin w-5 h-5" />}
      {text}
    </Button>
  );
}
