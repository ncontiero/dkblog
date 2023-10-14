import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a new post",
};

export default function CreatePostLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto my-0 min-h-screen max-w-3xl sm:mt-2">
      {children}
    </div>
  );
}
