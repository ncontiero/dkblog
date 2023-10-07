import Link from "next/link";
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
        <ModeToggle />
      </div>
    </header>
  );
}
