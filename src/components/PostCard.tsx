import type { PostWithUserAndTags } from "@/utils/types";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { Tag } from "./Tag";
import { UserHoverCard } from "./UserHoverCard";

export function PostCard({
  className,
  ...post
}: PostWithUserAndTags & { readonly className?: string }) {
  return (
    <div
      className={cn(
        "bg-secondary relative w-1/2 gap-2 rounded-none p-6 sm:rounded-md",
        className,
      )}
    >
      <UserHoverCard user={post.user} postDate={new Date(post.postedOn)} />
      <div className="sm:pl-12">
        <h2 className="text-xl font-bold sm:text-2xl">
          <Link
            href={`/${post.user.username}/${post.slug}`}
            className={`
              focus-visible:ring-ring rounded-md duration-200 hover:opacity-70 focus-visible:ring-2
              focus-visible:outline-hidden
            `}
          >
            {post.title}
          </Link>
        </h2>
        {post.tags && post.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-0.5">
            {post.tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
