import { unstable_cache } from "next/cache";
import { PostCard } from "@/components/PostCard";
import { getPosts } from "@/utils/db-queries/posts";

const cachedPosts = unstable_cache(getPosts, ["posts"], {
  tags: ["posts"],
  revalidate: 60 * 60,
});

export default async function HomePage() {
  const posts = await cachedPosts({
    where: { status: "PUBLISHED" },
    orderBy: { postedOn: "desc" },
    include: { tags: true, user: true },
  });

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:container">
      {posts.map((post) => (
        <PostCard key={post.slug} className="w-full lg:w-1/2" {...post} />
      ))}
    </div>
  );
}
