import type { Metadata, ResolvingMetadata } from "next";

import { compareDesc } from "date-fns";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getTag, getTags } from "@/utils/data/tags";

export const revalidate = 300; // 5 minutes

type Props = {
  readonly params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tags = await getTags({});

  return tags.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;

  const tag = await getTag({ where: { slug } });

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
  const tag = await getTag({ where: { slug: (await params).slug } });

  if (!tag) {
    notFound();
  }

  const posts = tag.posts.sort((a, b) =>
    compareDesc(new Date(a.postedOn), new Date(b.postedOn)),
  );

  return (
    <div className="mx-auto my-0 min-h-screen max-w-4xl sm:my-8">
      <div className="w-full bg-secondary sm:rounded-md">
        <div
          className="w-full bg-[hsl(var(--tag-color)/0.8)] py-2 sm:rounded-t-md"
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
        {posts.map((post) => (
          <PostCard key={post.slug} className="w-full" {...post} />
        ))}
      </div>
    </div>
  );
}
