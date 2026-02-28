import * as React from "react";
import { cn } from "../../utils/cn";

export const Card        = React.forwardRef(({ className, ...p }, r) => <div ref={r} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...p} />);
export const CardHeader  = React.forwardRef(({ className, ...p }, r) => <div ref={r} className={cn("flex flex-col space-y-1.5 p-6", className)} {...p} />);
export const CardTitle   = React.forwardRef(({ className, ...p }, r) => <h3 ref={r} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...p} />);
export const CardDescription = React.forwardRef(({ className, ...p }, r) => <p ref={r} className={cn("text-sm text-muted-foreground", className)} {...p} />);
export const CardContent = React.forwardRef(({ className, ...p }, r) => <div ref={r} className={cn("p-6 pt-0", className)} {...p} />);
export const CardFooter  = React.forwardRef(({ className, ...p }, r) => <div ref={r} className={cn("flex items-center p-6 pt-0", className)} {...p} />);

Card.displayName = "Card"; CardHeader.displayName = "CardHeader"; CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription"; CardContent.displayName = "CardContent"; CardFooter.displayName = "CardFooter";
