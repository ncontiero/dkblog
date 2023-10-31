import type { Post, Prisma, User } from "@prisma/client";
import type { UserWithPosts } from "@/utils/types";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { excludeFunc, postWithUserAndTags } from "../utils";

type GetUsersOptions = Prisma.UserFindManyArgs;
export interface GetUsersOptionsWithExclude extends GetUsersOptions {
  exclude?: Array<keyof User>;
  postsExclude?: Array<keyof Post>;
}

export const getUsers = cache(
  async ({
    exclude = ["email", "externalId"],
    postsExclude = ["userId", "content", "image"],
    ...options
  }: GetUsersOptionsWithExclude): Promise<UserWithPosts[]> => {
    const opts = excludeFunc(options || {}, ["include"]);
    const users = await prisma.user.findMany({
      include: { posts: { include: { user: true, tags: true } } },
      ...opts,
    });
    return users
      .map((user) => excludeFunc(user, exclude))
      .map((user) => {
        user.posts = user.posts.map((post) =>
          postWithUserAndTags(post, postsExclude, exclude),
        );
        return user;
      }) as UserWithPosts[];
  },
);
