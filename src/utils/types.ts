import { Post, User, Tag } from "@prisma/client";

export interface PostWithUserAndTags extends Post {
  user: User;
  tags: Tag[];
}
