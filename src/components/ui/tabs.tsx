import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Tabs — Figma "Tabs" (node 1078:437, Prism V1 - ShadCN), built on
// @radix-ui/react-tabs for roving-tabindex keyboard nav and tablist/tab/
// tabpanel ARIA (installed this session — no Tabs primitive existed before).
//
// Two variants (Figma's own "Type"): Primary — underline indicator on the
// active tab, no background, supports an optional leading icon (Figma's own
// Icon=True/False axis). Secondary — pill/segmented background, no
// indicator, NO icon support (re-verified after a reported defect: every
// Secondary symbol in Figma is Icon=False, there is no Icon=True variant for
// Secondary at all — confirmed independently against the local Prism repo's
// own Tab.tsx, which comments "Icons only supported on Primary per DS
// spec"). `icon` on a Secondary trigger is silently ignored (dev warning).
// Sizes: Large uses --t-tab-font-* (14px/24lh); Medium/Small use
// --t-font-heading-xxsmall-* (12px/16lh) — verified via Figma variable defs,
// not assumed uniform across sizes.
//
// Vertical padding: Large/Medium use --c-tabs-padding-vertical (8px,
// component token). Small's geometry measures 6px (Primary) / 2px
// (Secondary) — no dedicated token exists for these, so they're verified raw
// constants from Figma metadata coordinates (see
// project_pending_exceptions.md). Secondary horizontal padding is
// --p-space-150 (12px, verified identical across all 3 sizes).
// -----------------------------------------------------------------------------

type TabsVariant = "primary" | "secondary"
type TabsSize = "small" | "medium" | "large"

type TabsListContextValue = { variant: TabsVariant; size: TabsSize }
const TabsListContext = React.createContext<TabsListContextValue>({
  variant: "primary",
  size: "large",
})

const Tabs = TabsPrimitive.Root

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsVariant
  size?: TabsSize
}

function TabsList({ variant = "primary", size = "large", className, ...props }: TabsListProps) {
  return (
    <TabsListContext.Provider value={{ variant, size }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn("flex items-center gap-[var(--p-space-200)]", className)}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

const TAB_FONT: Record<TabsSize, string> = {
  large: cn(
    "text-[length:var(--t-tab-font-size)]",
    "font-[number:var(--t-tab-font-weight)]",
    "leading-[var(--t-tab-font-line-height)]"
  ),
  medium: cn(
    "text-[length:var(--t-font-heading-xxsmall-size)]",
    "font-[number:var(--t-font-heading-xxsmall-weight)]",
    "leading-[var(--t-font-heading-xxsmall-line-height)]"
  ),
  small: cn(
    "text-[length:var(--t-font-heading-xxsmall-size)]",
    "font-[number:var(--t-font-heading-xxsmall-weight)]",
    "leading-[var(--t-font-heading-xxsmall-line-height)]"
  ),
}

const PRIMARY_PADDING_Y: Record<TabsSize, string> = {
  large: "py-[var(--c-tabs-padding-vertical)]",
  medium: "py-[var(--c-tabs-padding-vertical)]",
  small: "py-[6px]",
}

const SECONDARY_PADDING_Y: Record<TabsSize, string> = {
  large: "py-[4px]",
  medium: "py-[4px]",
  small: "py-[2px]",
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  icon?: PrismIconName
}

function TabsTrigger({ icon, className, children, ...props }: TabsTriggerProps) {
  const { variant, size } = React.useContext(TabsListContext)

  if (icon && variant === "secondary" && import.meta.env.DEV) {
    console.warn(
      "TabsTrigger: `icon` is ignored on variant=\"secondary\" — Figma defines no Icon=True variant for Secondary tabs (verified: every Secondary symbol is Icon=False)."
    )
  }

  // Figma icon sizes per Tab size (verified via get_variable_defs 2026-08-05):
  // Large=icon/size/024, Medium=icon/size/020, Small=icon/size/020. No 20px
  // source asset exists, so 20 renders from the 24px folder via sourceSize.
  const iconPx = size === "large" ? 24 : 20
  const iconSource: 16 | 24 | 32 | 48 | 64 = 24
  const iconNode = icon && variant === "primary" ? (
    <PrismIcon
      name={icon}
      size={iconPx}
      sourceSize={iconSource}
      decorative
      className="mr-[var(--c-tabs-gap-icon)] text-[var(--c-tabs-icon-default)] group-data-[state=active]:text-[var(--c-tabs-label-active)] group-disabled:text-[var(--c-tabs-label-disabled)]"
    />
  ) : null

  if (variant === "secondary") {
    return (
      <TabsPrimitive.Trigger
        data-slot="tabs-trigger"
        className={cn(
          "group inline-flex items-center whitespace-nowrap outline-none transition-colors",
          "rounded-[var(--p-radius-full)] px-[var(--p-space-150)]",
          SECONDARY_PADDING_Y[size],
          TAB_FONT[size],
          "text-[var(--c-tabs-label-default)]",
          "data-[state=inactive]:hover:bg-[var(--s-color-surface-muted)]",
          "data-[state=inactive]:hover:text-[var(--c-tabs-label-hover)]",
          "data-[state=active]:bg-[var(--s-color-action-neutral-active)]",
          "data-[state=active]:text-[var(--c-tabs-label-active)]",
          "disabled:pointer-events-none disabled:text-[var(--c-tabs-label-disabled)]",
          className
        )}
        {...props}
      >
        {iconNode}
        {children}
      </TabsPrimitive.Trigger>
    )
  }

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group relative inline-flex items-center whitespace-nowrap outline-none transition-colors",
        PRIMARY_PADDING_Y[size],
        TAB_FONT[size],
        "text-[var(--c-tabs-label-default)]",
        "data-[state=inactive]:hover:text-[var(--c-tabs-label-hover)]",
        "data-[state=active]:text-[var(--c-tabs-label-active)]",
        "disabled:pointer-events-none disabled:text-[var(--c-tabs-label-disabled)]",
        className
      )}
      {...props}
    >
      {iconNode}
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-[2px] rounded-[var(--p-radius-full)]",
          "bg-[var(--c-tabs-indicator-color)] opacity-0",
          "group-data-[state=active]:opacity-100"
        )}
      />
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsVariant, TabsSize }
