import {
  type InputFileProps,
  InputFile as InputFilePrimitive,
} from "../ui/InputFile";

export function InputFile(props: InputFileProps) {
  return (
    <InputFilePrimitive
      {...props}
      variant="outlinePrimary"
      className={`
        bg-secondary text-foreground py-4 focus-within:bg-primary focus-within:text-primary-foreground sm:py-6
        sm:text-base
      `}
      id="cover-image"
      accept="image/*"
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
