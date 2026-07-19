import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { CreateOrUpdatePost } from "@/components/CreateOrUpdatePost";

export const metadata: Metadata = {
  title: "Create a new post",
};

export default async function CreatePostPage() {
  await auth.protect();

  return <CreateOrUpdatePost />;
}
