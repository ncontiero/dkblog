import type { Metadata } from "next";
import { CreatePost } from "@/components/CreatePost";

export const metadata: Metadata = {
  title: "Create a new post",
};

export default function CreatePostPage() {
  return <CreatePost content="" title="" />;
}
