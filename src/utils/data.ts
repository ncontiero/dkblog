import type { Post, User, Prisma } from "@prisma/client";
import type { PostWithUserAndTags, TagWithPosts, UserWithPosts } from "./types";

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

type GetPostsOptions = Prisma.PostFindManyArgs;
export const getPosts = cache(
  async (
    keys?: Array<keyof Post>,
    options?: GetPostsOptions,
  ): Promise<PostWithUserAndTags[]> => {
    const opts = exclude<GetPostsOptions, keyof GetPostsOptions>(
      options || {},
      ["include"],
    );
    const posts = await prisma.post.findMany({
      include: { tags: true, user: true },
      ...opts,
    });
    return posts.map((post) => postWithUserAndTags(post, keys || ["userId"]));
  },
);

type GetTagsOptions = Prisma.TagFindManyArgs;
export const getTags = cache(
  async (
    keys?: Array<keyof TagWithPosts>,
    options?: GetTagsOptions,
  ): Promise<TagWithPosts[]> => {
    const opts = exclude<GetTagsOptions, keyof GetTagsOptions>(options || {}, [
      "include",
    ]);
    const tags = await prisma.tag.findMany({
      include: { posts: { include: { user: true, tags: true } } },
      ...opts,
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

type GetUsersOptions = Prisma.UserFindManyArgs;
export const getUsers = cache(
  async (
    keys?: Array<keyof UserWithPosts>,
    options?: GetUsersOptions,
  ): Promise<UserWithPosts[]> => {
    const opts = exclude<GetUsersOptions, keyof GetUsersOptions>(
      options || {},
      ["include"],
    );
    const users = await prisma.user.findMany({
      include: { posts: { include: { user: true, tags: true } } },
      ...opts,
    });
    const newUsers = users.map((user) =>
      exclude(user, keys || ["email", "externalId"]),
    ) as UserWithPosts[];
    newUsers.forEach((user) => {
      user.posts = user.posts.map((post) =>
        postWithUserAndTags(post, ["userId", "content", "image"]),
      );
    });
    return newUsers;
  },
);
