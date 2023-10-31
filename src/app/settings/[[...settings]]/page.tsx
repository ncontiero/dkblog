import type { Metadata } from "next";

import { currentUser, UserProfile } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUser } from "@/utils/data/users";

import { Link } from "@/components/ui/Link";
import NextLink from "next/link";
import { UpdateUserData } from "./UpdateUserData";

export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function UserSettingsPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in?redirect_url=/settings");
  }
  const dbUser = await getUser({ where: { externalId: user.id } });

  return (
    <div className="mx-auto my-10 flex justify-center sm:container">
      <div className="flex flex-col items-start space-y-6">
        <h1 className="px-2">
          <Link asChild className="text-3xl">
            <NextLink href={`/${user.username}`}>@{user.username}</NextLink>
          </Link>
        </h1>
        <UserProfile
          path="/settings"
          routing="path"
          appearance={{
            elements: {
              navbar: "hidden",
              navbarMobileMenuRow: "hidden",
              card: "mx-0 shadow-none",
              pageScrollBox: "px-4 sm:px-8 py-9",
              rootBox: "w-full flex justify-center",
            },
          }}
        />
        {dbUser && (
          <UpdateUserData
            userId={user.id}
            initialBio={dbUser.bio || undefined}
            initialBrandColor={dbUser.brandColor}
          />
        )}
      </div>
    </div>
  );
}
