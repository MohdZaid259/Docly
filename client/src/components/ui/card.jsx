import { cn } from "@/lib/utils";

const Card = ({ className, ...props }) => (
  <div
    data-slot="card"
    className={cn(
      "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div
    data-slot="card-header"
    className={cn("flex flex-col gap-1.5 p-5", className)}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    data-slot="card-title"
    className={cn("text-lg font-semibold leading-none", className)}
    {...props}
  />
);

const CardDescription = ({ className, ...props }) => (
  <p
    data-slot="card-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div data-slot="card-content" className={cn("p-5 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div
    data-slot="card-footer"
    className={cn("flex items-center p-5 pt-0", className)}
    {...props}
  />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
