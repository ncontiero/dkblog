"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { env } from "@/env.mjs";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";

interface UpdateUserDataProps {
  userId: string;
  initialBrandColor?: string;
  initialBio?: string;
}

export function UpdateUserData({
  userId,
  initialBrandColor = "",
  initialBio = "",
}: UpdateUserDataProps) {
  const [dataChanged, setDataChanged] = useState(false);
  const [brandColor, setBrandColor] = useState({
    old: initialBrandColor,
    new: initialBrandColor,
  });
  const [bio, setBio] = useState({ old: initialBio, new: initialBio });

  const brandColorIsValidAndChanged = useMemo(() => {
    const brandColorIsValid =
      brandColor.new?.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/) != null;
    return brandColorIsValid && brandColor.old !== brandColor.new;
  }, [brandColor.new, brandColor.old]);

  useEffect(() => {
    setDataChanged(brandColorIsValidAndChanged || bio.old !== bio.new);
  }, [bio, brandColorIsValidAndChanged]);

  const handleUpdateData = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!dataChanged) {
        return;
      }

      const toastLoading = toast.loading("Updating...");
      const data = { brandColor: brandColor.new, bio: bio.new };
      try {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });

        if (res.ok) {
          setBrandColor({ old: brandColor.new, new: brandColor.new });
          setBio({ old: bio.new, new: bio.new });
          toast.update(toastLoading, {
            render: "Profile updated successfully!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        }
      } catch (err) {
        toast.update(toastLoading, {
          render: "Failed to update profile!",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      }
    },
    [bio.new, brandColor.new, dataChanged, userId],
  );

  return (
    <form
      className="relative flex w-full flex-col gap-6"
      onSubmit={handleUpdateData}
    >
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-primary/50 px-8 py-9">
        <h2 className="text-3xl font-bold">Basic</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="user-bio">Bio</label>
          <div className="mt-2 flex flex-col items-center">
            <Textarea
              id="user-bio"
              placeholder="A little bit about yourself"
              value={bio.new}
              onChange={(e) => setBio({ old: bio.old, new: e.target.value })}
              maxLength={200}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-primary/50 px-8 py-9">
        <h2 className="text-3xl font-bold">Branding</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="brand-color">Brand color</label>
          <p className="text-sm">Used for backgrounds, borders etc.</p>
          <div className="mt-2 flex items-center">
            <input
              type="color"
              value={brandColor.new}
              onChange={(e) =>
                setBrandColor({ old: brandColor.old, new: e.target.value })
              }
              className="absolute ml-2 w-4 rounded-md border p-4"
              style={{ backgroundColor: brandColor.new }}
            />
            <Input
              type="text"
              value={brandColor.new}
              onChange={(e) =>
                setBrandColor({ old: brandColor.old, new: e.target.value })
              }
              className="w-full pl-12 sm:w-1/2"
            />
          </div>
        </div>
      </div>
      <div
        className={`flex ${
          dataChanged
            ? "sticky bottom-0 rounded-md p-4 animate-in"
            : "rounded-2xl px-8 py-9"
        } w-full flex-col gap-4 border border-primary/50 duration-200`}
      >
        <Button type="submit" disabled={!dataChanged}>
          Save Profile Information
        </Button>
      </div>
    </form>
  );
}
