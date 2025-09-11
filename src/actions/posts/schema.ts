import { z } from "zod";
import { PostStatus } from "@/lib/prisma";

export const createOrUpdatePostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().or(z.null()).optional(),
  content: z.string().min(1, "Content is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      error: "Cover image must be an image",
    })
    .refine((file) => file.size <= 1024 * 1024 * 5, {
      error: "Image must be less than 5MB",
    })
    .optional(),
  updateImage: z.boolean().optional(),
  tags: z.array(z.string().min(1)).max(4, "You can only add up to 4 tags"),
  status: z.enum([PostStatus.PUBLISHED, PostStatus.DRAFTED]),
});

export type CreateOrUpdatePostSchema = z.infer<typeof createOrUpdatePostSchema>;

export const deletePostSchema = z.object({
  slug: z.string().min(1, "Post slug is required"),
});
