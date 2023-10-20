import { ZodError } from "zod";

export function errorResponse(error: unknown, errMessages: string[] = []) {
  const headers = { "content-type": "application/json" };

  const errObj = {
    message: error instanceof Error ? error.message : error,
    code: error instanceof Error ? error.name : undefined,
    status:
      error instanceof Error && errMessages.includes(error.message) ? 400 : 500,
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
