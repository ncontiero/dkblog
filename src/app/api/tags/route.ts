import { prisma, prismaSkip } from "@/lib/prisma";
import { errorResponse } from "@/utils/errorResponse";
import { tagsQuerySchema } from "@/utils/querySchema";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;

    const { include, limit, page, filter, orderBy } = tagsQuerySchema.parse({
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

    const tags = await prisma.tag.findMany({
      include,
      skip: page === 1 ? 0 : (page - 1) * skipLimit,
      take: limit || prismaSkip,
      orderBy: orderBy || prismaSkip,
      where: filter || prismaSkip,
    });

    return new Response(JSON.stringify(tags), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error, ["Limit must be greater than 0"]);
  }
}
