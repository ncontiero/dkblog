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
});

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const updateSlug = updateSlugParam.parse(searchParams.get("updateSlug"));

    const updatePost = updatePostSchema.parse(await request.json());
    const newSlug =
      updatePost.title && updateSlug ? slugify(updatePost.title) : undefined;

    let post = await prisma.post.findUnique({ where: { slug: params.slug } });
    if (!post) {
      throw new Error("Post not found");
    }

    post = await prisma.post.update({
      where: { slug: params.slug },
      data: { ...updatePost, slug: newSlug },
    });
    return new Response(JSON.stringify(post), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Post not found"]);
  }
}
