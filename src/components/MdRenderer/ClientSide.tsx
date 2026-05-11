"use client";

import {
  type ReactNode,
  createElement,
  Fragment,
  useEffect,
  useState,
} from "react";
import { processMd } from "@/utils/processMd";

import { Skeleton } from "../ui/Skeleton";

export function MdRendererClient({ content }: { readonly content: string }) {
  const [loading, setLoading] = useState(true);
  const [Content, setContent] = useState<ReactNode>(() =>
    createElement(Fragment),
  );

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
      <Skeleton className="h-8 w-full bg-background dark:bg-background/30" />
      <Skeleton className="h-8 w-2/3 bg-background dark:bg-background/30" />
      <Skeleton className="h-8 w-3/4 bg-background dark:bg-background/30" />
    </div>
  ) : (
    <div className="prose w-full pt-7 pl-1 dark:prose-invert">{Content}</div>
  );
}
