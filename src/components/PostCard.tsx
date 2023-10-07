import type { PostWithUserAndTags } from "@/utils/types";

import { dateParser } from "@/utils/dateParser";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { Tag } from "./Tag";

export function PostCard({
  className,
  ...post
}: PostWithUserAndTags & { className?: string }) {
  const postDate = new Date(post.postedOn);

  return (
    <div
      className={cn(
        "relative w-1/2 gap-2 rounded-md bg-secondary p-6",
        className,
      )}
    >
      <time dateTime={postDate.toISOString()} className="text-xs font-light">
        {dateParser(postDate).postDateFormat}
      </time>
      <h2 className="text-2xl font-bold">
        <Link
          href={`/p/${post.slug}`}
          className="duration-200 hover:opacity-70"
        >
          {post.title}
        </Link>
      </h2>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-0.5">
          {post.tags.map((tag) => (
            <Tag key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
