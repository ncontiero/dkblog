"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { UserIcon } from "lucide-react";

type UserButtonProps = {
  readonly username?: string | null;
};

export function UserButton({ username }: UserButtonProps) {
  return (
    <ClerkUserButton userProfileMode="navigation" userProfileUrl="/settings">
      {username ? (
        <ClerkUserButton.MenuItems>
          <ClerkUserButton.Link
            labelIcon={<UserIcon size={18} />}
            label="My profile"
            href={`/${username}`}
          >
            Profile
          </ClerkUserButton.Link>
        </ClerkUserButton.MenuItems>
      ) : null}
    </ClerkUserButton>
  );
}
