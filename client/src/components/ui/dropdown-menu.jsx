import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = (props) => <DropdownMenuPrimitive.Root {...props} />;
const DropdownMenuTrigger = (props) => <DropdownMenuPrimitive.Trigger {...props} />;
const DropdownMenuGroup = (props) => <DropdownMenuPrimitive.Group {...props} />;
const DropdownMenuPortal = (props) => <DropdownMenuPrimitive.Portal {...props} />;
const DropdownMenuSub = (props) => <DropdownMenuPrimitive.Sub {...props} />;
const DropdownMenuRadioGroup = (props) => (
  <DropdownMenuPrimitive.RadioGroup {...props} />
);

const DropdownMenuContent = ({ className, sideOffset = 8, ...props }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuItem = ({ className, inset, variant = "default", ...props }) => (
  <DropdownMenuPrimitive.Item
    data-inset={inset}
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[inset]:pl-8",
      variant === "destructive" &&
        "text-destructive focus:bg-destructive/10 focus:text-destructive",
      className
    )}
    {...props}
  />
);

const DropdownMenuCheckboxItem = ({ className, children, checked, ...props }) => (
  <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-lg py-2 pr-2.5 pl-8 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);

const DropdownMenuRadioItem = ({ className, children, ...props }) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-lg py-2 pr-2.5 pl-8 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
);

const DropdownMenuLabel = ({ className, inset, ...props }) => (
  <DropdownMenuPrimitive.Label
    data-inset={inset}
    className={cn(
      "px-2.5 py-1.5 text-xs font-medium text-muted-foreground data-[inset]:pl-8",
      className
    )}
    {...props}
  />
);

const DropdownMenuSeparator = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
);

const DropdownMenuShortcut = ({ className, ...props }) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
    {...props}
  />
);

const DropdownMenuSubTrigger = ({ className, inset, children, ...props }) => (
  <DropdownMenuPrimitive.SubTrigger
    data-inset={inset}
    className={cn(
      "flex cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
);

const DropdownMenuSubContent = ({ className, ...props }) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-md",
      className
    )}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
