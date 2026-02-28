import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

export const Input = React.forwardRef(({ className, type, ...p }, r) => (
  <input type={type} ref={r}
    className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...p} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, ...p }, r) => (
  <textarea ref={r}
    className={cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...p} />
));
Textarea.displayName = "Textarea";

export const Label = React.forwardRef(({ className, ...p }, r) => (
  <label ref={r} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...p} />
));
Label.displayName = "Label";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:   "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:     "text-foreground",
        success:     "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        warning:     "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
export const Badge = ({ className, variant, ...p }) => <div className={cn(badgeVariants({ variant }), className)} {...p} />;

export const Progress = React.forwardRef(({ className, value, ...p }, r) => (
  <ProgressPrimitive.Root ref={r} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)} {...p}>
    <ProgressPrimitive.Indicator className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...p }, r) => (
  <div ref={r} role={decorative ? "none" : "separator"} aria-orientation={orientation === "horizontal" ? undefined : "vertical"}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)} {...p} />
));
Separator.displayName = "Separator";
