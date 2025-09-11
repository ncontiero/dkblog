import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CreateOrUpdatePost } from "@/components/CreateOrUpdatePost";
import { createCacheForGetPost } from "../cacheUtils";

export const metadata: Metadata = {
  title: "Edit Post",
};

type Props = {
  readonly params: Promise<{ user: string; slug: string }>;
};

export default async function EditPostPage({ params }: Props) {
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
