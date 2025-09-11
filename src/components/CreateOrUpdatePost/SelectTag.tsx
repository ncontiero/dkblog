import type { Tag } from "@/lib/prisma";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronsUpDown, X } from "lucide-react";
import { Button } from "../ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { ScrollArea } from "../ui/ScrollArea";

interface SelectTagProps {
  readonly tags: Tag[];
  readonly initialValue?: Tag;
}

export function SelectTag({ tags, initialValue }: SelectTagProps) {
  const formContext = useFormContext();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Tag | undefined>(initialValue);

  return (
    <Popover
      open={
        open ? formContext.watch("tags").length <= 4 && tags.length > 0 : false
      }
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        {selected ? (
          <div
            style={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              "--tag-color": `${selected.color}`,
            }}
            className="flex items-center justify-between gap-2 rounded-md bg-[hsl(var(--tag-color)/0.1)] p-2"
          >
            <span>
              <span className="text-[hsl(var(--tag-color))]">#</span>{" "}
              {selected.slug}
            </span>
            <button
              type="button"
              className="rounded-full p-1 text-sm duration-200 hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Remove tag"
              onClick={() => {
                formContext.setValue("tags", [
                  ...formContext
                    .watch("tags")
                    .filter((t: string) => t !== selected.slug),
                ]);
                setSelected(undefined);
              }}
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            role="combobox"
            aria-expanded={open}
            variant="outlinePrimary"
            className="gap-2"
          >
            Add tag
            <ChevronsUpDown className="size-4 opacity-50" />
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
            <CommandList className="max-h-full pr-2">
              <CommandEmpty>No tags found</CommandEmpty>
              <CommandGroup>
                {tags
                  .filter((t) => !formContext.watch("tags").includes(t.slug))
                  .map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.slug}
                      onSelect={(currentValue) => {
                        formContext.setValue("tags", [
                          ...formContext
                            .watch("tags")
                            .filter((t: string) => t !== selected?.slug),
                          currentValue,
                        ]);
                        setSelected(tag);
                        setOpen(false);
                      }}
                      disabled={formContext.watch("tags").includes(tag.slug)}
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
            </CommandList>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
