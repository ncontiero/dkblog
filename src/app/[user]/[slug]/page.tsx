import type { Metadata, ResolvingMetadata } from "next";

import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdRenderer } from "@/components/MdRenderer";
import { Tag } from "@/components/Tag";
import { Button } from "@/components/ui/Button";
import { UserHoverCard } from "@/components/UserHoverCard";
import { createCacheForGetPost } from "./cacheUtils";
import { DeletePostBtn } from "./DeletePostBtn";

type Params = { user: string; slug: string };
type Props = {
  readonly params: Promise<Params>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { user: username, slug: postSlug } = await params;

  const clerkUser = await currentUser();

  const getCachedPost = createCacheForGetPost(
    username,
    postSlug,
    clerkUser?.username,
  );
  const post = await getCachedPost();
  if (!post) return notFound();

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
  const { user: username, slug: postSlug } = await params;

  const user = await currentUser();

  const getCachedPost = createCacheForGetPost(
    username,
    postSlug,
    user?.username,
  );
  const post = await getCachedPost();
  if (!post) return notFound();

  const postedOn = new Date(post.postedOn);

  return (
    <div className="mx-auto my-0 min-h-screen max-w-3xl sm:my-8">
      <div className="bg-secondary sm:rounded-md">
        {post.image ? (
          <div className="relative mr-3 size-full">
            <Image
              src={post.image}
              alt={post.title}
              width={1000}
              height={420}
              className="flex items-center justify-center object-contain sm:rounded-t-md"
            />
          </div>
        ) : null}
        <div className="p-4 sm:p-10 sm:pt-6">
          <div className="flex items-center justify-between sm:-ml-2">
            <UserHoverCard
              user={post.user}
              postDate={postedOn}
              postPage
              postDateFormatted={`Posted on ${format(postedOn, "MMM d, yyyy")}`}
            />
            {user && user.username === post.user.username ? (
              <div className="flex gap-1">
                <DeletePostBtn postSlug={post.slug} />
                <Button asChild>
                  <Link href={`/${user.username}/${post.slug}/edit`}>Edit</Link>
                </Button>
              </div>
            ) : null}
          </div>
          <div className="sm:px-1">
            <h1 className="relative mb-2 mt-4 w-full scroll-m-20 text-3xl tracking-tight sm:text-4xl sm:font-bold">
              {post.title}
            </h1>
            {post.tags && post.tags.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-0.5">
                {post.tags.map((tag) => (
                  <Tag key={tag.id} tag={tag} />
                ))}
              </div>
            ) : null}
          </div>
          <div className="prose prose-quoteless pl-1 pt-7 dark:prose-invert">
            <MdRenderer.Server content={post.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
