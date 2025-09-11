import { type Prisma, prisma } from "@/lib/prisma";

type PostPayload<T extends Prisma.PostDefaultArgs> = Prisma.PostGetPayload<T>;

export const getPosts = async <T extends Prisma.PostFindManyArgs>(
  options: T,
): Promise<PostPayload<T>[]> => {
  return (await prisma.post.findMany(options)) as PostPayload<T>[];
};

export const getPost = async <T extends Prisma.PostFindFirstArgs>(
  options: T,
): Promise<PostPayload<T> | null> => {
  return (await prisma.post.findFirst(options)) as PostPayload<T>;
};
