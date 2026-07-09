import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        success:
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        warning:
          "border-amber-400/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
        destructive:
          "border-transparent bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Badge = ({ className, variant, ...props }) => (
  <span
    data-slot="badge"
    className={cn(badgeVariants({ variant, className }))}
    {...props}
  />
);

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
