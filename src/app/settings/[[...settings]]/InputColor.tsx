"use client";

import { useCallback, useState } from "react";
import { env } from "@/env.mjs";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface InputColor {
  userId: string;
  userColor?: string;
}

export function InputColor({ userId, userColor }: InputColor) {
  const [color, setColor] = useState(userColor || "#000000");

  const updateBrandColor = useCallback(async () => {
    if (!color || color === userColor || !color.match(/^#[0-9a-fA-F]{6}$/i)) {
      return;
    }

    const toastLoading = toast.loading("Updating...");
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ brandColor: color }),
      });

      if (res.ok) {
        toast.update(toastLoading, {
          render: "Color updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      }
    } catch (err) {
      toast.update(toastLoading, {
        render: "Failed to update color!",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  }, [color, userColor, userId]);

  return (
    <div className="mt-2 flex items-center">
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="absolute ml-2 w-4 rounded-md border p-4"
        style={{ backgroundColor: color }}
      />
      <Input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full pl-12 sm:w-1/2"
      />
      <Button
        className="ml-4"
        type="button"
        onClick={() => updateBrandColor()}
        disabled={color === userColor || !color.match(/^#[0-9a-fA-F]{6}$/i)}
      >
        Save
      </Button>
    </div>
  );
}
