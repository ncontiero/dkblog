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
    <div className="relative mx-auto my-0 min-h-screen w-full max-w-4xl sm:mt-2">
      {children}
    </div>
  );
}
