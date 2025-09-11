"use client";

import type { User } from "@/lib/prisma";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { updateUserInfoAction } from "@/actions/users";
import {
  type UpdateUserInfoSchema,
  updateUserInfoSchema,
} from "@/actions/users/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface UpdateUserDataProps {
  readonly user: User;
}

export function UpdateUserData({ user }: UpdateUserDataProps) {
  const [dataChanged, setDataChanged] = useState(false);

  const updateUserInfo = useAction(updateUserInfoAction, {
    onError: () => {
      toast.error("Something went wrong while updating your profile");
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setDataChanged(false);
    },
  });

  const form = useForm({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      bio: user.bio || undefined,
      brandColor: user.brandColor,
    },
  });

  function onSubmit(data: UpdateUserInfoSchema) {
    updateUserInfo.execute(data);
  }

  useEffect(() => {
    form.watch((value) => {
      setDataChanged(
        value.bio !== user.bio || value.brandColor !== user.brandColor,
      );
    });
  }, [form, user.bio, user.brandColor]);

  return (
    <form
      className="relative flex w-full flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-primary/50 px-8 py-9">
        <h2 className="text-3xl font-bold">Basic</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="user-bio">Bio</label>
          <div className="mt-2 flex flex-col items-center">
            <Textarea
              id="user-bio"
              placeholder="A little bit about yourself"
              {...form.register("bio")}
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
              className="absolute ml-2 w-4 rounded-md border p-4"
              style={{ backgroundColor: form.watch("brandColor") }}
              {...form.register("brandColor", {
                onChange: (e) => {
                  form.setValue("brandColor", e.target.value);
                },
              })}
            />
            <Input
              id="brand-color"
              type="text"
              className="w-full pl-12 sm:w-1/2"
              {...form.register("brandColor")}
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
        <Button
          type="submit"
          disabled={updateUserInfo.status === "executing" || !dataChanged}
        >
          {updateUserInfo.status === "executing" ? (
            <div className="flex items-center gap-2">
              Updating...
              <Loader className="animate-spin" />
            </div>
          ) : (
            "Save Profile Information"
          )}
        </Button>
      </div>
    </form>
  );
}
