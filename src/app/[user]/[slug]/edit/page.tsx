import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CreateOrUpdatePost } from "@/components/CreateOrUpdatePost";
import { createCacheForGetPost } from "../cacheUtils";

export const metadata: Metadata = {
  title: "Edit Post",
};

export default async function EditPostPage({
  params,
}: PageProps<"/[user]/[slug]/edit">) {
  const { user: username, slug: postSlug } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  const getCachedPost = createCacheForGetPost(
    username,
    postSlug,
    clerkUser.username,
  );
  const post = await getCachedPost();
  if (!post) return notFound();

  return <CreateOrUpdatePost post={post} />;
}
