"use server";

import { randomBytes } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { deleteFile, saveFile } from "@/utils/files";
import { slugify } from "@/utils/slugify";
import { createOrUpdatePostSchema, deletePostSchema } from "./schema";

export const createOrUpdatePostAction = authActionClient
  .inputSchema(createOrUpdatePostSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, title, tags, image, updateImage, ...data } = parsedInput;

    if (image && !image?.type.startsWith("image/")) {
      throw new Error("Invalid image type");
    }

    const post = await prisma.post.findUnique({
      where: { id: id || "" },
      include: { tags: true },
    });
    if (id && !post) {
      throw new Error("Post not found");
    }

    const slug = post
      ? post.slug
      : `${slugify(title)}-${randomBytes(4).toString("hex")}`;

    const updatedPost = await prisma.$transaction(async (tx) => {
      const file =
        image &&
        (await saveFile(image, {
          folder: "posts",
          fileName: `${slug}-${randomBytes(4).toString("hex")}`,
        }));

      const updatedPost = await tx.post.upsert({
        where: { id: id || "" },
        create: {
          ...data,
          title,
          slug,
          image: file?.fileURL || null,
          tags: { connect: tags.map((tag) => ({ slug: tag })) },
          user: { connect: { externalId: user.id } },
        },
        update: {
          ...data,
          title,
          image: file?.fileURL || (updateImage ? null : post?.image) || null,
          tags: { set: tags.map((tag) => ({ slug: tag })) },
        },
      });

      if (post?.image && post.image !== updatedPost.image) {
        await deleteFile(post.image, "posts");
      }

      return updatedPost;
    });

    if (post?.status === "PUBLISHED" || updatedPost.status === "PUBLISHED") {
      updateTag("posts");
      tags.forEach((tag) => updateTag(`tag:${tag}`));
      post?.tags.forEach((tag) => {
        if (!tags.includes(tag.slug)) {
          updateTag(`tag:${tag.slug}`);
        }
      });
    }
    updateTag(`user:${user.username}`);
    updateTag(`post:${user.username}:${slug}`);

    redirect(`/${user.username}/${slug}`);
  });

export const deletePostAction = authActionClient
  .inputSchema(deletePostSchema)
  .action(async ({ clientInput: { slug }, ctx: { user } }) => {
    const post = await prisma.post.findUnique({
      where: { slug, user: { externalId: user.id } },
      include: { tags: true },
    });
    if (!post) {
      throw new Error("Post not found");
    }

    await prisma.post.delete({ where: { slug } });

    post.image && (await deleteFile(post.image, "posts"));

    if (post.status === "PUBLISHED") {
      updateTag("posts");
      post.tags.forEach((tag) => updateTag(`tag:${tag.slug}`));
    }
    updateTag(`user:${user.username}`);
    updateTag(`post:${user.username}:${post.slug}`);

    redirect(`/${user.username}`);
  });
