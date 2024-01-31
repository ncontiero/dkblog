import type { Prisma } from "@prisma/client";
import type { PostWithUserAndTags, Post, User } from "@/utils/types";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { excludeFunc, postWithUserAndTags } from "../utils";

type GetPostsOptions = Prisma.PostFindManyArgs;
export interface GetPostsOptionsWithExclude extends GetPostsOptions {
  exclude?: Array<keyof Post>;
  userKeys?: Array<keyof User>;
}

export const getPosts = cache(
  async ({
    exclude = ["userId"],
    userKeys = ["externalId", "email"],
    ...options
  }: GetPostsOptionsWithExclude): Promise<PostWithUserAndTags[]> => {
    const opts = excludeFunc(options || {}, ["include"]);
    const posts = (await prisma.post.findMany({
      include: { tags: true, user: true },
      ...opts,
    })) as PostWithUserAndTags[];
    return posts.map((post) => postWithUserAndTags(post, exclude, userKeys));
  },
);
