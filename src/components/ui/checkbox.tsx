import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { PrismIcon } from "@/components/ui/prism-icon"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex shrink-0 items-center justify-center outline-none transition-colors",
        "size-[var(--c-checkbox-size)]",
        "rounded-[var(--c-checkbox-radius)]",
        "border-[length:var(--c-checkbox-border-width)]",
        "border-[var(--c-checkbox-border-default)]",
        "bg-[var(--c-checkbox-background-default)]",
        "hover:border-[var(--c-checkbox-border-hover)]",
        "hover:bg-[var(--c-checkbox-background-hover)]",
        "focus-visible:ring-[length:var(--c-checkbox-focus-ring-width)]",
        "focus-visible:ring-[var(--c-checkbox-focus-ring-color)]",
        "data-[state=checked]:border-[var(--c-checkbox-background-checked)]",
        "data-[state=checked]:bg-[var(--c-checkbox-background-checked)]",
        "data-[state=indeterminate]:border-[var(--c-checkbox-background-checked)]",
        "data-[state=indeterminate]:bg-[var(--c-checkbox-background-checked)]",
        "disabled:cursor-not-allowed",
        "disabled:border-[var(--c-checkbox-border-disabled)]",
        "disabled:bg-[var(--c-checkbox-background-disabled)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
      >
        {props.checked === "indeterminate" ? (
          <PrismIcon
            name="remove"
            size={16}
            className="text-[var(--c-checkbox-icon-indeterminate)]"
          />
        ) : (
          <PrismIcon
            name="tick"
            size={16}
            className="text-[var(--c-checkbox-icon-checked)]"
          />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
