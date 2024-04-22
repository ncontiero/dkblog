import type { Prisma } from "@prisma/client";
import type { UserWithPosts } from "@/utils/types";

import { cache } from "react";
import { type GetUsersOptionsWithExclude, getUsers } from "./getUsers";

interface GetUserOptions extends GetUsersOptionsWithExclude {
  where: Prisma.UserWhereUniqueInput;
}

export const getUser = cache(
  async ({ where, ...opts }: GetUserOptions): Promise<UserWithPosts | null> => {
    const users = await getUsers({ ...opts, where });
    return users[0] ?? null;
  },
);
