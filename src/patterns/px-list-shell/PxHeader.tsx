import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type {
  PxHeaderAction,
  PxHeaderProps,
  PxHeaderTab,
  PxHeaderUtility,
} from "./types"

// -----------------------------------------------------------------------------
// PxHeader — two-bar top page header, 96px total (48 + 48).
//
// Figma source: node 3225:2505 (PX Header component in Prism V1 - ShadCN).
// Rules extracted from Figma AI-instructions frame 4214:28076, cross-checked
// against the actual instance's child x/y positions (node 3225:2357) since
// the prose spec disagreed with the real measurements in two places (button
// gap, tab gap) — the measured instance is treated as ground truth:
// - Primary bar is mandatory. Secondary bar is optional (~80% of screens).
// - Fill: color/surface/default. Effect: shadow-100.
// - Bottom border on each bar: 1px color/line/default, INSIDE stroke.
// - Padding L/R: space/300 (24px). Each bar: 48px tall.
// - Primary RHS: message icon → App Switcher → Avatar, uniform space/300
//   (24px) gap measured between every item (not space/100 for the icons).
// - Secondary RHS: icon buttons · divider · pill buttons — uniform space/200
//   (16px) gap measured throughout, including button-to-button (the prose
//   spec said space/100 there; the actual instance measures 16px).
// - Tabs: uniform space/200 (16px) gap between tab instances (the prose
//   spec said 24px minimum; the actual instance measures 16px).
//
// The header is a composition-only component — it does not own the visual
// recipes of Button, IconButton, PrismIcon, or Avatar (all delegated).
//
// Secondary Bar anatomy update — Figma replaced the LHS/Tabs/RHS frames with
// three "TableSecHeader" component sets (nodes 9452:13655 LHS, 9452:13691
// Center, 9452:13699 RHS), still on the same Page Header page:
// - LHS: property1=BackArrow (back arrow + title-as-field + edit + chip) or
//   SecTitle (bold title + edit, no back arrow) — driven here by whether
//   `onBack` is passed, same as before.
// - Center: unchanged — the existing Tabs strip already matches.
// - RHS: unchanged — utilities + divider + actions already matches
//   Button+Icon/Only Button/Empty.
// The one real behavior change: title now supports inline editing — clicking
// the edit pencil swaps the static title for an `<Input inline>` (see
// isEditingTitle below), matching TableSecHeader's editable title-field look.
// -----------------------------------------------------------------------------

function PxHeader({
  moduleName,
  primaryCenter,
  primaryUtilities,
  avatar,
  showSecondary,
  onBack,
  title,
  onEditTitle,
  titleChip,
  tabs,
  activeTabId,
  onTabChange,
  secondaryUtilities,
  secondaryActions,
}: PxHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  // Only meaningful while isEditingTitle is true — always reseeded fresh in
  // startEditingTitle, so it doesn't need to track `title` while at rest.
  const [draftTitle, setDraftTitle] = React.useState(title ?? "")

  function startEditingTitle() {
    setDraftTitle(title ?? "")
    setIsEditingTitle(true)
  }

  function commitTitleEdit() {
    setIsEditingTitle(false)
    onEditTitle?.(draftTitle)
  }

  function cancelTitleEdit() {
    setIsEditingTitle(false)
    setDraftTitle(title ?? "")
  }

  const hasSecondaryContent =
    onBack !== undefined ||
    title !== undefined ||
    onEditTitle !== undefined ||
    titleChip !== undefined ||
    (tabs && tabs.length > 0) ||
    (secondaryUtilities && secondaryUtilities.length > 0) ||
    (secondaryActions && secondaryActions.length > 0)

  const renderSecondary = showSecondary ?? hasSecondaryContent

  return (
    <header
      role="banner"
      className={cn(
        "shrink-0 bg-[var(--s-color-surface-default)]",
        "shadow-[var(--e-shadow-100)]",
      )}
    >
      {/* Primary Bar --------------------------------------------------------- */}
      <div
        className={cn(
          "relative flex h-12 items-center",
          "border-b border-[var(--s-color-line-default)]",
          "px-[var(--p-space-300)]",
        )}
      >
        {/* LHS: Module Name — font.heading.medium (SemiBold 18/24) */}
        <h1
          className={cn(
            "shrink-0",
            "text-[length:var(--t-font-heading-medium-size)]",
            "font-[number:var(--t-font-heading-medium-weight)]",
            "leading-[var(--t-font-heading-medium-line-height)]",
            "text-[var(--s-color-text-default)]",
          )}
        >
          {moduleName}
        </h1>

        {/*
          Center: PEC slot — absolutely centered on the full bar width so its
          position never shifts with Module Name or RHS width (a flex-1
          space-between center would drift depending on sibling widths).
        */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-center">
          <div className="pointer-events-auto">{primaryCenter}</div>
        </div>

        {/* RHS: utilities + avatar — uniform space/300 gap (measured) */}
        <div className="ml-auto flex shrink-0 items-center gap-[var(--p-space-300)]">
          {primaryUtilities && primaryUtilities.length > 0 && (
            <UtilityGroup utilities={primaryUtilities} gapClassName="gap-[var(--p-space-300)]" />
          )}
          {avatar}
        </div>
      </div>

      {/* Secondary Bar ------------------------------------------------------- */}
      {renderSecondary && (
        <div
          className={cn(
            "flex h-12 items-center gap-[var(--p-space-200)]",
            "border-b border-[var(--s-color-line-default)]",
            "px-[var(--p-space-300)]",
          )}
        >
          {/* LHS: back + title + edit + chip */}
          <div className="flex shrink-0 items-center gap-[var(--p-space-200)]">
            {onBack && (
              <IconButton
                icon="arrow-left"
                label="Back"
                onClick={onBack}
              />
            )}

            {isEditingTitle ? (
              <Input
                autoFocus
                inline
                size="small"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitTitleEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitTitleEdit()
                  if (e.key === "Escape") cancelTitleEdit()
                }}
                aria-label="Title"
                className="w-auto"
              />
            ) : (
              title && (
                <span
                  className={cn(
                    onBack
                      ? cn(
                          "text-[length:var(--c-textfield-font-size)]",
                          "font-[number:var(--c-textfield-font-weight)]",
                          "leading-[var(--c-textfield-font-line-height)]",
                        )
                      : cn(
                          "text-[length:var(--t-font-heading-small-size)]",
                          "font-[number:var(--t-font-heading-small-weight)]",
                          "leading-[var(--t-font-heading-small-line-height)]",
                        ),
                    "text-[var(--s-color-text-default)]",
                  )}
                >
                  {title}
                </span>
              )
            )}

            {onEditTitle && !isEditingTitle && (
              <IconButton
                icon="edit"
                label="Edit title"
                onClick={startEditingTitle}
              />
            )}

            {titleChip}
          </div>

          {/* Center: tabs */}
          <div className="flex min-w-0 flex-1 items-center justify-center">
            {tabs && tabs.length > 0 && (
              <TabsStrip
                tabs={tabs}
                activeId={activeTabId}
                onChange={onTabChange}
              />
            )}
          </div>

          {/* RHS: utilities · divider · actions — uniform space/200 gap (measured) */}
          <div className="flex shrink-0 items-center gap-[var(--p-space-200)]">
            {secondaryUtilities && secondaryUtilities.length > 0 && (
              <UtilityGroup utilities={secondaryUtilities} gapClassName="gap-[var(--p-space-200)]" />
            )}

            {secondaryUtilities &&
              secondaryUtilities.length > 0 &&
              secondaryActions &&
              secondaryActions.length > 0 && (
                <span
                  aria-hidden="true"
                  className="h-5 w-px bg-[var(--s-color-line-default)]"
                />
              )}

            {secondaryActions && secondaryActions.length > 0 && (
              <ActionGroup actions={secondaryActions} />
            )}
          </div>
        </div>
      )}
    </header>
  )
}

