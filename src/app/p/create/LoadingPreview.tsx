import { Skeleton } from "@/components/ui/Skeleton";

export function LoadingPreview() {
  return (
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
  );
}
