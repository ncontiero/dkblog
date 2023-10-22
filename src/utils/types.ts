import { Post, User, Tag } from "@prisma/client";

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
