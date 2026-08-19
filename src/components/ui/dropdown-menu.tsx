"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// Token reference (all in prism-generated.css):
// Panel:       --c-dropdown-menu-background, --c-dropdown-menu-radius,
//              --c-dropdown-menu-padding-vertical, --s-color-line-default
// Shadow:      --e-shadow-500 (NOT --p-shadow-500)
// Item bg:     --c-dropdown-menu-item-background-default/hover/selected
// Item text:   --c-dropdown-menu-item-content
// Destructive: --s-color-action-destructive-default
// Item dim:    --c-dropdown-menu-item-padding-horizontal/vertical, --c-dropdown-menu-item-gap
// Section:     --c-dropdown-menu-section-label, --c-dropdown-menu-font-size/line-height
// Divider:     --c-dropdown-menu-divider
// NOTE: --c-dropdown-* tokens belong to the form select trigger — do NOT use here

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden outline-none",
          "rounded-[var(--c-dropdown-menu-radius)]",
          "border border-[var(--s-color-line-default)]",
          "bg-[var(--c-dropdown-menu-background)]",
          "py-[var(--c-dropdown-menu-padding-vertical)]",
          "shadow-[var(--e-shadow-500)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

type DropdownMenuItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  /** Renders item text in danger red */
  destructive?: boolean
  /** Optional leading Prism icon */
  icon?: PrismIconName
  /** Optional trailing keyboard shortcut hint */
  shortcut?: string
  /** Applies selected background */
  selected?: boolean
}

function DropdownMenuItem({
  className,
  destructive = false,
  icon,
  shortcut,
  selected = false,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-selected={selected || undefined}
      className={cn(
        "relative flex cursor-default select-none items-center outline-none transition-colors",
        "gap-[var(--c-dropdown-menu-item-gap)]",
        "px-[var(--c-dropdown-menu-item-padding-horizontal)]",
        "py-[var(--c-dropdown-menu-item-padding-vertical)]",
        "text-[length:var(--c-dropdown-menu-font-size)]",
        "leading-[var(--c-dropdown-menu-font-line-height)]",
        destructive
          ? "text-[var(--s-color-action-destructive-default)]"
          : "text-[var(--c-dropdown-menu-item-content)]",
        "bg-[var(--c-dropdown-menu-item-background-default)]",
        selected && "bg-[var(--c-dropdown-menu-item-background-selected)]",
        "data-[highlighted]:bg-[var(--c-dropdown-menu-item-background-hover)]",
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {icon && <PrismIcon name={icon} size={16} />}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs opacity-60 tracking-widest">{shortcut}</span>
      )}
    </DropdownMenuPrimitive.Item>
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-[var(--c-dropdown-menu-item-padding-horizontal)]",
        "py-[var(--c-dropdown-menu-item-padding-vertical)]",
        "text-[length:var(--c-dropdown-menu-font-size)]",
        "leading-[var(--c-dropdown-menu-font-line-height)]",
        "text-[var(--c-dropdown-menu-section-label)]",
        "font-medium",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("my-1 h-px bg-[var(--c-dropdown-menu-divider)]", className)}
      {...props}
    />
  )
}

function DropdownMenuSub(props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub {...props} />
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "relative flex cursor-default select-none items-center outline-none transition-colors",
        "gap-[var(--c-dropdown-menu-item-gap)]",
        "px-[var(--c-dropdown-menu-item-padding-horizontal)]",
        "py-[var(--c-dropdown-menu-item-padding-vertical)]",
        "text-[length:var(--c-dropdown-menu-font-size)]",
        "leading-[var(--c-dropdown-menu-font-line-height)]",
        "text-[var(--c-dropdown-menu-item-content)]",
        "bg-[var(--c-dropdown-menu-item-background-default)]",
        "data-[highlighted]:bg-[var(--c-dropdown-menu-item-background-hover)]",
        "data-[state=open]:bg-[var(--c-dropdown-menu-item-background-hover)]",
        className,
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <PrismIcon name="chevron-right" size={16} decorative />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden outline-none",
          "rounded-[var(--c-dropdown-menu-radius)]",
          "border border-[var(--s-color-line-default)]",
          "bg-[var(--c-dropdown-menu-background)]",
          "py-[var(--c-dropdown-menu-padding-vertical)]",
          "shadow-[var(--e-shadow-500)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

export type { DropdownMenuItemProps }
