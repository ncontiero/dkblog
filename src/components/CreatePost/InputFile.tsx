import type { EditValuesProps } from "./types";
import { type ChangeEvent, useCallback } from "react";
import { InputFile as InputFilePrimitive } from "../ui/InputFile";

interface InputFileProps {
  readonly setImgPreview: (img: string) => void;
  readonly editValues: EditValuesProps;
  readonly setEditValues: (values: EditValuesProps) => void;
}

export function InputFile({
  setImgPreview,
  editValues,
  setEditValues,
}: InputFileProps) {
  const handleImage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]?.type.startsWith("image/")) {
        setImgPreview(URL.createObjectURL(e.target.files[0]));
        setEditValues({
          ...editValues,
          image: e.target.files[0],
        });
      }
    },
    [editValues, setEditValues, setImgPreview],
  );

  return (
    <InputFilePrimitive
      variant="outlinePrimary"
      className="bg-secondary py-4 text-foreground focus-within:bg-primary focus-within:text-primary-foreground sm:py-6 sm:text-base"
      id="cover-image"
      accept="image/*"
      onChange={handleImage}
      tooltipContent={
        <>
          <p className="text-sm">Only images are allowed.</p>
          <p className="text-sm">Maximum file size is 5MB.</p>
          <p className="text-sm">Use a ration of 1000:420 for best results.</p>
        </>
      }
    />
  );
}
