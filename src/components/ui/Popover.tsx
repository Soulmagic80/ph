// Tremor Raw Popover [v0.0.1]

import * as PopoverPrimitives from "@radix-ui/react-popover"
import React from "react"

import { cx } from "@/lib/utils"

const Popover = PopoverPrimitives.Root
const PopoverTrigger = PopoverPrimitives.Trigger
const PopoverClose = PopoverPrimitives.Close

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitives.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitives.Portal>
    <PopoverPrimitives.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cx(
        // base
        "z-50 w-72 rounded-md border p-4 text-sm shadow-md outline-none",
        // border color
        "border-gray-200 dark:border-gray-800",
        // background color
        "bg-white dark:bg-gray-950",
        // text color
        "text-gray-900 dark:text-gray-50",
        // transition
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitives.Portal>
))

PopoverContent.displayName = PopoverPrimitives.Content.displayName

export { Popover, PopoverClose, PopoverContent, PopoverTrigger }
