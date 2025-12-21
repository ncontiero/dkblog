import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const inputFileVariants = cva(
  `
    ring-offset-background inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium
    duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-hidden disabled:pointer-events-none
    disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground focus-within:ring-ring hover:bg-primary/90 dark:hover:bg-primary/80",
        destructive:
          "bg-destructive text-primary-foreground focus-within:ring-destructive hover:bg-destructive/80",
        outline:
          "border-input bg-background focus-within:ring-ring hover:bg-accent hover:text-accent-foreground border",
        outlinePrimary:
          "border-primary bg-background focus-within:ring-ring hover:bg-primary hover:text-primary-foreground border",
        secondary: `
          bg-secondary text-secondary-foreground focus-within:ring-ring hover:bg-secondary/60 dark:hover:bg-secondary/80
        `,
        ghost:
          "focus-within:ring-ring hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface InputFileProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly variant?: VariantProps<typeof inputFileVariants>["variant"];
  readonly btnSize?: VariantProps<typeof inputFileVariants>["size"];
  readonly labelText?: string;
  readonly tooltipContent?: ReactNode;
}

export const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  (
    {
      className,
      variant,
      btnSize,
      labelText = "Add a cover image",
      id,
      tooltipContent,
      ...props
    },
    ref,
  ) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={btnSize}
              className={cn(inputFileVariants({ variant, className }))}
              asChild
            >
              <label htmlFor={id}>
                <input
                  type="file"
                  className="w-[0px]"
                  id={id}
                  ref={ref}
                  {...props}
                />
                {labelText}
              </label>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
InputFile.displayName = "InputFile";
