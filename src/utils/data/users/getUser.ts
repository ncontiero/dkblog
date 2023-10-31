import type { Prisma } from "@prisma/client";
import type { UserWithPosts } from "@/utils/types";

import { getUsers, type GetUsersOptionsWithExclude } from "./getUsers";
import { cache } from "react";

interface GetUserOptions extends GetUsersOptionsWithExclude {
  where: Prisma.UserWhereUniqueInput;
}

export const getUser = cache(
  async ({ where, ...opts }: GetUserOptions): Promise<UserWithPosts | null> => {
    const users = await getUsers({ ...opts, where });
    return users[0] ?? null;
  },
);
