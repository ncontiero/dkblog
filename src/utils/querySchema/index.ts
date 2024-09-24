import { z } from "zod";
import { postsInclude } from "./posts";
import { tagsInclude } from "./tags";
import { optional } from "./utils";

const limit = optional.transform((val) =>
  val ? Number.parseInt(val) : undefined,
);

const page = optional
  .transform((val) => (val ? Number.parseInt(val) : 1))
  .refine((val) => val > 0, {
    message: "Page must be greater than 0",
    path: ["page"],
  });

const orderBy = optional
  .transform((val) => val && val.split("."))
  .transform((val) => (val ? { [val[0]!]: val[1] || "asc" } : undefined));

const filter = optional
  .transform((val) => val && val.split("."))
  .transform((val) => {
    if (!val) return undefined;
    return {
      [val[0]!]: {
        contains: val[1],
        mode: "insensitive",
      },
    };
  });

const params = {
  limit,
  page,
  orderBy,
  filter,
};

export const postsQueryParams = {
  include: postsInclude,
  ...params,
};
export const tagsQueryParams = {
  include: tagsInclude,
  ...params,
};
export const updateSlugParam = optional.transform((val) => val === "true");

export const postsQuerySchema = z.object(postsQueryParams);
export const tagsQuerySchema = z.object(tagsQueryParams);
