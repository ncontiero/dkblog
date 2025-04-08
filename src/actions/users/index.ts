"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { updateUserInfoSchema } from "./schema";

export const updateUserInfoAction = authActionClient
  .schema(updateUserInfoSchema)
  .action(async ({ clientInput: { brandColor, bio }, ctx: { user } }) => {
    await prisma.user.update({
      where: { externalId: user.id },
      data: {
        brandColor,
        bio,
      },
    });

    revalidateTag(`user:${user.username}:settings`);
    revalidateTag(`user:${user.username}`);
  });
