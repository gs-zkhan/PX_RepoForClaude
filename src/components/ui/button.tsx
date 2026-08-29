import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap outline-none",
    "transition-colors",
    "text-[length:var(--c-button-font-size)] font-[var(--c-button-font-weight)] leading-[var(--c-button-font-line-height)]",
    "gap-[var(--c-button-gap-small)]",
    "focus-visible:shadow-[var(--e-shadow-focus)]",
    "disabled:pointer-events-none",
    "disabled:bg-[var(--c-button-disabled-background)]",
    "disabled:text-[var(--c-button-disabled-content)]",
    "disabled:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--c-button-primary-background-default)]",
          "text-[var(--c-button-primary-content-default)]",
          "hover:shadow-[var(--e-shadow-button-hover)]",
          "active:bg-[var(--c-button-primary-background-click)]",
        ].join(" "),

        secondary: [
          "border border-[var(--c-button-secondary-border-default)]",
          "bg-[var(--c-button-secondary-background-default)]",
          "text-[var(--c-button-secondary-content-default)]",
          "hover:bg-[var(--c-button-secondary-background-hover)]",
          "hover:border-[var(--c-button-secondary-border-hover)]",
          "active:bg-[var(--c-button-secondary-background-click)]",
          "active:border-[var(--c-button-secondary-border-click)]",
          "disabled:border-[var(--c-button-disabled-border)]",
        ].join(" "),

        tertiary: [
          "bg-[var(--c-button-tertiary-background-default)]",
          "text-[var(--c-button-tertiary-content-default)]",
          "hover:bg-[var(--c-button-tertiary-background-hover)]",
          "active:bg-[var(--c-button-tertiary-background-click)]",
        ].join(" "),

        destructive: [
          "bg-[var(--c-button-destructive-background-default)]",
          "text-[var(--c-button-destructive-content-default)]",
          "hover:shadow-[var(--e-shadow-button-hover)]",
          "active:bg-[var(--c-button-destructive-background-click)]",
        ].join(" "),

        // Figma "Type=Bulk Action" (Button page, node 20:10). Visually and
        // typographically distinct from every other variant — Regular
        // weight (not SemiBold), neutral background, grey border, content
        // colour that does not change per state (only background/border
        // do, same pattern as `secondary`). No special interaction model:
        // Figma's own AI Instructions describe only visual differences
        // (see button.doc.ts) — there is no multi-select/toggle behaviour
        // to infer from the "Bulk" name.
        bulkAction: [
          "font-[number:var(--p-font-weight-regular)]",
          "border border-[var(--c-button-bulk-action-border-default)]",
          "bg-[var(--c-button-bulk-action-background-default)]",
          "text-[var(--c-button-bulk-action-content-default)]",
          "hover:bg-[var(--c-button-bulk-action-background-hover)]",
          "hover:border-[var(--c-button-bulk-action-border-hover)]",
          "active:bg-[var(--c-button-bulk-action-background-click)]",
          "active:border-[var(--c-button-bulk-action-border-click)]",
          "disabled:border-[var(--c-button-bulk-action-border-disabled)]",
        ].join(" "),
      },

      size: {
        large: [
          "h-[var(--c-button-height-large)]",
          "px-[var(--c-button-padding-left-right-large)]",
          "py-[var(--c-button-padding-top-bottom-large)]",
          "gap-[var(--c-button-gap-large)]",
        ].join(" "),

        medium: [
          "h-[var(--c-button-height-medium)]",
          "px-[var(--c-button-padding-left-right-medium)]",
          "py-[var(--c-button-padding-top-bottom-medium)]",
        ].join(" "),

        small: [
          "h-[var(--c-button-height-small)]",
          "px-[var(--c-button-padding-left-right-small)]",
          "py-[var(--c-button-padding-top-bottom-small)]",
          "text-[length:var(--c-button-font-size-small)]",
          "leading-[var(--c-button-font-line-height-small)]",
        ].join(" "),
      },

      // Which corners get the pill radius. Every existing consumer omits
      // this and gets "all" (full pill, byte-for-byte the prior
      // unconditional behaviour) — additive only. Needed so SplitButton
      // (split-button.tsx) can compose two adjoining Button instances
      // that read as one pill: the action segment keeps its left corners
      // pill-shaped and squares off the right edge where the divider
      // sits, and the trigger segment does the reverse. This keeps the
      // radius decision owned by Button's own token/API rather than a
      // pattern overriding it via className (see CLAUDE.md's Pattern
      // Ownership rule).
      radiusEdge: {
        all: "rounded-[var(--c-button-pill-radius)]",
        start: "rounded-l-[var(--c-button-pill-radius)] rounded-r-none",
        end: "rounded-r-[var(--c-button-pill-radius)] rounded-l-none",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "large",
      radiusEdge: "all",
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(function Button({ className, variant, size, radiusEdge, asChild = false, ...props }, ref) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, radiusEdge, className }))}
      {...props}
    />
  )
})

export { Button, buttonVariants }
