import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = ({ className, ...props }) => (
  <TabsPrimitive.Root className={cn("flex flex-col gap-3", className)} {...props} />
);

const TabsList = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn(
      "inline-flex w-fit items-center gap-1 rounded-xl bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }) => (
  <TabsPrimitive.Content className={cn("outline-none", className)} {...props} />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
