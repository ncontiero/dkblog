"use client";

import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deletePostAction } from "@/actions/posts";
import { Button } from "@/components/ui/Button";

interface DeletePostBtnProps {
  readonly postSlug: string;
}

export function DeletePostBtn({ postSlug }: DeletePostBtnProps) {
  const deletePost = useAction(deletePostAction, {
    onError: () => {
      toast.error("Failed to delete post");
    },
    onSuccess: () => {
      toast.success("Post deleted");
    },
  });

  return (
    <Button
      variant="destructive"
      onClick={() => deletePost.execute({ slug: postSlug })}
      disabled={deletePost.status === "executing"}
    >
      {deletePost.status === "executing" ? (
        <Loader className="size-4 animate-spin" />
      ) : (
        "Delete"
      )}
    </Button>
  );
}
