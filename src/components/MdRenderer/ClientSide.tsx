"use client";

import { createElement, Fragment, useEffect, useState } from "react";
import { processMd } from "@/utils/processMd";

import { Skeleton } from "../ui/Skeleton";

export function MdRendererClient({ content }: { readonly content: string }) {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react/hook-use-state
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(() => {
    const processContent = async () => {
      setContent((await processMd({ content })).result);
    };
    processContent()
      .then(() => setLoading(false))
      .catch(console.error);
    return () => {
      setContent(createElement(Fragment));
    };
  }, [content]);

  return loading ? (
    <div className="mt-8 flex flex-col gap-4">
      <Skeleton className="bg-background h-8 w-full dark:bg-background/30" />
      <Skeleton className="bg-background h-8 w-2/3 dark:bg-background/30" />
      <Skeleton className="bg-background h-8 w-3/4 dark:bg-background/30" />
    </div>
  ) : (
    <div className="prose prose-quoteless dark:prose-invert w-full pt-7 pl-1">
      {Content}
    </div>
  );
}
