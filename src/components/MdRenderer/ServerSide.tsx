import { processMd } from "@/utils/processMd";

export async function MdRendererServer({
  content,
}: {
  readonly content: string;
}) {
  const Content = (await processMd({ content })).result;

  return <div>{Content}</div>;
}
