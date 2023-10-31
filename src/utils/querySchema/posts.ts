import { optional } from "./utils";

export const postsInclude = optional.transform((val) => {
  if (!val) return null;
  const valArray = val.split(",");
  return {
    user: valArray.includes("user") && {
      select: {
        id: true,
        username: true,
        image: true,
        createdAt: true,
        brandColor: true,
        bio: true,
      },
    },
    tags: valArray.includes("tags"),
  };
});
