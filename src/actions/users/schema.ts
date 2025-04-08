import { z } from "zod";

export const updateUserInfoSchema = z.object({
  brandColor: z
    .string()
    .regex(/^#(?:[\da-f]{3}){1,2}$/i)
    .optional(),
  bio: z.string().max(200).optional(),
});
export type UpdateUserInfoSchema = z.infer<typeof updateUserInfoSchema>;
