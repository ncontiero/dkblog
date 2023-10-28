"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import type { PostStatus, Tag as TagType } from "@prisma/client";
import { env } from "@/env.mjs";
import { toast } from "react-toastify";

import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Textarea } from "../ui/Textarea";
import { MdRenderer } from "../MdRenderer";
import { InputFile as InputFilePrimitive } from "../ui/InputFile";
import { Tag } from "../Tag";
import Image from "next/image";
import { LoadingPreview } from "./LoadingPreview";
import { SelectTag } from "./SelectTag";

interface EditValuesProps {
  title: string;
  image?: File;
  content: string;
  tags?: TagType[];
}

interface CreatePostProps {
  title: string;
  image?: string;
  content: string;
  tags?: TagType[];
  slug?: string;
  isEdit?: boolean;
}

export function CreatePost({
  title,
  content,
  image,
  slug,
  tags: initialTags = [],
  isEdit = false,
}: CreatePostProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [imgPreview, setImgPreview] = useState<string | undefined>(image);
  const [editValues, setEditValues] = useState<EditValuesProps>({
    title,
    content,
    tags: initialTags,
  });

  const getTags = useCallback(async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tags`);
    const data = (await res.json()) as TagType[];
    const newTags: TagType[] = [];
    data.map((tag) =>
      editValues.tags?.map((t) => t.slug).includes(tag.slug)
        ? null
        : newTags.push(tag),
    );
    setTags(newTags);
  }, [editValues.tags]);

  useEffect(() => {
    getTags();
    if (contentRef.current) {
      contentRef.current.style.minHeight = 560 + "px";
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
      const toastLoading = toast.loading(
        `${isEdit ? "Updating" : "Creating"} post...`,
      );
      try {
        const img = await uploadImage(editValues.image);
        const data = {
          title: editValues.title,
          content: editValues.content,
          tags: editValues.tags?.map((tag) => tag.slug),
          image: img,
          status,
          description: "A simple description",
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
          setTimeout(async () => {
            router.push(`/${post.user.username}/${post.slug}`);
          }, 1000);
          toast.dismiss(toastLoading);
          toast.success(
            `Post ${
              isEdit ? "updated" : "created"
            } successfully! Wait while we redirect you`,
          );
        } else {
          throw new Error(`Failed to ${isEdit ? "update" : "create"} post`);
        }
      } catch (err) {
        toast.dismiss(toastLoading);
        toast.error(`Failed to ${isEdit ? "update" : "create"} post`);
      }
    },
    [editValues, isEdit, router, slug, uploadImage, userId],
  );

  const handleImage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0].type.startsWith("image/")) {
        setImgPreview(URL.createObjectURL(e.target.files[0]));
        setEditValues({
          ...editValues,
          image: e.target.files[0],
        });
      }
    },
    [editValues],
  );

  const InputFile = () => {
    return (
      <InputFilePrimitive
        variant="outlinePrimary"
        className="bg-secondary py-4 text-foreground focus-within:bg-primary focus-within:text-primary-foreground sm:py-6 sm:text-base"
        id="cover-image"
        accept="image/*"
        onChange={handleImage}
        tooltipContent={
          <>
            <p className="text-sm">Only images are allowed.</p>
            <p className="text-sm">Maximum file size is 5MB.</p>
            <p className="text-sm">
              Use a ration of 1000:420 for best results.
            </p>
          </>
        }
      />
    );
  };

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
              <div className="px-4 py-4 sm:px-16">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-0">
                  {imgPreview && (
                    <div className="relative mr-3 h-[105px] w-[250px]">
                      <Image
                        src={imgPreview}
                        alt="Post image preview"
                        fill
                        className="aspect-video rounded-md object-cover"
                      />
                    </div>
                  )}
                  {imgPreview ? (
                    <div className="flex gap-1">
                      <InputFile />
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
                    <InputFile />
                  )}
                </div>
                <Textarea
                  className="resize-none border-transparent bg-secondary pl-0 text-3xl font-bold sm:text-5xl sm:font-extrabold"
                  placeholder="New post title here..."
                  aria-label="Post Title"
                  onChange={(e) =>
                    setEditValues({ ...editValues, title: e.target.value })
                  }
                  value={editValues?.title}
                />
                <ul className="mt-2 flex w-fit flex-col gap-1 sm:flex-row sm:gap-0">
                  <li className="order-1">
                    <SelectTag
                      tags={tags}
                      initialValue={editValues.tags?.[0]}
                      selectedTags={editValues.tags || []}
                      setSelectedTags={(tags) =>
                        setEditValues({ ...editValues, tags })
                      }
                      setTags={setTags}
                    />
                  </li>
                  {editValues.tags?.slice(0, 3).map((tag, i) => (
                    <li key={i} className="sm:ml-2" style={{ order: i + 2 }}>
                      <SelectTag
                        tags={tags}
                        initialValue={editValues.tags?.[i + 1]}
                        selectedTags={editValues.tags || []}
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
                style={{ minHeight: contentRef.current?.scrollHeight + "px" }}
              >
                <Textarea
                  placeholder="Write your post content here..."
                  aria-label="Post Content"
                  className="h-full resize-none overflow-hidden whitespace-pre-wrap bg-background/20 text-lg transition-all duration-500"
                  style={{ minHeight: contentRef.current?.scrollHeight + "px" }}
                  ref={contentRef}
                  onChange={(e) =>
                    setEditValues({ ...editValues, content: e.target.value })
                  }
                  value={editValues?.content}
                />
              </div>
            </>
          </TabsContent>
          <TabsContent value="preview" className="max-w-screen">
            {editValues.content !== "" && editValues.title !== "" ? (
              <div className="w-full">
                {imgPreview && (
                  <div className="relative mr-3 h-full w-full">
                    <Image
                      src={imgPreview}
                      alt="Post image preview"
                      width={1000}
                      height={420}
                      className="-mt-2.5 flex items-center justify-center object-contain sm:rounded-t-md"
                    />
                  </div>
                )}
                <div className="w-full px-4 py-4 sm:px-16 ">
                  <h1 className="relative mb-2 mt-4 w-full scroll-m-20 text-4xl font-bold tracking-tight">
                    {editValues.title}
                  </h1>
                  {editValues.tags && editValues.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-0.5">
                      {editValues.tags.map((tag) => (
                        <Tag key={tag.id} tag={tag} />
                      ))}
                    </div>
                  )}
                  <MdRenderer.Client content={editValues.content} />
                </div>
              </div>
            ) : (
              <LoadingPreview />
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
      <div className="fixed bottom-0 z-20 flex w-full max-w-4xl gap-2 bg-background px-2 py-4 sm:px-0">
        <Button
          onClick={() => submitData("PUBLISHED")}
          disabled={!(editValues.title !== "" || editValues.content !== "")}
          className="disabled:cursor-not-allowed"
          type="button"
        >
          Publish
        </Button>
        <Button
          variant="ghost"
          onClick={() => submitData()}
          disabled={!(editValues.title !== "" || editValues.content !== "")}
          className="disabled:cursor-not-allowed"
        >
          Save draft
        </Button>
      </div>
    </div>
  );
}
