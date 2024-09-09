import type { Metadata } from "next";

import { cache } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { CreatePost } from "@/components/CreatePost";
import { getPost } from "@/utils/data/posts";

export const metadata: Metadata = {
  title: "Edit Post",
};

type Props = {
  readonly params: { user: string; slug: string };
};

const getUserPost = cache(async ({ user, slug }: Props["params"]) => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }
  return await getPost({ where: { user: { username: user }, slug } });
});

export default async function EditPostPage({ params }: Props) {
  const post = await getUserPost({ ...params });

  if (!post) {
    notFound();
  }

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
