import type { Metadata } from "next";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { getPost } from "@/utils/data/posts";
import { currentUser } from "@clerk/nextjs";

import { CreatePost } from "@/components/CreatePost";

export const metadata: Metadata = {
  title: "Edit Post",
};

type Props = {
  params: { user: string; slug: string };
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
      content={post.content}
      image={post.image || undefined}
      tags={post.tags}
      slug={post.slug}
      isEdit
    />
  );
}
