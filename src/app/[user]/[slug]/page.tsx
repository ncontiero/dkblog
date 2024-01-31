import type { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { currentUser } from "@clerk/nextjs";
import { getPosts, getPost } from "@/utils/data/posts";

import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/Tag";
import { UserHoverCard } from "@/components/UserHoverCard";
import { MdRenderer } from "@/components/MdRenderer";
import { Button } from "@/components/ui/Button";
import { DeletePostBtn } from "./DeletePostBtn";

export const revalidate = 60 * 5; // 5 minutes

type Props = {
  params: { user: string; slug: string };
};

const getUserPost = cache(async ({ user, slug }: Props["params"]) => {
  const clerkUser = await currentUser();
  const status = clerkUser?.username === user ? undefined : "PUBLISHED";
  return await getPost({
    where: { status, user: { username: user }, slug },
  });
});

export async function generateStaticParams(): Promise<Props["params"][]> {
  const posts = await getPosts({ where: { status: "PUBLISHED" } });

  return posts.map((post) => ({ user: post.user.username, slug: post.slug }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await getUserPost({ ...params });
  if (!post) {
    return notFound();
  }

  const postPath = `${post.user.username}/${post.slug}`;
  const postUrl = `${(await parent).metadataBase}${postPath}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      url: postUrl,
      type: "article",
      images: post.image ? { url: post.image, alt: post.title } : undefined,
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description || undefined,
      images: post.image ? { url: post.image, alt: post.title } : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const user = await currentUser();
  const post = await getUserPost({ ...params });

  if (!post) {
    notFound();
  }
  const postedOn = new Date(post.postedOn);

  return (
    <div className="mx-auto my-0 min-h-screen max-w-3xl sm:my-8">
      <div className="bg-secondary sm:rounded-md">
        {post.image && (
          <div className="relative mr-3 h-full w-full">
            <Image
              src={post.image}
              alt="Post image preview"
              width={1000}
              height={420}
              className="flex items-center justify-center object-contain sm:rounded-t-md"
            />
          </div>
        )}
        <div className="p-4 sm:p-10 sm:pt-6">
          <div className="flex items-center justify-between sm:-ml-2">
            <UserHoverCard
              user={post.user}
              postDate={postedOn}
              postPage
              postDateFormatted={`Posted on ${format(postedOn, "MMM d, yyyy")}`}
            />
            {user && user.username === post.user.username && (
              <div className="flex gap-1">
                <DeletePostBtn postSlug={post.slug} username={user.username!} />
                <Button asChild>
                  <Link href={`/${user.username}/${post.slug}/edit`}>Edit</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="sm:px-1">
            <h1 className="relative mb-2 mt-4 w-full scroll-m-20 text-3xl tracking-tight sm:text-4xl sm:font-bold">
              {post.title}
            </h1>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-0.5">
                {post.tags.map((tag) => (
                  <Tag key={tag.id} tag={tag} />
                ))}
              </div>
            )}
          </div>
          <div className="prose prose-quoteless pl-1 pt-7 dark:prose-invert">
            <MdRenderer.Server content={post.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
