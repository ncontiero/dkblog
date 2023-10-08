import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/utils/errorResponse";
import { tagsQueryParams } from "@/utils/querySchema";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const include = tagsQueryParams.include.parse(searchParams.get("include"));

    const tag = await prisma.tag.findUnique({
      where: { slug: params.slug },
      include,
    });
    if (!tag) {
      throw new Error("Tag not found");
    }

    return new Response(JSON.stringify(tag), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, ["Tag not found"]);
  }
}
