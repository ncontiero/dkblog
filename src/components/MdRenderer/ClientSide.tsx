"use client";

import { Fragment, createElement, useEffect, useState } from "react";

import { setCDN } from "shiki";
import { processMd } from "@/utils/processMd";

setCDN("/");

export function MdRendererClient({ content }: { content: string }) {
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(() => {
    const processContent = async () => {
      setContent((await processMd({ content })).result);
    };
    processContent().catch(console.error);
  }, [content]);

  return (
    <div className="prose prose-quoteless w-full pl-1 pt-7 dark:prose-invert">
      {Content}
    </div>
  );
}
