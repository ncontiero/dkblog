import type { ReactNode } from "react";

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto my-0 min-h-screen max-w-3xl sm:my-8">
      {children}
    </div>
  );
}
