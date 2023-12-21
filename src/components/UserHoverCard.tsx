import type { User } from "@prisma/client";

import { format } from "date-fns";

import Link from "next/link";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { Button } from "./ui/Button";

import { CalendarDays } from "lucide-react";

interface UserHoverCardProps {
  user: User;
  postDate?: Date;
  postDateFormatted?: string;
  postPage?: boolean;
}

export function UserHoverCard({
  user,
  postDate,
  postDateFormatted,
  postPage = false,
}: UserHoverCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href={`/${user.username}`}
          className={`group mb-2 flex w-fit items-center ${
            postPage ? "gap-3" : "gap-2"
          } rounded-md sm:px-3 ${
            postPage ? "py-2" : "sm:py-1"
          } duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hover:bg-background`}
        >
          <Image
            src={user.image}
            alt={user.username}
            width={postPage ? 40 : 32}
            height={postPage ? 40 : 32}
            className="rounded-full"
          />
          <div className="flex flex-col items-start gap-1">
            <span className={`${postPage && "text-lg"}`}>{user.username}</span>
            {postDate && (
              <time
                dateTime={postDate.toISOString()}
                className="text-xs font-light"
              >
                {postDateFormatted || format(postDate, "MMM d")}
              </time>
            )}
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="relative">
        <div className="absolute inset-x-0 top-0 -z-[1] h-8 w-full rounded-t-md bg-primary" />
        <Link
          href={`/${user.username}`}
          className="group mt-1 flex items-center space-x-2.5"
        >
          <Image
            src={user.image}
            alt={user.username}
            width={40}
            height={40}
            className="rounded-full"
          />
          <h4 className="self-end text-lg font-bold duration-200 group-hover:text-primary">
            {user.username}
          </h4>
        </Link>
        <Button className="mt-4 w-full" size="sm">
          Follow
        </Button>
        <div className="flex items-center pt-4">
          <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
          <span className="text-xs text-muted-foreground">
            Joined{" "}
            <time dateTime={new Date(user.createdAt).toISOString()}>
              {format(new Date(user.createdAt), "MMMM yyyy")}
            </time>
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
