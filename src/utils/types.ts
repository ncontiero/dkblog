import type { PostStatus } from "@prisma/client";

export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  content: string;
  image: string | null;
  slug: string;
  status: PostStatus;
  postedOn: Date;
}
export interface User {
  id: string;
  externalId: string;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  image: string;
  bio: string | null;
  brandColor: string;
  createdAt: Date;
}
export interface Tag {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  color: string | null;
  slug: string;
}

export interface PostWithUserAndTags extends Post {
  user: User;
  tags: Tag[];
}
export interface TagWithPosts extends Tag {
  posts: PostWithUserAndTags[];
}
export interface UserWithPosts extends User {
  posts: PostWithUserAndTags[];
}
