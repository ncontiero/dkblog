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
import { ScrollArea } from "../ui/ScrollArea";

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
            className="flex items-center justify-between gap-2 rounded-md bg-[hsl(var(--tag-color)/0.1)] p-2"
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
                setTags([...tags, value]);
                setSelectedTags(
                  selectedTags.filter((t) => t.slug !== value.slug),
                );
                setValue(undefined);
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
      <PopoverContent
        className="z-[999999] mt-1 w-screen p-0 sm:w-full"
        align="start"
      >
        <ScrollArea className="h-96">
          <Command>
            <CommandInput placeholder="Search tag..." />
            <CommandEmpty>No tags found</CommandEmpty>
            <CommandGroup>
              {tags.map((tag, i) => (
                <CommandItem
                  key={i}
                  value={tag.slug}
                  onSelect={(currentValue) => {
                    setValue(tag);
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
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
