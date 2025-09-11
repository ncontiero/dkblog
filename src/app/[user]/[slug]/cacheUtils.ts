import { unstable_cache } from "next/cache";
import { prismaSkip } from "@/lib/prisma";
import { getPost } from "@/utils/db-queries/posts";

export const createCacheForGetPost = (
  username: string,
  postSlug: string,
  clerkUser?: string | null,
) => {
  return unstable_cache(
    async () => {
      const status = clerkUser === username ? undefined : "PUBLISHED";
      return await getPost({
        where: {
          user: { username },
          slug: postSlug,
          status: status || prismaSkip,
        },
        include: { user: true, tags: true },
      });
    },
    [`post:${username}:${postSlug}`, clerkUser || ""],
    { tags: [`post:${username}:${postSlug}`], revalidate: 60 * 60 },
  );
};
