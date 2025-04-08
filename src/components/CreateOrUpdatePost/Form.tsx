"use client";

import type { Post, Tag as TagProps } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { createOrUpdatePostAction } from "@/actions/posts";
import {
  type CreateOrUpdatePostSchema,
  createOrUpdatePostSchema,
} from "@/actions/posts/schema";
import { MdRenderer } from "../MdRenderer";
import { Tag } from "../Tag";
import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import { TabsContent } from "../ui/Tabs";
import { Textarea } from "../ui/Textarea";
import { InputFile } from "./InputFile";
import { SelectTag } from "./SelectTag";

interface CreateOrUpdatePostFormProps {
  readonly post?: Post & { tags: TagProps[] };
  readonly tags: TagProps[];
}

export function CreateOrUpdatePostForm({
  post,
  tags,
}: CreateOrUpdatePostFormProps) {
  const createOrUpdatePost = useAction(createOrUpdatePostAction, {
    onError: ({ error }) => {
      toast.error(
        `Error ${post ? "updating" : "creating"} post: ${error.serverError}`,
      );
      console.error(error.serverError);
    },
    onSuccess: () => {
      toast.success(`Post ${post ? "updated" : "created"} successfully`);
    },
  });

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [imgPreview, setImgPreview] = useState<string | undefined | null>(
    post?.image,
  );

  const form = useForm({
    resolver: zodResolver(createOrUpdatePostSchema),
    defaultValues: {
      ...post,
      image: undefined,
      tags: post?.tags.map((tag) => tag.slug) || [],
    },
  });

  useEffect(() => {
    if (
      form.watch("content") &&
      contentRef.current &&
      contentRef.current.scrollHeight > 500
    ) {
      contentRef.current.style.minHeight = `${contentRef.current.scrollHeight}px`;
    }
  }, [form]);

  function onSubmit(data: CreateOrUpdatePostSchema) {
    createOrUpdatePost.execute({
      ...data,
      id: post?.id,
      updateImage: imgPreview !== post?.image,
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="mt-2 h-[calc(100vh-12rem)] w-full bg-secondary sm:rounded-md">
          <TabsContent value="edit">
            <div className="p-4 sm:px-16">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-0">
                {imgPreview ? (
                  <div className="relative mr-3 h-[105px] w-[250px]">
                    <Image
                      src={imgPreview}
                      alt="Post image preview"
                      fill
                      className="aspect-video rounded-md object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex gap-1">
                  <InputFile
                    labelText={imgPreview ? "Change" : "Add a cover image"}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (
                        files &&
                        files[0] &&
                        files[0].type.startsWith("image/")
                      ) {
                        setImgPreview(URL.createObjectURL(files[0]));
                        form.setValue("image", files[0]);
                      }
                    }}
                  />
                  {imgPreview ? (
                    <Button
                      variant="destructive"
                      className="border border-transparent py-4 sm:py-6 sm:text-base"
                      onClick={() => {
                        setImgPreview(null);
                        form.setValue("image", undefined);
                      }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>
              <Textarea
                className="resize-none border-transparent bg-secondary pl-0 text-3xl font-bold sm:text-5xl sm:font-extrabold"
                placeholder="New post title here..."
                aria-label="Post Title"
                {...form.register("title")}
              />
              <Textarea
                className="mt-2 resize-none bg-secondary py-0 pl-0 text-xl font-bold sm:font-extrabold"
                placeholder="Post description here..."
                aria-label="Post Description"
                {...form.register("description")}
              />
              <ul className="mt-2 flex w-fit flex-col gap-2 sm:flex-row">
                {Array.from({ length: 4 }).map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={i} className="order-1">
                    <SelectTag
                      tags={tags}
                      initialValue={tags.find(
                        (tag) => tag.slug === form.watch("tags")[i],
                      )}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="mb-10 h-full p-4 sm:px-16"
              style={{
                minHeight: `${contentRef.current?.scrollHeight || 500}px`,
              }}
            >
              <Textarea
                placeholder="Write your post content here..."
                aria-label="Post Content"
                className="h-full resize-none overflow-hidden whitespace-pre-wrap bg-background/20 text-lg transition-shadow duration-500"
                style={{
                  minHeight: `${contentRef.current?.scrollHeight || 500}px`,
                }}
                ref={contentRef}
                value={form.watch("content")}
                onChange={(e) => form.setValue("content", e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent
            value="preview"
            className="mx-auto min-h-screen max-w-3xl"
          >
            <div className="flex w-full flex-col items-center">
              {imgPreview ? (
                <div className="mr-3 size-full">
                  <Image
                    src={imgPreview}
                    alt="Post image preview"
                    width={1000}
                    height={420}
                    className="-mt-2.5 flex items-center justify-center object-contain sm:rounded-t-md"
                  />
                </div>
              ) : null}
              <div className="w-full p-4 sm:px-16 ">
                <h1 className="relative mb-2 mt-4 w-full scroll-m-20 text-4xl font-bold tracking-tight">
                  {form.watch("title")}
                </h1>
                {form.watch("tags").length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-0.5">
                    {form.watch("tags").map((tag) => (
                      <Tag key={tag} tag={tags.find((t) => t.slug === tag)!} />
                    ))}
                  </div>
                ) : null}
                <MdRenderer.Client content={form.watch("content")} />
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
        <div className="sticky bottom-0 flex w-full max-w-5xl gap-2 bg-background px-2 py-4 sm:px-0">
          <Button
            type="button"
            onClick={() =>
              onSubmit({ ...form.getValues(), status: "PUBLISHED" })
            }
            disabled={createOrUpdatePost.status === "executing"}
          >
            {createOrUpdatePost.status === "executing" ? (
              <Loader className="animate-spin" />
            ) : (
              "Publish"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onSubmit({ ...form.getValues(), status: "DRAFTED" })}
            disabled={createOrUpdatePost.status === "executing"}
          >
            {createOrUpdatePost.status === "executing" ? (
              <Loader className="animate-spin" />
            ) : (
              "Save draft"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
