import type { Metadata, ResolvingMetadata } from "next";
import type { TagWithPosts } from "@/utils/types";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { API_URL } from "@/utils/constants";

export const revalidate = 60;

type Props = {
  params: { slug: string };
};

async function getTags(): Promise<TagWithPosts[]> {
  const res = await fetch(`${API_URL}/tags?include=posts.tags`);
  return await res.json();
}

export async function generateStaticParams() {
  const tags = await getTags();

  return tags.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;

  const tag = (await getTags()).find((t) => t.slug === slug);

  if (!tag) {
    notFound();
  }

  const tagUrl = `${(await parent).metadataBase}t/${tag.slug}`;
  const description = tag.description || undefined;

  return {
    title: tag.title,
    description,
    alternates: {
      canonical: tagUrl,
    },
    openGraph: {
      title: tag.title,
      description,
      url: tagUrl,
      type: "website",
    },
    twitter: {
      title: tag.title,
      description,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const tag = (await getTags()).find((t) => t.slug === params.slug);

  if (!tag) {
    notFound();
  }

  return (
    <div className="mx-auto my-0 min-h-screen max-w-4xl sm:my-8">
      <div className="w-full rounded-md bg-secondary">
        <div
          className="w-full rounded-t-md bg-[hsl(var(--tag-color)/0.8)] py-2"
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "--tag-color": `${tag.color}`,
          }}
        />
        <div className="p-8">
          <h1 className="text-4xl font-bold capitalize">{tag.title}</h1>
          <p className="mt-4">{tag.description}</p>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        {tag.posts.map((post) => (
          <PostCard key={post.slug} className="w-full" {...post} />
        ))}
      </div>
    </div>
  );
}
