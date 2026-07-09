import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = ({ className, ...props }) => (
  <AvatarPrimitive.Root
    data-slot="avatar"
    className={cn(
      "relative flex size-9 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
);

const AvatarImage = ({ className, ...props }) => (
  <AvatarPrimitive.Image
    data-slot="avatar-image"
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
);

const AvatarFallback = ({ className, ...props }) => (
  <AvatarPrimitive.Fallback
    data-slot="avatar-fallback"
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-medium text-white",
      className
    )}
    {...props}
  />
);

export { Avatar, AvatarImage, AvatarFallback };
