"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { updateUserInfoSchema } from "./schema";

export const updateUserInfoAction = authActionClient
  .inputSchema(updateUserInfoSchema)
  .action(async ({ clientInput: { brandColor, bio }, ctx: { user } }) => {
    await prisma.user.update({
      where: { externalId: user.id },
      data: {
        brandColor,
        bio,
      },
    });

    updateTag(`user:${user.username}:settings`);
    updateTag(`user:${user.username}`);
  });
