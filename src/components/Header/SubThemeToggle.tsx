"use client";

import { useTheme } from "next-themes";

import {
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";

export function SubModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSubContent className="z-[9999]">
      <DropdownMenuItem onClick={() => setTheme("light")}>
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        System
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  );
}
