import type { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPosts } from "@/utils/data";

import { Tag } from "@/components/Tag";
import { UserHoverCard } from "@/components/UserHoverCard";
import { MdRenderer } from "@/components/MdRenderer";
import Image from "next/image";

export const revalidate = 60;

type Props = {
  params: { user: string; slug: string };
};

const getUserPost = cache(async ({ user, slug }: Props["params"]) => {
  const posts = await getPosts(undefined, {
    where: { status: "PUBLISHED", user: { username: user }, slug },
  });
  return posts[0];
});

export async function generateStaticParams(): Promise<Props["params"][]> {
  const posts = await getPosts(undefined, { where: { status: "PUBLISHED" } });

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
      description: post.description,
      url: postUrl,
      type: "article",
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getUserPost({ ...params });

  if (!post) {
    notFound();
  }
  const postedOn = new Date(post.postedOn);

  return (
    <div className="bg-secondary sm:rounded-md">
      {post.image && (
        <div className="relative mr-3 h-full w-full">
          <Image
            src={post.image}
            alt="Post image preview"
            width={1000}
            height={420}
            className="flex aspect-[1000_/_420] items-center justify-center object-contain sm:rounded-t-md"
          />
        </div>
      )}
      <div className="p-4 sm:p-10 sm:pt-6">
        <div className="sm:-ml-2">
          <UserHoverCard
            user={post.user}
            postDate={postedOn}
            postPage
            postDateFormatted={`Posted on ${format(postedOn, "MMM d, yyyy")}`}
          />
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
  );
}
