import type { Metadata, ResolvingMetadata } from "next";

import { compareDesc } from "date-fns";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getTag, getTags } from "@/utils/db-queries/tags";

type Props = {
  readonly params: Promise<{ slug: string }>;
};

export const revalidate = 3600; // 1 hour
export const dynamicParams = true;

export async function generateStaticParams() {
  const tags = await getTags({
    select: { slug: true },
  });

  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

const createCacheForGetTag = (slug: string) => {
  return unstable_cache(
    async () =>
      await getTag({
        where: { slug },
        include: {
          posts: {
            include: { user: true, tags: true },
            where: { status: "PUBLISHED" },
          },
        },
      }),
    [`tag:${slug}`],
    { tags: [`tag:${slug}`], revalidate: 60 * 60 },
  );
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;

  const getCachedTag = createCacheForGetTag(slug);
  const tag = await getCachedTag();
  if (!tag) notFound();

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
  const { slug } = await params;

  const getCachedTag = createCacheForGetTag(slug);
  const tag = await getCachedTag();

  if (!tag) notFound();

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
