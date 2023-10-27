import type { Metadata } from "next";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getPosts } from "@/utils/data";
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
  const posts = await getPosts(undefined, {
    where: { user: { username: user }, slug },
  });
  return posts[0];
});

export default async function EditPostPage({ params }: Props) {
  const post = await getUserPost({ ...params });

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
