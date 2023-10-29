import type { HTMLAttributes } from "react";
import type { Tag } from "@prisma/client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface TagProps extends HTMLAttributes<HTMLAnchorElement> {
  tag: Tag;
}

export function Tag({ tag, className, ...props }: TagProps) {
  return (
    <Link
      href={`/t/${tag.slug}`}
      className={cn(
        `rounded-md border border-transparent p-1 text-sm duration-200 hover:border-[hsl(var(--tag-color))] hover:bg-[hsl(var(--tag-color)/0.2)] focus-visible:border-[hsl(var(--tag-color))] focus-visible:bg-[hsl(var(--tag-color)/0.2)] focus-visible:outline-none dark:font-light`,
        className,
      )}
      style={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "--tag-color": `${tag.color}`,
      }}
      {...props}
    >
      <span className="text-[hsl(var(--tag-color))]">#</span>
      {tag.slug}
    </Link>
  );
}
