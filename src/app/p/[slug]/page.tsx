import type { Metadata, ResolvingMetadata } from "next";
import type { PostWithUserAndTags } from "@/utils/types";
import { notFound } from "next/navigation";
import { API_URL } from "@/utils/constants";
import { dateParser } from "@/utils/dateParser";

import { Tag } from "@/components/Tag";

export const revalidate = 60;

type Props = {
  params: { slug: string };
};

async function getPosts(): Promise<PostWithUserAndTags[]> {
  const res = await fetch(`${API_URL}/posts?include=user,tags`);
  return await res.json();
}

export async function generateStaticParams(): Promise<Props["params"][]> {
  const posts = await getPosts();

  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;

  const post = (await getPosts()).find((p) => p.slug === slug);
  if (!post) {
    return notFound();
  }

  const postUrl = `${(await parent).metadataBase}p/${post.slug}`;

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
  const post = (await getPosts()).find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const posted = dateParser(new Date(post.postedOn));

  return (
    <div className="bg-secondary sm:rounded-md">
      {post.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={post.title}
          className="flex aspect-[1000_/_420] items-center justify-center object-contain sm:rounded-t-md"
        />
      )}
      <div className="p-4 pt-6 sm:p-10">
        <div className="px-1">
          <time
            dateTime={post.postedOn.toString()}
            className="text-xs font-light"
          >
            Posted on {posted.postDateFormat}, {posted.year}
          </time>
          <h1 className="relative my-2 w-full scroll-m-20 text-4xl font-bold tracking-tight">
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
      </div>
    </div>
  );
}
