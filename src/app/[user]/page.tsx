import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getUsers } from "@/utils/data";

import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/PostCard";

import { CalendarDays, Hash, ScrollText } from "lucide-react";

export const revalidate = 60;

type Props = {
  params: { user: string };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  const users = await getUsers();

  return users.map((u) => ({
    user: u.username,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { user: username } = params;

  const user = (await getUsers()).find((u) => u.username === username);
  if (!user) {
    return notFound();
  }

  const userUrl = `${(await parent).metadataBase}${user.username}`;

  return {
    title: user.username,
    alternates: {
      canonical: userUrl,
    },
    openGraph: {
      title: user.username,
      url: userUrl,
      type: "profile",
      images: user.image ? [user.image] : undefined,
    },
    twitter: {
      card: user.image ? "summary_large_image" : "summary",
      title: user.username,
      images: user.image ? [user.image] : undefined,
    },
  };
}

export default async function UserPage({ params }: Props) {
  const user = (await getUsers()).find((u) => u.username === params.user);

  if (!user) {
    notFound();
  }

  const joinedOn = format(new Date(user.createdAt), "dd MMM. yyyy");
  const posts = user.posts.filter((p) => p.status === "PUBLISHED");
  const postsPublished = user.posts
    .map((p) => (p.status === "PUBLISHED" ? 1 : (0 as number)))
    .reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto mb-10 max-w-5xl">
      <div className="absolute inset-x-0 top-0 -z-[1] mt-16 h-40 w-full bg-primary" />
      <div className="mt-28 flex flex-col items-center justify-center border-2 border-primary bg-secondary sm:mx-2 sm:rounded-md">
        <div className="relative mb-3 flex w-full items-center px-6 sm:justify-center sm:px-0">
          <span className="-mt-14 rounded-full bg-primary p-2 sm:-mt-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image}
              alt={user.username}
              className="h-24 w-24 rounded-full bg-black sm:h-32 sm:w-32"
            />
          </span>
          <div className="absolute inset-x-0 right-0 top-0 flex justify-end pr-6 pt-6">
            <Button>Edit profile</Button>
          </div>
        </div>
        <div className="flex flex-col p-6 sm:items-center sm:justify-center sm:text-center">
          <h1 className="mb-4 text-3xl font-bold">{user.username}</h1>
          <p className="mb-8 max-w-[75%] sm:mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A fuga
            ullam, nobis numquam reprehenderit porro nisi explicabo quidem
            soluta amet? Aliquam obcaecati quidem expedita ullam voluptas illo
            quisquam quos delectus.
          </p>
          <div className="flex">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">
              Joined on{" "}
              <time dateTime={new Date(user.createdAt).toISOString()}>
                {joinedOn}
              </time>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:mx-2">
        <div className="flex h-fit flex-col gap-4 bg-secondary p-4 sm:rounded-md">
          <div className="flex items-center gap-3 font-normal">
            <ScrollText size={24} /> {postsPublished} posts published
          </div>
          <div className="flex items-center gap-3">
            <Hash size={24} /> 0 tags followed
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} className="w-full p-5" />
          ))}
        </div>
      </div>
    </div>
  );
}
