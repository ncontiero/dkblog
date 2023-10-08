import type { PostWithUserAndTags } from "@/utils/types";

import { compareDesc } from "date-fns";
import { API_URL } from "@/utils/constants";
import { PostCard } from "@/components/PostCard";

export const revalidate = 60;

async function getPosts(): Promise<PostWithUserAndTags[]> {
  const res = await fetch(`${API_URL}/posts?include=user,tags`);
  return res.json();
}

export default async function HomePage() {
  const posts = (await getPosts()).sort((a, b) =>
    compareDesc(new Date(a.postedOn), new Date(b.postedOn)),
  );

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4">
      {posts.map((post) => (
        <PostCard key={post.slug} className="w-full lg:w-1/2" {...post} />
      ))}
    </div>
  );
}
