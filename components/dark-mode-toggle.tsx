"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";

export function DarkModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-1 items-center justify-between">
        <p className="flex-1 text-start">Téma</p>
        <div className="flex justify-center items-center">
          <SunIcon
            size={16}
            className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <MoonIcon
            size={16}
            className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Svetlá
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Tmavá
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Systémová
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
