import { currentUser } from "@clerk/nextjs/server";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof Error) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Você deve estar logado para executar esta ação.");
  }

  return next({ ctx: { user } });
});
