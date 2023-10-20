import { getPosts } from "@/utils/data";
import { compareDesc } from "date-fns";

import { PostCard } from "@/components/PostCard";

export const revalidate = 60;

export default async function HomePage() {
  const posts = (await getPosts(["userId", "content", "image"])).sort((a, b) =>
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
