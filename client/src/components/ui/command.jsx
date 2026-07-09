import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = ({ className, ...props }) => (
  <CommandPrimitive
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
);

const CommandDialog = ({ children, ...props }) => (
  <Dialog {...props}>
    <DialogContent className="max-w-xl overflow-hidden p-0" showClose={false}>
      <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
        {children}
      </Command>
    </DialogContent>
  </Dialog>
);

const CommandInput = ({ className, ...props }) => (
  <div className="flex items-center gap-2 border-b border-border px-4" cmdk-input-wrapper="">
    <Search className="size-4 shrink-0 text-muted-foreground" />
    <CommandPrimitive.Input
      className={cn(
        "flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
);

const CommandList = ({ className, ...props }) => (
  <CommandPrimitive.List
    className={cn("max-h-80 overflow-x-hidden overflow-y-auto p-1.5", className)}
    {...props}
  />
);

const CommandEmpty = (props) => (
  <CommandPrimitive.Empty className="py-8 text-center text-sm text-muted-foreground" {...props} />
);

const CommandGroup = ({ className, ...props }) => (
  <CommandPrimitive.Group
    className={cn("overflow-hidden p-1 text-foreground", className)}
    {...props}
  />
);

const CommandSeparator = ({ className, ...props }) => (
  <CommandPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
);

const CommandItem = ({ className, ...props }) => (
  <CommandPrimitive.Item
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none",
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className
    )}
    {...props}
  />
);

const CommandShortcut = ({ className, ...props }) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
    {...props}
  />
);

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
