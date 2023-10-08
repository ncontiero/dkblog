import { optional } from "./utils";

export const tagsInclude = optional.transform((val) => {
  if (!val) return null;
  const subColumns = val.split(".");

  const include = {
    posts: subColumns.includes("posts") && {
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        user: subColumns.includes("user") && {
          select: { id: true, username: true, image: true, createdAt: true },
        },
        slug: true,
        status: true,
        postedOn: true,
        tags: subColumns.includes("tags"),
      },
    },
  };

  console.log(subColumns);
  console.log(include);
  return include;
});
