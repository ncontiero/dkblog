"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { Loader } from "lucide-react";

interface DeletePostBtnProps {
  postSlug: string;
  username: string;
}

export function DeletePostBtn({ postSlug, username }: DeletePostBtnProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const deletePost = useCallback(async () => {
    setDeleting(true);
    await fetch(`/api/posts/${postSlug}`, { method: "DELETE" });
    setDeleting(false);
    router.push(`/${username}`);
  }, [postSlug, router, username]);

  return (
    <Button
      variant="destructive"
      onClick={() => deletePost()}
      disabled={deleting}
    >
      {deleting ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
    </Button>
  );
}
