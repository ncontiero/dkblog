import type { Tag } from "@prisma/client";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/Command";
import { Button } from "../ui/Button";
import { X } from "lucide-react";

interface SelectTagProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  initialValue?: Tag;
}

export function SelectTag({
  tags,
  setTags,
  selectedTags,
  setSelectedTags,
  initialValue,
}: SelectTagProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Tag | undefined>(initialValue);

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
          <Button
            type="button"
            role="combobox"
            aria-expanded={open}
            variant="outline"
          >
            {selectedTags.length === 0 ? "Add up to 4 tags" : "Add another"}
          </Button>
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
