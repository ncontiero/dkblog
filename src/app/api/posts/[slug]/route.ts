import { auth } from "@clerk/nextjs/server";
import { PostStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";
import { errorResponse } from "@/utils/errorResponse";
import { postsQueryParams, updateSlugParam } from "@/utils/querySchema";
import { slugify } from "@/utils/slugify";

type Params = Promise<{ slug: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const { searchParams } = new URL(request.url);
    const include = postsQueryParams.include.parse(searchParams.get("include"));

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include,
    });
    if (!post) {
      throw new Error("Post not found");
    }

    return new Response(JSON.stringify(post), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Post not found"]);
  }
}

const updatePostSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  status: z
    .string()
    .transform((status) => status as PostStatus)
    .refine((status) => Object.values(PostStatus).includes(status), {
      message: `Invalid status. Must be one of: ${Object.values(
        PostStatus,
      ).join(", ")}`,
    })
    .optional(),
  tags: z.string().array().optional(),
});

export async function PATCH(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const updateSlug = updateSlugParam.parse(searchParams.get("updateSlug"));

    const { tags, ...updatePost } = updatePostSchema.parse(
      await request.json(),
    );

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        user: { select: { externalId: true } },
        tags: { select: { slug: true } },
      },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.user.externalId !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    const newSlug =
      updatePost.title && updateSlug ? slugify(updatePost.title) : post.slug;

    const updatedPost = await prisma.post.update({
      where: { slug: params.slug },
      include: {
        user: { select: { externalId: true, username: true } },
        tags: { select: { slug: true } },
      },
      data: {
        ...updatePost,
        slug: newSlug,
        tags: { set: tags?.map((tag) => ({ slug: tag })) },
      },
    });

    if (post.status === "PUBLISHED" || updatedPost.status === "PUBLISHED") {
      revalidateTag("posts");
      post.tags.forEach((tag) => revalidateTag(`tag:${tag.slug}`));
      updatedPost.tags.forEach((tag) => revalidateTag(`tag:${tag.slug}`));
    }
    revalidateTag(`user:${updatedPost.user.username}`);
    revalidateTag(`post:${updatedPost.user.username}:${updatedPost.slug}`);

    return new Response(JSON.stringify(updatedPost), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Post not found"]);
  }
}

export async function DELETE(
  request: Request,
  segmentData: { params: Params },
) {
  try {
    const params = await segmentData.params;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug, user: { externalId: clerkUserId } },
      include: {
        user: { select: { externalId: true, username: true } },
        tags: { select: { slug: true } },
      },
    });
    if (!post) {
      throw new Error("Post not found");
    }

    await prisma.$transaction(async (tx) => {
      if (env.NODE_ENV === "production" && post.image) {
        const filename = post.image.split("/").pop();
        filename && (await deleteFile(`posts/${filename}`));
      }
      await tx.post.delete({ where: { slug: params.slug } });
    });

    if (post.status === "PUBLISHED") {
      revalidateTag("posts");
      post.tags.forEach((tag) => revalidateTag(`tag:${tag.slug}`));
    }
    revalidateTag(`user:${post.user.username}`);
    revalidateTag(`post:${post.user.username}:${post.slug}`);

    return new Response(JSON.stringify(post), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Post not found"]);
  }
}
