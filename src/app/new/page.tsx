import { CreatePost } from "@/components/CreatePost";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a new post",
};

export default function CreatePostPage() {
  return <CreatePost content="" title="" />;
}
