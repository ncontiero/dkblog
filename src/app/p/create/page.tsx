"use client";

import "../mdx.css";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { MdRenderer } from "@/components/MdRenderer";
import { LoadingPreview } from "./LoadingPreview";

interface EditValuesProps {
  title: string;
  image?: File;
  content: string;
}

export default function CreatePostPage() {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [imgPreview, setImgPreview] = useState<string | undefined>("");
  const [editValues, setEditValues] = useState<EditValuesProps>({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.minHeight = 560 + "px";
    }
  }, []);

  return (
    <>
      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2 rounded-none sm:rounded-md">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <ScrollArea className="z-10 mt-2 h-screen w-full bg-secondary sm:h-[calc(100vh-64px-88px)] sm:rounded-md">
          <TabsContent value="edit">
            <>
              <div className="px-4 py-4 sm:px-16">
                <div className="mb-6">
                  <Button
                    variant="outlinePrimary"
                    className="cursor-pointer bg-secondary py-4 ring-offset-background focus-within:bg-primary focus-within:text-primary-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 sm:py-6 sm:text-base"
                    asChild
                  >
                    <label htmlFor="cover-image">
                      <input
                        type="file"
                        id="cover-image"
                        className="w-[0px]"
                        accept="image/*"
                        onChange={(e) => {
                          if (
                            e.target.files &&
                            e.target.files[0].type.startsWith("image/")
                          ) {
                            setImgPreview(
                              URL.createObjectURL(e.target.files[0]),
                            );
                            setEditValues({
                              ...editValues,
                              image: e.target.files[0],
                            });
                          }
                        }}
                      />
                      Add a cover image
                    </label>
                  </Button>
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
          <TabsContent value="preview">
            {editValues.content !== "" && editValues.title !== "" ? (
              <div className="w-full">
                {imgPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imgPreview}
                    alt={editValues.title}
                    className="-mt-2.5 flex aspect-[1000_/_420] items-center justify-center object-contain sm:rounded-t-md"
                  />
                )}
                <div className="w-full px-4 py-4 sm:px-16">
                  <h1 className="relative mb-2 mt-4 w-full scroll-m-20 text-4xl font-bold tracking-tight">
                    {editValues.title}
                  </h1>
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
        <Button>Publish</Button>
        <Button variant="ghost">Save draft</Button>
      </div>
    </>
  );
}
