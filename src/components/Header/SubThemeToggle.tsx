"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";
import { useTheme } from "next-themes";

import {
  DropdownMenuItem,
  DropdownMenuSubContent,
} from "@/components/ui/DropdownMenu";

export const SubModeToggle = forwardRef<
  ElementRef<typeof DropdownMenuSubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuSubContent>
>(({ className, ...props }, ref) => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSubContent
      className={`z-[9999]${className}`}
      ref={ref}
      {...props}
    >
      <DropdownMenuItem onClick={() => setTheme("light")}>
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        System
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  );
});

SubModeToggle.displayName = "SubModeToggle";
