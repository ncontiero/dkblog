import { ZodError } from "zod";

export function errorResponse(error: unknown) {
  const headers = { "content-type": "application/json" };
  const errObj = {
    message: error instanceof Error ? error.message : error,
    code: error instanceof Error ? error.name : undefined,
    status:
      error instanceof Error && error.message === "Post not found" ? 404 : 500,
  };

  if (error instanceof ZodError) {
    return new Response(JSON.stringify(error.issues), {
      headers,
      status: 400,
    });
  }
  return new Response(JSON.stringify(errObj), {
    headers,
    status: errObj.status,
  });
}
