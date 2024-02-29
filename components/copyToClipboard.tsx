"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CopyToClipboardProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  value: string;
  name: string;
}

export default function CopyToClipboard({
  value,
  name,
  children,
  className,
  ...props
}: CopyToClipboardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p
            {...props}
            className={cn(className, "cursor-pointer")}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(value);
                toast(`${name} je zkopírované.`);
              } catch (e) {
                toast(`${name} sa nepodarilo skopírovať.`);
              }
            }}
          >
            {children}
          </p>
        </TooltipTrigger>
        <TooltipContent>Zkopírovať</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
