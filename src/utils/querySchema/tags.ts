import { optional } from "./utils";

export const tagsInclude = optional.transform((val) => {
  if (!val) return null;
  const subColumns = val.split(".");

  return {
    posts: subColumns.includes("posts") && {
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        user: subColumns.includes("user") && {
          select: {
            id: true,
            username: true,
            image: true,
            createdAt: true,
            brandColor: true,
            bio: true,
          },
        },
        slug: true,
        status: true,
        postedOn: true,
        tags: subColumns.includes("tags"),
      },
    },
  };
});
