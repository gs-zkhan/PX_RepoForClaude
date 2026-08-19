import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full outline-none transition-colors",
        "size-[var(--c-radio-size)]",
        "border border-[var(--c-radio-border-default)]",
        "bg-white",
        "hover:border-[var(--c-radio-border-hover)]",
        "focus-visible:ring-[length:var(--c-radio-focus-ring-width)]",
        "focus-visible:ring-[var(--c-radio-focus-ring-color)]",
        "data-[state=checked]:border-[var(--c-radio-indicator-selected)]",
        "disabled:cursor-not-allowed",
        "disabled:border-[var(--c-radio-border-disabled)]",
        "disabled:bg-[var(--c-radio-background-disabled)]",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span
          className={cn(
            "block rounded-full",
            "size-2",
            "bg-[var(--c-radio-indicator-selected)]",
            "group-disabled:bg-[var(--c-radio-indicator-disabled)]"
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
