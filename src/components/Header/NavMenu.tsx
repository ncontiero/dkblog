import Link from "next/link";

import {
  SignedIn,
  SignedOut,
  UserButton,
  currentUser,
  SignOutButton,
} from "@clerk/nextjs";
import { ModeToggle } from "../ThemeToggle";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "../ui/DropdownMenu";
import Image from "next/image";
import { SubModeToggle } from "./SubThemeToggle";

import { Pencil, Moon, Sun, User, LogOut } from "lucide-react";

export async function NavMenu() {
  const user = await currentUser();

  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex sm:hidden">
            <Button size="icon" className="rounded-full">
              <Image
                src={user?.imageUrl || ""}
                alt={`${user?.firstName} ${user?.lastName}`}
                width={32}
                height={32}
                className="aspect-square h-full w-full rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[999999] w-56">
            <DropdownMenuItem className="p-0">
              <Link
                href={`/${user?.username}`}
                aria-label="Go to your profile page"
                className="flex w-full items-center px-2 py-3"
              >
                <User className="mr-3" size={16} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href="/new"
                aria-label="Go to create post page"
                className="flex w-full items-center px-2 py-3"
              >
                <Pencil className="mr-3" size={16} />
                Create Post
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="py-3">
                <>
                  <Sun className="mr-2 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute mr-2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Toggle theme</span>
                </>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <SubModeToggle />
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem className="p-0">
              <SignOutButton>
                <span
                  className="flex w-full items-center px-2 py-3"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="mr-3" size={16} />
                  Sign out
                </span>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="outlinePrimary" size="sm">
            <Link href="/new" aria-label="Go to create post page">
              <span className="hidden sm:flex">Create Post</span>
              <Pencil className="flex sm:hidden" size={16} />
            </Link>
          </Button>
          <ModeToggle />
          <UserButton
            afterSignOutUrl="/"
            userProfileMode="navigation"
            userProfileUrl={`/${user?.username}`}
          />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="flex h-full items-center justify-center rounded-md p-2 uppercase ring-ring duration-200 hover:text-primary focus:text-primary focus:outline-none focus:ring-2 active:opacity-70 sm:w-auto sm:px-4 sm:py-2 sm:font-bold"
          >
            Login
          </Link>
          <ModeToggle />
        </div>
      </SignedOut>
    </>
  );
}
