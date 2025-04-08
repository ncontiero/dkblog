import type { Post, Tag } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getTags } from "@/utils/db-queries/tags";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";
import { CreateOrUpdatePostForm } from "./Form";

interface CreateOrUpdatePostProps {
  readonly post?: Post & { tags: Tag[] };
}

const cacheTags = unstable_cache(async () => await getTags({}), ["tags"], {
  tags: ["tags"],
  revalidate: 60 * 60 * 24,
});

export async function CreateOrUpdatePost({ post }: CreateOrUpdatePostProps) {
  const tags = await cacheTags();

  return (
    <div className="relative mx-auto w-full max-w-5xl sm:mt-2">
      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2 rounded-none sm:rounded-md">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <CreateOrUpdatePostForm post={post} tags={tags} />
      </Tabs>
    </div>
  );
}
