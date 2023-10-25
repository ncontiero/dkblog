import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-[9999] h-16 w-full border-b-2 bg-secondary/80 backdrop-blur">
      <div className="flex h-full w-full items-center justify-between px-4 sm:container">
        <Link
          href="/"
          className="rounded-md p-2 text-2xl font-bold duration-200 hover:opacity-70 focus:outline-none focus:ring focus:ring-ring"
        >
          DkBlog
        </Link>
        <div className="flex items-center gap-2">
          <SignedOut>
            <Link
              href="/sign-in"
              className="flex h-full items-center justify-center gap-2 rounded-md p-2 font-bold uppercase ring-ring duration-200 hover:text-primary focus:text-primary focus:outline-none focus:ring-2 active:opacity-70 sm:w-auto sm:px-4 sm:py-2"
            >
              Login
            </Link>
          </SignedOut>
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" userProfileMode="modal" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
