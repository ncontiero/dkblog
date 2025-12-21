/* eslint-disable react-refresh/only-export-components */
import type { Components } from "rehype-react";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

import { Link as LinkIcon } from "lucide-react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { Link } from "./ui/Link";

function AnchorLink({
  href,
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href!}
      className={cn("no-underline [&>code]:py-0", className)}
      style={{ fontSize: "inherit", lineHeight: "inherit" }}
      {...props}
    >
      {children}
    </Link>
  );
}

interface HeadingLinkedProps extends HTMLAttributes<HTMLHeadingElement> {
  readonly as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

function HeadingLinked({
  id,
  as = "h1",
  children,
  ...props
}: HeadingLinkedProps) {
  const Comp = as;
  const childrenHasAnchor = children && typeof children === "object";
  const className = `
    group ring-offset-background focus-visible:ring-ring flex w-fit items-center rounded-md no-underline
    underline-offset-4 duration-200 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2
    focus-visible:outline-hidden active:opacity-70
  `;

  return id && !childrenHasAnchor ? (
    <Comp id={id} {...props}>
      <NextLink
        href={`#${id}`}
        aria-label="Link to section"
        className={className}
      >
        {children}
        <LinkIcon
          size={20}
          className="ml-2 opacity-20 duration-200 group-hover:opacity-70"
        />
      </NextLink>
    </Comp>
  ) : (
    <Comp id={id} className={className} {...props}>
      {children}
    </Comp>
  );
}

export const MdComponents: Components = {
  h1: ({ className, ...props }) => (
    <HeadingLinked
      className={cn(
        "relative mt-2 w-full scroll-m-20 text-4xl font-bold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <HeadingLinked
      as="h2"
      className={cn(
        "mt-10 w-full scroll-m-20 border-b border-b-zinc-500 pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <HeadingLinked
      as="h3"
      className={cn(
        "mt-8 w-full scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <HeadingLinked
      as="h4"
      className={cn(
        "mt-8 w-full scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <HeadingLinked
      as="h5"
      className={cn(
        "mt-8 w-full scroll-m-20 text-lg font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <HeadingLinked
      as="h6"
      className={cn(
        "mt-8 w-full scroll-m-20 text-base font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  a: (props) => <AnchorLink {...props} />,
  p: ({ className, ...props }) => (
    <p className={cn("leading-7 not-first:mt-6", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 list-disc pl-8", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 list-decimal pl-8", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li
      className={cn("marker:text-muted-foreground my-1", className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        `text-foreground/70 *:text-foreground/70 mt-6 border-l-2 border-zinc-400 pl-3 font-normal dark:border-zinc-600`,
        className,
      )}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }) => (
    // eslint-disable-next-line nextjs/no-img-element
    <img
      className={cn(
        "border-border shadow-border mx-auto my-0 w-full rounded-md border shadow-xl",
        className,
      )}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ ...props }) => (
    <hr className="my-4 border-zinc-400 md:my-8" {...props} />
  ),
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn(
        "m-0 border-t border-zinc-300 p-0 even:bg-zinc-100",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border border-zinc-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border border-zinc-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "bg-background my-4 overflow-x-auto rounded-lg px-0 py-4",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "bg-secondary-foreground/10 relative rounded-sm px-1.5 py-1 font-mono",
        className,
      )}
      {...props}
    />
  ),
};
