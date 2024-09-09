import * as prod from "react/jsx-runtime";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { MdComponents } from "@/components/MdComponents";

const production = {
  Fragment: prod.Fragment,
  jsx: prod.jsx,
  jsxs: prod.jsxs,
  components: MdComponents,
};

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "min-light", dark: "dracula" },
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
    .use(rehypePrettyCode, { ...prettyCodeOptions, getHighlighter })
    .use(rehypeStringify)
    // @ts-expect-error: the react types are missing.
    .use(rehypeReact, production)
    .process(content);
}