// -----------------------------------------------------------------------------
// Internal — utility icon group. Each utility delegates to IconButton, no
// visual override applied.
// -----------------------------------------------------------------------------

function UtilityGroup({
  utilities,
  gapClassName,
}: {
  utilities: PxHeaderUtility[]
  /** Primary bar measures space/300 (24px) between icons; Secondary measures space/200 (16px). */
  gapClassName: string
}) {
  return (
    <div className={cn("flex items-center", gapClassName)}>
      {utilities.map((u) => (
        <IconButton
          key={u.id}
          icon={u.icon}
          label={u.label}
          onClick={u.onClick}
          disabled={u.disabled}
        />
      ))}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Internal — actions row. Last action defaults to primary, earlier ones to
// secondary (matches PXHeader DS rule).
// -----------------------------------------------------------------------------

function ActionGroup({ actions }: { actions: PxHeaderAction[] }) {
  const lastIndex = actions.length - 1

  return (
    // space/200 (16px) — measured button-to-button gap in the real instance
    // (the prose spec said space/100; trusting the measured instance instead).
    <div className="flex items-center gap-[var(--p-space-200)]">
      {actions.map((a, i) => {
        const variant = a.variant ?? (i === lastIndex ? "primary" : "secondary")
        return (
          <Button
            key={a.id}
            variant={variant}
            size="medium"
            onClick={a.onClick}
            disabled={a.disabled}
          >
            {a.icon && <PrismIcon name={a.icon} size={16} sourceSize={24} />}
            {a.label}
          </Button>
        )
      })}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Internal — Tabs strip. Thin wrapper around the shared `Tabs` component
// (src/components/ui/tabs.tsx), Primary variant / Large size — verified to
// match this bar's own geometry exactly: Large's --t-tab-font-* (14px/24px)
// equals the previously hand-rolled --p-font-size-h6 (also 14px/24px), and
// the 48px bar height comes from the parent row (this strip has no self-
// imposed height), so nesting the shared component here is a pure swap with
// no visual delta. Migrated off the native `<button role="tab">` now that
// the shared Tabs component exists (previously deferred — see
// project_pending_exceptions.md).
// -----------------------------------------------------------------------------

function TabsStrip({
  tabs,
  activeId,
  onChange,
}: {
  tabs: PxHeaderTab[]
  activeId?: string
  onChange?: (id: string) => void
}) {
  return (
    <Tabs value={activeId} onValueChange={onChange}>
      <TabsList variant="primary" size="large">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "ml-[var(--p-space-100)] inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5",
                  "text-[length:var(--p-font-size-h7)] leading-[var(--p-font-line-height-h7)]",
                  "font-[var(--p-font-weight-medium)]",
                  "bg-[var(--s-color-surface-sunken)] text-[var(--s-color-text-subtle)]",
                  "group-data-[state=active]:bg-[var(--s-color-surface-selected)]",
                  "group-data-[state=active]:text-[var(--s-color-text-selected)]",
                )}
              >
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { PxHeader }
