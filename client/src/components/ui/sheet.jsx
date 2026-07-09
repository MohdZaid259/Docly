import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = (props) => <DialogPrimitive.Root {...props} />;
const SheetTrigger = (props) => <DialogPrimitive.Trigger {...props} />;
const SheetClose = (props) => <DialogPrimitive.Close {...props} />;
const SheetPortal = (props) => <DialogPrimitive.Portal {...props} />;

const SheetOverlay = ({ className, ...props }) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
);

const sideClasses = {
  left: "inset-y-0 left-0 h-full w-3/4 max-w-xs border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  right:
    "inset-y-0 right-0 h-full w-3/4 max-w-xs border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
};

const SheetContent = ({ className, side = "left", children, ...props }) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed z-50 flex flex-col gap-4 border-border bg-card p-5 text-card-foreground shadow-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-4 right-4 rounded-lg opacity-70 outline-none transition-opacity hover:opacity-100">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
);

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-1", className)} {...props} />
);

const SheetTitle = ({ className, ...props }) => (
  <DialogPrimitive.Title className={cn("text-base font-semibold", className)} {...props} />
);

const SheetDescription = ({ className, ...props }) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};
