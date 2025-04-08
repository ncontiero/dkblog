import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { getUser } from "@/utils/db-queries/users";
import { UpdateUserData } from "./UpdateUserData";

export const metadata: Metadata = {
  title: "Settings",
};

const createCacheForGetUser = (username: string) => {
  return unstable_cache(
    async () => await getUser({ where: { username } }),
    [`user:${username}:settings`],
    { tags: [`user:${username}:settings`], revalidate: 60 * 60 },
  );
};

export default async function UserSettingsPage() {
  const user = await currentUser();
  if (!user || !user.username) {
    redirect("/sign-in?redirect_url=/settings");
  }
  const getCachedDbUser = createCacheForGetUser(user.username);
  const dbUser = await getCachedDbUser();

  return (
    <div className="mx-auto my-10 flex justify-center sm:container">
      <div className="flex flex-col items-start space-y-6">
        <h1 className="px-2">
          <Link className="text-3xl" href={`/${user.username}`}>
            @{user.username}
          </Link>
        </h1>
        <UserProfile path="/settings" />
        {dbUser ? <UpdateUserData user={dbUser} /> : null}
      </div>
    </div>
  );
}
