import { z } from "zod";

const optional = z.string().nullable();

const include = optional.transform((val) => {
  if (!val) return null;
  const valArray = val.split(",");
  return {
    user: valArray.includes("user") && {
      select: { id: true, username: true, image: true, createdAt: true },
    },
    tags: valArray.includes("tags"),
  };
});

const limit = optional
  .transform((val) => (val ? parseInt(val) : 10))
  .refine((val) => val > 0 && val <= 50, {
    message: "Limit must be between 1 and 50",
    path: ["limit"],
  });

const page = optional
  .transform((val) => (val ? parseInt(val) : 1))
  .refine((val) => val > 0, {
    message: "Page must be between 1",
    path: ["page"],
  });

const orderBy = optional
  .transform((val) => val && val.split("."))
  .transform((val) => (val ? { [val[0]]: val[1] || "asc" } : undefined));

const filter = optional
  .transform((val) => val && val.split("."))
  .transform((val) => {
    if (!val) return undefined;
    return {
      [val[0]]: {
        contains: val[1],
        mode: "insensitive",
      },
    };
  });

export const queryParams = { include, limit, page, orderBy, filter };
export const querySchema = z.object(queryParams);
