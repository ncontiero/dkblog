import type { Post, User } from "@prisma/client";
import type { PostWithUserAndTags, TagWithPosts } from "./types";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

export function exclude<T, Key extends keyof T>(
  data: T,
  keys: Key[],
): Omit<T, Key> {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(data as any).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<T, Key>;
}

function postWithUserAndTags(
  post: PostWithUserAndTags,
  keys: Array<keyof Post>,
  userKeys: Array<keyof User> = ["externalId", "email"],
) {
  const newPost = exclude(post, keys) as PostWithUserAndTags;
  const userPost = exclude(post.user, userKeys) as User;
  newPost.user = userPost;
  return newPost;
}

export const getPosts = cache(
  async (keys?: Array<keyof Post>): Promise<PostWithUserAndTags[]> => {
    const posts = await prisma.post.findMany({
      include: { tags: true, user: true },
    });
    return posts.map((post) => postWithUserAndTags(post, keys || ["userId"]));
  },
);

export const getTags = cache(
  async (keys?: Array<keyof TagWithPosts>): Promise<TagWithPosts[]> => {
    const tags = await prisma.tag.findMany({
      include: { posts: { include: { user: true, tags: true } } },
    });
    const newTags = tags.map((tag) =>
      exclude(tag, keys || []),
    ) as TagWithPosts[];
    newTags.forEach((tag) => {
      tag.posts = tag.posts.map((post) =>
        postWithUserAndTags(post, ["userId", "content", "image"]),
      );
    });
    return newTags;
  },
);
