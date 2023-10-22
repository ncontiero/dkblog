import { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/utils/errorResponse";
import { postsQuerySchema } from "@/utils/querySchema";
import { z } from "zod";
import { slugify } from "@/utils/slugify";
import crypto from "node:crypto";
import { exclude } from "@/utils/data";

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
    const skipLimit = parseInt(limit?.toString() || "10");
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
  userId: z.string().cuid(),
});

export async function POST(request: Request) {
  try {
    const { title, description, content, status, userId, image } =
      createPostSchema.parse(await request.json());
    const slug = `${slugify(title)}-${crypto.randomBytes(4).toString("hex")}`;

    const post = await prisma.post.create({
      data: {
        title,
        description,
        content,
        image,
        status,
        userId,
        slug,
      },
      include: { user: { select: { username: true } } },
    });

    return new Response(JSON.stringify(exclude(post, ["userId"])), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
