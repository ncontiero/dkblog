import type { Tag } from "@prisma/client";
import { useState } from "react";

import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command";
import { X } from "lucide-react";

interface SelectTagProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
}

export function SelectTag({
  tags,
  setTags,
  selectedTags,
  setSelectedTags,
}: SelectTagProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Tag>();

  return (
    <Popover
      open={open ? selectedTags.length <= 4 && tags.length > 0 : false}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        {value ? (
          <div
            style={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              "--tag-color": `${value.color}`,
            }}
            className="flex items-center gap-2 rounded-md bg-[hsl(var(--tag-color)/0.1)] p-2"
          >
            <span>
              <span className="text-[hsl(var(--tag-color))]">#</span>{" "}
              {value.slug}
            </span>
            <button
              type="button"
              className="p-1 text-sm duration-200 hover:text-destructive"
              aria-label="Remove tag"
              onClick={() => {
                setValue(undefined);
                setTags([...tags, value]);
                setSelectedTags(selectedTags.filter((t) => t !== value));
                setOpen(false);
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <Input
            type="text"
            placeholder={
              value
                ? selectedTags.find((tag) => tag === value)?.slug
                : selectedTags.length === 0
                ? "Add up to 4 tags"
                : "Add another"
            }
            role="combobox"
            aria-expanded={open}
            className="bg-secondary p-0 text-base"
            defaultValue={
              value ? selectedTags.find((tag) => tag === value)?.slug : ""
            }
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="mt-1 w-full p-0">
        <Command>
          <CommandInput placeholder="Search tag..." />
          <CommandEmpty>No tags found</CommandEmpty>
          <CommandGroup>
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.slug}
                onSelect={(currentValue) => {
                  const tag = tags.find((t) => t.slug === currentValue) as Tag;
                  setValue(currentValue === value?.slug ? undefined : tag);
                  setSelectedTags([...selectedTags, tag]);
                  setTags(tags.filter((t) => t.slug !== currentValue));
                  setOpen(false);
                }}
                className="flex flex-col items-start gap-2 py-3"
              >
                <span>
                  <span
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      "--tag-color": `${tag.color}`,
                    }}
                    className="text-[hsl(var(--tag-color))]"
                  >
                    #
                  </span>
                  {tag.slug}
                </span>
                <p>{tag.description?.slice(0, 100)}...</p>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
