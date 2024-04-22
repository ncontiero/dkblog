import type { Tag } from "@prisma/client";

export interface EditValuesProps {
  title: string;
  description?: string;
  image?: File;
  content: string;
  tags: Tag[];
}
