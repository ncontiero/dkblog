import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/utils/errorResponse";
import { querySchema } from "@/utils/querySchema";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;

    const { include, limit, page, filter, orderBy } = querySchema.parse({
      include: params.get("include"),
      limit: params.get("limit"),
      page: params.get("page"),
      orderBy: params.get("orderBy"),
      filter: params.get("filter"),
    });

    const posts = await prisma.post.findMany({
      include,
      skip: page === 1 ? 0 : (page - 1) * limit,
      take: limit,
      orderBy,
      where: filter,
    });

    return new Response(JSON.stringify(posts), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
