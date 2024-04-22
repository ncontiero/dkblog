import type { Prisma } from "@prisma/client";
import type { PostWithUserAndTags } from "@/utils/types";

import { cache } from "react";
import { type GetPostsOptionsWithExclude, getPosts } from "./getPosts";

interface GetPostOptions extends GetPostsOptionsWithExclude {
  where: Prisma.PostWhereUniqueInput;
}

export const getPost = cache(
  async ({
    where,
    ...opts
  }: GetPostOptions): Promise<PostWithUserAndTags | null> => {
    const posts = await getPosts({ where, ...opts });
    return posts[0] ?? null;
  },
);
