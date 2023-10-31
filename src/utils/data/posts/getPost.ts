import type { Prisma } from "@prisma/client";
import type { PostWithUserAndTags } from "@/utils/types";

import { getPosts, type GetPostsOptionsWithExclude } from "./getPosts";
import { cache } from "react";

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
