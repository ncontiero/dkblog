import type { Post, PostWithUserAndTags, User } from "../types";

export function excludeFunc<T, Key extends keyof T>(
  data: T,
  keys: Key[],
): Omit<T, Key> {
  return Object.fromEntries(
    Object.entries(data as any).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<T, Key>;
}

export function postWithUserAndTags(
  post: PostWithUserAndTags,
  keys: Array<keyof Post>,
  userKeys: Array<keyof User> = ["externalId", "email"],
) {
  const newPost = excludeFunc(post, keys) as PostWithUserAndTags;
  const userPost = excludeFunc(post.user, userKeys) as User;
  newPost.user = userPost;
  return newPost;
}
