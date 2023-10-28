import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";

import { MdComponents } from "@/components/MdComponents";

const production = {
  // @ts-expect-error: the react types are missing.
  Fragment: prod.Fragment,
  // @ts-expect-error: the react types are missing.
  jsx: prod.jsx,
  // @ts-expect-error: the react types are missing.
  jsxs: prod.jsxs,
  components: MdComponents,
};

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "rose-pine-dawn", dark: "dracula" },
  keepBackground: false,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = ["line--highlighted"];
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word--highlighted"];
  },
};

interface ProcessMd {
  content: string;
  getHighlighter?: PrettyCodeOptions["getHighlighter"];
}

export async function processMd({ content, getHighlighter }: ProcessMd) {
  return await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .use(rehypePrettyCode, { ...prettyCodeOptions, getHighlighter })
    .use(rehypeStringify)
    .use(rehypeReact, production)
    .process(content);
}
