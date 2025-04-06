import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { UserButton } from "./UserButton";

export async function Header() {
  const user = await currentUser();

  return (
    <header className="sticky inset-x-0 top-0 z-[9999] h-16 w-full border-b-2 bg-secondary/80 backdrop-blur">
      <div className="flex size-full items-center justify-between px-4 sm:container">
        <Link
          href="/"
          className="rounded-md p-2 text-2xl font-bold duration-200 hover:opacity-70 focus:outline-none focus:ring focus:ring-ring"
        >
          DkBlog
        </Link>
        <div className="flex items-center gap-3">
          <SignedIn>
            <Button asChild variant="outlinePrimary" size="sm">
              <Link href="/new" aria-label="Go to create post page">
                <span className="hidden sm:flex">Create Post</span>
                <Pencil className="flex sm:hidden" size={16} />
              </Link>
            </Button>
            <UserButton username={user?.username} />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="flex h-full items-center justify-center rounded-md p-2 uppercase ring-ring duration-200 hover:text-primary focus:text-primary focus:outline-none focus:ring-2 active:opacity-70 sm:w-auto sm:px-4 sm:py-2 sm:font-bold"
            >
              Login
            </Link>
          </SignedOut>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
