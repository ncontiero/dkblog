import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type UserPayload<T extends Prisma.UserDefaultArgs> = Prisma.UserGetPayload<T>;

export const getUsers = async <T extends Prisma.UserFindManyArgs>(
  options: T,
): Promise<UserPayload<T>[]> => {
  return (await prisma.user.findMany(options)) as UserPayload<T>[];
};

export const getUser = async <T extends Prisma.UserFindFirstArgs>(
  options: T,
): Promise<UserPayload<T> | null> => {
  return (await prisma.user.findFirst(options)) as UserPayload<T>;
};
