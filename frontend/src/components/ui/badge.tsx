import * as React from "react";
import { cn } from "@/lib/utils";

const styles = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-amber-100 text-amber-800",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border bg-background"
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof styles }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", styles[variant], className)}
      {...props}
    />
  );
}
