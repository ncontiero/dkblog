import { auth } from "@clerk/nextjs/server";
import { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/utils/errorResponse";
import { postsQueryParams, updateSlugParam } from "@/utils/querySchema";
import { z } from "zod";
import { slugify } from "@/utils/slugify";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
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

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const updateSlug = updateSlugParam.parse(searchParams.get("updateSlug"));

    const { tags, ...updatePost } = updatePostSchema.parse(
      await request.json(),
    );
    const newSlug =
      updatePost.title && updateSlug ? slugify(updatePost.title) : undefined;

    let post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: { user: { select: { externalId: true } } },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.user.externalId !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    post = await prisma.post.update({
      where: { slug: params.slug },
      include: { user: { select: { externalId: true, username: true } } },
      data: {
        ...updatePost,
        slug: newSlug,
        tags: { set: tags?.map((tag) => ({ slug: tag })) },
      },
    });
    return new Response(JSON.stringify(post), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Post not found"]);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug, user: { externalId: clerkUserId } },
      include: { user: { select: { externalId: true } } },
    });
    if (!post) {
      throw new Error("Post not found");
    }

    await prisma.post.delete({ where: { slug: params.slug } });

    return new Response(JSON.stringify(post), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Post not found"]);
  }
}
