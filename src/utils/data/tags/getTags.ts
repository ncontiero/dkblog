import type { Prisma } from "@prisma/client";
import type { Post, Tag, TagWithPosts, User } from "@/utils/types";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { excludeFunc, postWithUserAndTags } from "../utils";

type GetTagsOptions = Prisma.TagFindManyArgs;
export interface GetTagsOptionsWithExclude extends GetTagsOptions {
  exclude?: Array<keyof Tag>;
  postsExclude?: Array<keyof Post>;
  postsUserExclude?: Array<keyof User>;
}

export const getTags = cache(
  async ({
    exclude,
    postsExclude = ["userId", "content", "image"],
    postsUserExclude = ["email", "externalId"],
    ...options
  }: GetTagsOptionsWithExclude): Promise<TagWithPosts[]> => {
    const opts = excludeFunc(options || {}, ["include"]);
    const tags = (await prisma.tag.findMany({
      include: { posts: { include: { user: true, tags: true } } },
      ...opts,
    })) as TagWithPosts[];
    return tags
      .map((tag) => excludeFunc(tag, exclude || []))
      .map((tag) => {
        tag.posts = tag.posts.map((post) =>
          postWithUserAndTags(post, postsExclude, postsUserExclude),
        );
        return tag;
      }) as TagWithPosts[];
  },
);
