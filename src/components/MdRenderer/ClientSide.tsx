"use client";

import { Fragment, createElement, useEffect, useState } from "react";
import { setCDN } from "shiki";
import { processMd } from "@/utils/processMd";

import { Skeleton } from "../ui/Skeleton";

export function MdRendererClient({ content }: { content: string }) {
  const [loading, setLoading] = useState(true);
  const [Content, setContent] = useState(createElement(Fragment));

  setCDN("/shiki");

  useEffect(() => {
    const processContent = async () => {
      setContent((await processMd({ content })).result);
    };
    processContent()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [content]);

  return loading ? (
    <div className="mt-8 flex flex-col gap-4">
      <Skeleton className="h-8 w-full bg-background dark:bg-background/30" />
      <Skeleton className="h-8 w-2/3 bg-background dark:bg-background/30" />
      <Skeleton className="h-8 w-3/4 bg-background dark:bg-background/30" />
    </div>
  ) : (
    <div className="prose prose-quoteless w-full pl-1 pt-7 dark:prose-invert">
      {Content}
    </div>
  );
}
