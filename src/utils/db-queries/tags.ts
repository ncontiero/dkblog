import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type TagPayload<T extends Prisma.TagDefaultArgs> = Prisma.TagGetPayload<T>;

export const getTags = async <T extends Prisma.TagFindManyArgs>(
  options: T,
): Promise<TagPayload<T>[]> => {
  return (await prisma.tag.findMany(options)) as TagPayload<T>[];
};

export const getTag = async <T extends Prisma.TagFindFirstArgs>(
  options: T,
): Promise<TagPayload<T> | null> => {
  return (await prisma.tag.findFirst(options)) as TagPayload<T>;
};
