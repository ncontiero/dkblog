import type { PostWithUserAndTags } from "@/utils/types";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { Tag } from "./Tag";
import { UserHoverCard } from "./UserHoverCard";

export function PostCard({
  className,
  ...post
}: PostWithUserAndTags & { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-1/2 gap-2 rounded-none bg-secondary p-6 sm:rounded-md",
        className,
      )}
    >
      <UserHoverCard user={post.user} postDate={new Date(post.postedOn)} />
      <div className="sm:pl-12">
        <h2 className="text-xl font-bold sm:text-2xl">
          <Link
            href={`/p/${post.slug}`}
            className="rounded-md duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {post.title}
          </Link>
        </h2>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-0.5">
            {post.tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
