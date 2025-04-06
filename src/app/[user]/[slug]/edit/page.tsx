import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CreatePost } from "@/components/CreatePost";
import { createCacheForGetPost } from "../page";

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

  return (
    <CreatePost
      title={post.title}
      description={post.description || undefined}
      content={post.content}
      image={post.image || undefined}
      tags={post.tags}
      slug={post.slug}
      isEdit
    />
  );
}
