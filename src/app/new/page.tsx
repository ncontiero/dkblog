import type { Metadata } from "next";
import { CreateOrUpdatePost } from "@/components/CreateOrUpdatePost";

export const metadata: Metadata = {
  title: "Create a new post",
};

export default function CreatePostPage() {
  return <CreateOrUpdatePost />;
}
