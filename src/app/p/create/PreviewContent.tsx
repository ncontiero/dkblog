"use client";

import { useState } from "react";

import { TabsContent } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";

interface PreviewValuesProps {
  title: string;
  image?: string;
  content: string;
}

export function PreviewContent() {
  const [previewValues] = useState<PreviewValuesProps>();
  const [isLoadingPreview] = useState(false);

  return (
    <TabsContent value="preview">
      {previewValues && !isLoadingPreview ? (
        <div>
          {previewValues.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewValues.image}
              alt={previewValues.title}
              className="flex aspect-[1000_/_420] items-center justify-center object-contain sm:rounded-t-md"
            />
          )}
          <div className="px-4 py-4 sm:px-16">
            <h1 className="relative mb-2 mt-4 w-full scroll-m-20 text-4xl font-bold tracking-tight">
              {previewValues.title}
            </h1>
            <div className="prose prose-quoteless pl-1 pt-7 dark:prose-invert"></div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 sm:px-16">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-3/4 bg-background dark:bg-background/30" />
            <div className="flex w-full gap-2">
              <Skeleton className="h-6 w-20 bg-background dark:bg-background/30" />
              <Skeleton className="h-6 w-20 bg-background dark:bg-background/30" />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Skeleton className="h-8 w-full bg-background dark:bg-background/30" />
            <Skeleton className="h-8 w-2/3 bg-background dark:bg-background/30" />
            <Skeleton className="h-8 w-3/4 bg-background dark:bg-background/30" />
          </div>
        </div>
      )}
    </TabsContent>
  );
}
