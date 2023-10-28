import { join as pathJoin } from "path";
import * as shiki from "shiki";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";

import { processMd } from "@/utils/processMd";

const getShikiPath = (): string => {
  return pathJoin(process.cwd(), "public/shiki");
};

const getHighlighter: PrettyCodeOptions["getHighlighter"] = async (options) => {
  return await shiki.getHighlighter({
    ...(options as shiki.HighlighterOptions),
    paths: {
      languages: `${getShikiPath()}/languages/`,
      themes: `${getShikiPath()}/themes/`,
    },
  });
};

export async function MdRendererServer({ content }: { content: string }) {
  const Content = (await processMd({ content, getHighlighter })).result;

  return <div>{Content}</div>;
}
