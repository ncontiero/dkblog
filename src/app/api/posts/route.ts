import crypto from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { PostStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { excludeFunc } from "@/utils/data/utils";
import { errorResponse } from "@/utils/errorResponse";
import { postsQuerySchema } from "@/utils/querySchema";
import { slugify } from "@/utils/slugify";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;

    const { include, limit, page, filter, orderBy } = postsQuerySchema.parse({
      include: params.get("include"),
      limit: params.get("limit"),
      page: params.get("page"),
      orderBy: params.get("orderBy"),
      filter: params.get("filter"),
    });
    const skipLimit = Number.parseInt(limit?.toString() || "10");
    if (typeof limit === "number" && limit <= 0) {
      throw new Error("Limit must be greater than 0");
    }

    const posts = await prisma.post.findMany({
      include,
      skip: page === 1 ? 0 : (page - 1) * skipLimit,
      take: limit,
      orderBy,
      where: filter,
    });

    return new Response(JSON.stringify(posts), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Limit must be greater than 0"]);
  }
}

const createPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
  image: z.string().optional(),
  status: z
    .string()
    .optional()
    .transform((status) => (status || "DRAFTED") as PostStatus)
    .refine((status) => Object.values(PostStatus).includes(status), {
      message: `Invalid status. Must be one of: ${Object.values(
        PostStatus,
      ).join(", ")}`,
    }),
  tags: z.string().array().optional(),
  userId: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const { title, userId, tags, ...data } = createPostSchema.parse(
      await request.json(),
    );
    const slug = `${slugify(title)}-${crypto.randomBytes(4).toString("hex")}`;

    if (userId !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        title,
        slug,
        tags: { connect: tags?.map((tag) => ({ slug: tag })) },
        user: { connect: { externalId: userId } },
      },
      include: {
        user: { select: { username: true } },
      },
    });

    if (post.status === "PUBLISHED") {
      revalidateTag("posts");
      tags?.forEach((tag) => revalidateTag(`tag-${tag}`));
    }
    revalidateTag(`user-${post.user.username}`);

    return new Response(JSON.stringify(excludeFunc(post, ["userId"])), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return errorResponse(error);
  }
}
