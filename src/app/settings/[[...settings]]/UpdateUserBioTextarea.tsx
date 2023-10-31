"use client";

import { useCallback, useState } from "react";
import { env } from "@/env.mjs";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface UpdateUserBioTextareaProps {
  userId: string;
  userBio?: string | null;
}

export function UpdateUserBioTextarea({
  userId,
  userBio,
}: UpdateUserBioTextareaProps) {
  const [bio, setBio] = useState(userBio ?? "");

  const handleUpdateUserBio = useCallback(async () => {
    const toastLoading = toast.loading("Updating...");
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ bio }),
      });

      if (res.ok) {
        toast.update(toastLoading, {
          render: "Bio updated",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.update(toastLoading, {
        render: "Failed to update bio",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  }, [bio, userId]);

  return (
    <div className="mt-2 flex flex-col items-center">
      <Textarea
        id="user-bio"
        placeholder="A little bit about yourself"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={200}
      />
      <div className="mt-4 flex w-full justify-start">
        <Button
          onClick={() => handleUpdateUserBio()}
          type="button"
          disabled={bio === userBio || !bio.trim().length}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
