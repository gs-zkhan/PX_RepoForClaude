import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

function Select(
  props: React.ComponentProps<typeof SelectPrimitive.Root>
) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup(
  props: React.ComponentProps<typeof SelectPrimitive.Group>
) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(
  props: React.ComponentProps<typeof SelectPrimitive.Value>
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

type SelectTriggerSize = "large" | "small"

const dropdownHeight: Record<SelectTriggerSize, string> = {
  large: "h-[var(--c-dropdown-height-large)]", // 32px — DEFAULT
  small: "h-[var(--c-dropdown-height-small)]", // 28px — compact toolbar filters / side panel rows only
}

const dropdownPaddingVertical: Record<SelectTriggerSize, string> = {
  large: "py-[var(--c-dropdown-padding-vertical-large)]",
  small: "py-[var(--c-dropdown-padding-vertical-small)]",
}

function SelectTrigger({
  className,
  children,
  size = "large",
  success = false,
  inline = false,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** Large (32px, DEFAULT) or Small (28px, compact toolbar/side-panel filters only). */
  size?: SelectTriggerSize
  /** Success state — sets border to --c-dropdown-border-success. */
  success?: boolean
  /** Inline=True/False (Figma boolean property) — no border/background until Hover/Type/Open/Error. */
  inline?: boolean
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-state-success={success ? "true" : undefined}
      className={cn(
        "group flex w-full items-center justify-between border outline-none transition-colors",
        dropdownHeight[size],
        "rounded-[var(--c-dropdown-radius)]",
        "border-[length:var(--c-dropdown-border-width)]",
        inline ? "border-transparent" : "border-[var(--c-dropdown-border-default)]",
        inline ? "bg-transparent" : "bg-[var(--c-dropdown-background-default)]",
        "pl-[var(--c-dropdown-padding-left)]",
        "pr-[var(--c-dropdown-padding-right)]",
        dropdownPaddingVertical[size],
        "text-[length:var(--c-dropdown-font-size)]",
        "font-[var(--c-dropdown-font-weight)]",
        "leading-[var(--c-dropdown-font-line-height)]",
        "text-[var(--c-dropdown-content-value)]",
        "data-[placeholder]:font-[var(--c-dropdown-font-weight)]",
        "data-[placeholder]:text-[var(--c-dropdown-content-placeholder)]",
        "hover:border-[var(--c-dropdown-border-hover)]",
        // Open state — Radix sets data-state="open" while the panel is visible
        "data-[state=open]:border-[var(--c-dropdown-border-hover)]",
        "focus-visible:border-[var(--c-dropdown-border-focus)]",
        "focus-visible:ring-[length:var(--c-dropdown-focus-ring-width)]",
        "focus-visible:ring-[var(--c-dropdown-focus-ring-color)]",
        "data-[state-success=true]:border-[var(--c-dropdown-border-success)]",
        "aria-invalid:border-[var(--c-dropdown-border-error)]",
        "aria-invalid:text-[var(--c-dropdown-content-error)]",
        "disabled:cursor-not-allowed",
        "disabled:border-[var(--c-dropdown-border-disabled)]",
        "disabled:bg-[var(--c-dropdown-background-disabled)]",
        "disabled:text-[var(--c-dropdown-content-disabled)]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <PrismIcon
          name="chevron-down"
          size={16}
          className="text-[var(--s-icon-color-default)] group-disabled:text-[var(--s-icon-color-disabled)]"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-50 max-h-96 overflow-hidden",
          "rounded-[var(--c-dropdown-menu-radius)]",
          "border border-[var(--c-dropdown-menu-divider)]",
          "bg-[var(--c-dropdown-menu-background)]",
          "text-[length:var(--c-dropdown-menu-font-size)]",
          "font-normal",
          "leading-[var(--c-dropdown-menu-font-line-height)]",
          "text-[var(--c-dropdown-menu-item-content)]",
          "shadow-[var(--p-shadow-300)]",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "py-[var(--c-dropdown-menu-padding-vertical)]",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium",
        "text-[var(--c-dropdown-content-label)]",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  showIndicator = false,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  showIndicator?: boolean
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center",
        "px-[var(--c-dropdown-menu-item-padding-horizontal)]",
        "py-[var(--c-dropdown-menu-item-padding-vertical)]",
        "gap-[var(--c-dropdown-menu-item-gap)]",
        "bg-[var(--c-dropdown-menu-item-background-default)]",
        "text-[length:var(--c-dropdown-menu-font-size)]",
        "text-[var(--c-dropdown-menu-item-content)]",
        "outline-none",
        "focus:bg-[var(--c-dropdown-menu-item-background-hover)]",
        "data-[state=checked]:bg-[var(--c-dropdown-menu-item-background-selected)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {showIndicator && (
        <span className="flex size-4 shrink-0 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <PrismIcon name="tick" size={16} className="text-[var(--s-icon-color-selected)]" />
          </SelectPrimitive.ItemIndicator>
        </span>
      )}

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-[var(--s-color-line-default)]",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <PrismIcon name="chevron-up" size={16} className="text-[var(--s-icon-color-default)]" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <PrismIcon name="chevron-down" size={16} className="text-[var(--s-icon-color-default)]" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
