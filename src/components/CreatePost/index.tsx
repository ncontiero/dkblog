"use client";

import type { PostStatus, Tag as TagType } from "@prisma/client";
import type { EditValuesProps } from "./types";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { env } from "@/env";
import { MdRenderer } from "../MdRenderer";
import { Tag } from "../Tag";
import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Textarea } from "../ui/Textarea";
import { InputFile } from "./InputFile";
import { SelectTag } from "./SelectTag";

interface CreatePostProps {
  readonly title: string;
  readonly description?: string;
  readonly image?: string;
  readonly content: string;
  readonly tags?: TagType[];
  readonly slug?: string;
  readonly isEdit?: boolean;
}

const emptyArray: TagType[] = [];

export function CreatePost({
  title,
  description,
  content,
  image,
  slug,
  tags: initialTags = emptyArray,
  isEdit = false,
}: CreatePostProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [imgPreview, setImgPreview] = useState<string | undefined>(image);
  const [editValues, setEditValues] = useState<EditValuesProps>({
    title,
    content,
    tags: initialTags,
    description,
  });

  const getTags = useCallback(async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tags`);
    const data = (await res.json()) as TagType[];
    const tagsWithoutInitialTags = data
      .map((tag) =>
        initialTags.map((t) => t.id === tag.id).includes(true) ? null : tag,
      )
      .filter((tag) => tag !== null) as TagType[];
    setTags(tagsWithoutInitialTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTags();
    if (contentRef.current) {
      contentRef.current.style.minHeight = `${560}px`;
    }
  }, [getTags]);

  const uploadImage = useCallback(
    async (img?: File) => {
      if (!img || image === imgPreview) {
        return "";
      }

      const formData = new FormData();
      formData.append("file", img);
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      return (await res.json()).image || "";
    },
    [image, imgPreview],
  );

  const submitData = useCallback(
    async (status: PostStatus = "DRAFTED") => {
      setSubmitting(true);
      const toastLoading = toast.loading(
        `${isEdit ? "Updating" : "Creating"} post...`,
      );
      try {
        const img = await uploadImage(editValues.image);
        const data = {
          title: editValues.title,
          content: editValues.content,
          tags: editValues.tags.map((tag) => tag.slug).slice(0, 4),
          image: img,
          status,
          description: editValues.description,
          userId,
        };
        const baseUrl = `${env.NEXT_PUBLIC_API_URL}/posts`;
        const url = isEdit ? `${baseUrl}/${slug}` : baseUrl;
        const res = await fetch(url, {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const post = await res.json();
          setTimeout(() => {
            router.push(`/${post.user.username}/${post.slug}`);
          }, 1000);
          toast.update(toastLoading, {
            render: `Post ${
              isEdit ? "updated" : "created"
            } successfully! Wait while we redirect you`,
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        } else {
          throw new Error(`Failed to ${isEdit ? "update" : "create"} post`);
        }
      } catch {
        toast.update(toastLoading, {
          render: `Failed to ${isEdit ? "update" : "create"} post`,
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [editValues, isEdit, router, slug, uploadImage, userId],
  );

  if (!isLoaded || !userId) {
    redirect("/sign-in?redirect_url=/new");
  }

  return (
    <div className="relative mx-auto my-0 min-h-screen w-full max-w-4xl sm:mt-2">
      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2 rounded-none sm:rounded-md">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <ScrollArea className="z-10 mt-2 h-screen w-full bg-secondary sm:h-[calc(100vh-64px-88px)] sm:rounded-md">
          <TabsContent value="edit">
            <>
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
                  {imgPreview ? (
                    <div className="flex gap-1">
                      <InputFile
                        editValues={editValues}
                        setEditValues={setEditValues}
                        setImgPreview={setImgPreview}
                      />
                      <Button
                        variant="destructive"
                        className="border border-transparent py-4 sm:py-6 sm:text-base"
                        onClick={() => {
                          setEditValues({ ...editValues, image: undefined });
                          setImgPreview(undefined);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <InputFile
                      editValues={editValues}
                      setEditValues={setEditValues}
                      setImgPreview={setImgPreview}
                    />
                  )}
                </div>
                <Textarea
                  className="resize-none border-transparent bg-secondary pl-0 text-3xl font-bold sm:text-5xl sm:font-extrabold"
                  placeholder="New post title here..."
                  aria-label="Post Title"
                  onChange={(e) =>
                    setEditValues({ ...editValues, title: e.target.value })
                  }
                  value={editValues.title}
                />
                <Textarea
                  className="mt-2 resize-none bg-secondary py-0 pl-0 text-xl font-bold sm:font-extrabold"
                  placeholder="Post description here..."
                  aria-label="Post Description"
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      description: e.target.value,
                    })
                  }
                  value={editValues.description}
                />
                <ul className="mt-2 flex w-fit flex-col gap-1 sm:flex-row sm:gap-0">
                  <li className="order-1">
                    <SelectTag
                      tags={tags}
                      initialValue={editValues.tags[0]}
                      selectedTags={editValues.tags}
                      setSelectedTags={(tags) =>
                        setEditValues({ ...editValues, tags })
                      }
                      setTags={setTags}
                    />
                  </li>
                  {editValues.tags.slice(0, 3).map(({ id }, i) => (
                    <li key={id} className="sm:ml-2" style={{ order: i + 2 }}>
                      <SelectTag
                        tags={tags}
                        initialValue={editValues.tags[i + 1]}
                        selectedTags={editValues.tags}
                        setSelectedTags={(tags) =>
                          setEditValues({ ...editValues, tags })
                        }
                        setTags={setTags}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="mb-10 h-full p-4 sm:px-16"
                style={{ minHeight: `${contentRef.current?.scrollHeight}px` }}
              >
                <Textarea
                  placeholder="Write your post content here..."
                  aria-label="Post Content"
                  className="h-full resize-none overflow-hidden whitespace-pre-wrap bg-background/20 text-lg transition-all duration-500"
                  style={{ minHeight: `${contentRef.current?.scrollHeight}px` }}
                  ref={contentRef}
                  onChange={(e) =>
                    setEditValues({ ...editValues, content: e.target.value })
                  }
                  value={editValues.content}
                />
              </div>
            </>
          </TabsContent>
          <TabsContent value="preview" className="max-w-screen-sm">
            <div className="w-full">
              {imgPreview ? (
                <div className="relative mr-3 size-full">
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
                  {editValues.title}
                </h1>
                {editValues.tags && editValues.tags.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-0.5">
                    {editValues.tags.map((tag) => (
                      <Tag key={tag.id} tag={tag} />
                    ))}
                  </div>
                ) : null}
                <MdRenderer.Client content={editValues.content} />
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      <div className="fixed bottom-0 z-20 flex w-full max-w-4xl gap-2 bg-background px-2 py-4 sm:px-0">
        <Button
          onClick={() => submitData("PUBLISHED")}
          disabled={
            editValues.title === "" || editValues.content === "" || submitting
          }
          className="disabled:cursor-not-allowed"
          type="button"
        >
          {submitting ? <Loader className="size-5 animate-spin" /> : "Publish"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => submitData()}
          disabled={
            editValues.title === "" || editValues.content === "" || submitting
          }
          className="disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            "Save draft"
          )}
        </Button>
      </div>
    </div>
  );
}
