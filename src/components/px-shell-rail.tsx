import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import pxNavLogoUrl from "@/assets/icons/pxnav-logo.svg"
// Raw import, not a URL: at 7.9KB this file is over Vite's 4KB
// assetsInlineLimit, so `import ... from "*.svg"` would emit it as a
// separate static asset and every rail-expand would depend on a real HTTP
// request — the exact same "sometimes invisible" flakiness fixed in
// PrismIcon. Inlining the markup directly removes that dependency entirely.
import pxNavLogoExpandedSvg from "@/assets/icons/pxnav-logo-expanded-1.svg?raw"

// -----------------------------------------------------------------------------
// PxShellRail — Left Navigation, Figma "Left Navigation" instance shared by
// Shell/NavOnly (48px, node 4191:13466), Shell/NavExpanded (240px, node
// 4191:13804), and Shell/NavAdmin (240px, node 4191:14215) — "Prism V1 -
// ShadCN" (U3D8WMBVFl9LvAZyLHhm24). Anatomy/spacing confirmed via Figma
// metadata; interaction model below (hover-flyout, pin toggle, admin entry)
// confirmed with the user directly — every color/spacing value is still a
// Shad Repo token, never a value copied from the Prism repo.
//
// Interaction model:
// - `mode` represents the PINNED state: "collapsed" (48px, default) or
//   "expanded" (240px, permanently open, reflows layout).
// - When collapsed and unpinned, hovering the rail shows a temporary 240px
//   flyout overlay (absolute-positioned, does not reflow layout) — mirrors
//   the Prism repo's intended hover-preview behavior. Moving the mouse away
//   collapses it back to 48px.
// - The pin icon toggles `mode` between collapsed/expanded. Icon swaps
//   pin-line (unpinned) <-> pin-filled (pinned).
// - Clicking Settings/Administration (from either the collapsed icon or the
//   expanded row) immediately pins the rail open AND enters Admin mode in
//   one action — it does not require expanding first.
// -----------------------------------------------------------------------------

// Item identity/order matches the real Figma "Left Navigation" layer names
// (node 4183:13270, Shell/NavOnly) exactly: Search, Dashboard, Audience
// Explorer, Accounts Explorer, Analytics, Engagements, In-App Hub, Product
// Mapper, Segments, [divider], Administration. "Validation Gallery",
// "Design System Docs", and "Audience Explorer (AI Demo)" are this app's own
// internal tooling (not part of the Figma design) — kept as extra items per
// explicit instruction, appended after the Figma-defined items and before
// the Administration divider.
export type PxShellNavKey =
  | "search"
  | "dashboard"
  | "audience"
  | "accounts"
  | "analytics"
  | "engagements"
  | "kc-bot"
  | "product-mapper"
  | "segments"
  | "validation"
  | "docs"
  | "audience-ai-demo"
  | "settings"

type PxShellNavItem = {
  key: PxShellNavKey
  icon: PrismIconName
  label: string
}

const SHELL_NAV: PxShellNavItem[] = [
  { key: "dashboard",       icon: "dashboard",           label: "Dashboard"          },
  { key: "audience",        icon: "users",               label: "Audience Explorer"  },
  { key: "accounts",        icon: "pxaccount-explorer",  label: "Accounts Explorer"  },
  { key: "analytics",       icon: "pxanalytics",         label: "Analytics"          },
  { key: "engagements",     icon: "pxengagements",       label: "Engagements"        },
  { key: "kc-bot",          icon: "pxkcbot",             label: "In-App Hub"         },
  { key: "product-mapper",  icon: "pxproduct-mapper",    label: "Product Mapper"     },
  { key: "segments",        icon: "pxsegments",          label: "Segments"           },
  { key: "validation",      icon: "blocks",              label: "Validation Gallery" },
  { key: "docs",            icon: "document",            label: "Design System Docs" },
  { key: "audience-ai-demo", icon: "ai/primary",         label: "Audience Explorer (AI Demo)" },
]

const SEARCH_ITEM: PxShellNavItem = { key: "search", icon: "search", label: "Search" }
const SETTINGS_ITEM: PxShellNavItem = { key: "settings", icon: "settings", label: "Administration" }

// Single source of truth for nav item labels — pages must use this (not a
// hand-typed string) as their PxHeader `moduleName` so the two never drift.
const PX_NAV_LABELS = Object.fromEntries(
  [SEARCH_ITEM, ...SHELL_NAV, SETTINGS_ITEM].map((item) => [item.key, item.label]),
) as Record<PxShellNavKey, string>

export type PxNavAdminSectionItem = { id: string; label: string }
export type PxNavAdminSection = {
  id: string
  title: string
  items: PxNavAdminSectionItem[]
}

// Reference/demo data — mirrors the exact anatomy extracted from Figma node
// 4191:13955 (Left Navigation, Admin mode). Real screens should pass their
// own sections via the `adminSections` prop.
const DEFAULT_ADMIN_SECTIONS: PxNavAdminSection[] = [
  {
    id: "set-up",
    title: "Set Up",
    items: [
      { id: "company-timezone", label: "Company & Timezone" },
      { id: "products", label: "Products" },
      { id: "user-management", label: "User Management" },
      { id: "account-settings", label: "Account Settings" },
      { id: "attributes", label: "Attributes" },
      { id: "events", label: "Events" },
      { id: "session-recording", label: "Session Recording" },
      { id: "brand-settings", label: "Brand Settings" },
      { id: "sdk-settings", label: "SDK Settings" },
      { id: "localization", label: "Localization" },
    ],
  },
  {
    id: "monitoring",
    title: "Monitoring",
    items: [{ id: "admin-console", label: "Admin Console" }],
  },
  {
    id: "integrations-section",
    title: "Integrations",
    items: [
      { id: "integrations", label: "Integrations" },
      { id: "rest-api", label: "REST API" },
      { id: "webhooks", label: "Webhooks" },
    ],
  },
  {
    id: "bulk-data-export",
    title: "Bulk Data Export",
    items: [{ id: "data-exports", label: "Data Exports" }],
  },
  {
    id: "engagement",
    title: "Engagement",
    items: [
      { id: "throttling", label: "Throttling" },
      { id: "feedback", label: "Feedback" },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [
      { id: "sso-saml", label: "SSO / SAML" },
      { id: "identity-verification", label: "Identity Verification" },
      { id: "checksum", label: "Checksum" },
      { id: "engagements-security", label: "Engagements" },
    ],
  },
]

export type PxShellRailMode = "collapsed" | "expanded"

type PxShellRailProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  /**
   * Pinned state: Collapsed = 48px (DEFAULT). Expanded = 240px, permanently
   * open. Optional — when omitted, the rail manages pin state internally
   * (so the pin toggle and Administration entry work even if the consuming
   * page doesn't wire up mode state, e.g. App.tsx's default route).
   */
  mode?: PxShellRailMode
  onModeChange?: (mode: PxShellRailMode) => void
  onSearchClick?: () => void
  /** Sub-menu content shown when Settings/Administration is entered. */
  adminSections?: PxNavAdminSection[]
  onAdminItemSelect?: (itemId: string) => void
}

function PxShellRail({
  activeKey,
  onNavigate,
  mode: modeProp,
  onModeChange,
  onSearchClick,
  adminSections = DEFAULT_ADMIN_SECTIONS,
  onAdminItemSelect,
}: PxShellRailProps) {
  const isModeControlled = modeProp !== undefined
  const [internalMode, setInternalMode] = React.useState<PxShellRailMode>("collapsed")
  const mode = isModeControlled ? modeProp : internalMode

  function setMode(next: PxShellRailMode) {
    if (!isModeControlled) setInternalMode(next)
    onModeChange?.(next)
  }

  const pinned = mode === "expanded"
  const [hovering, setHovering] = React.useState(false)
  const [adminMode, setAdminMode] = React.useState(false)
  const [openSections, setOpenSections] = React.useState<Set<string>>(
    () => new Set(adminSections.map((s) => s.id)), // Figma: sections start Open by default
  )
  const [activeAdminItem, setActiveAdminItem] = React.useState<string | null>(null)

  const showExpanded = pinned || hovering
  const isFlyout = showExpanded && !pinned

  function handleMouseEnter() {
    if (!pinned) setHovering(true)
  }

  function handleMouseLeave() {
    if (!pinned) setHovering(false)
  }

  function togglePin() {
    setMode(pinned ? "collapsed" : "expanded")
  }

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Clicking Settings/Administration always pins the rail open AND enters
  // Admin mode in one action, whether triggered from the collapsed icon or
  // the expanded row.
  function handleAdminEntry() {
    setMode("expanded")
    setAdminMode(true)
    onNavigate("settings")
  }

  function handleAdminBack() {
    setAdminMode(false)
  }

  function handleAdminItemSelect(id: string) {
    setActiveAdminItem(id)
    onAdminItemSelect?.(id)
  }

  function handleSearch() {
    onNavigate("search")
    onSearchClick?.()
  }

  const expandedBody = (
    <ExpandedBody
      activeKey={activeKey}
      onNavigate={onNavigate}
      pinned={pinned}
      onTogglePin={togglePin}
      onSearch={handleSearch}
      adminMode={adminMode}
      onAdminEntry={handleAdminEntry}
      onAdminBack={handleAdminBack}
      adminSections={adminSections}
      openSections={openSections}
      onToggleSection={toggleSection}
      activeAdminItem={activeAdminItem}
      onAdminItemSelect={handleAdminItemSelect}
    />
  )

  return (
    <div
      className={cn(
        "relative flex shrink-0 transition-[width] duration-200 ease-in-out",
        // Clip during the pinned reflow transition so the width animates
        // smoothly. Must stay visible for the hover flyout, which
        // intentionally overflows the 48px collapsed box.
        !isFlyout && "overflow-hidden",
      )}
      style={{ width: pinned ? 240 : 48 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {pinned ? (
        // Pinned: a normal flex child at 240px — reflows surrounding layout.
        <nav
          aria-label="Product navigation"
          className="flex h-full w-[240px] flex-col bg-[var(--c-nav-background)]"
        >
          {expandedBody}
        </nav>
      ) : (
        <>
          {/* Base collapsed rail — always in normal flow. Its real content
              height (11 rows) is what gives the wrapper div a resolvable
              height, which the flyout overlay below depends on. */}
          <nav
            aria-label="Product navigation"
            aria-hidden={isFlyout || undefined}
            className="flex h-full w-12 flex-col items-center bg-[var(--c-nav-background)]"
          >
            <CollapsedBody
              activeKey={activeKey}
              onNavigate={onNavigate}
              onSearch={handleSearch}
              onAdminEntry={handleAdminEntry}
              onExpand={() => setMode("expanded")}
            />
          </nav>

          {/* Hover flyout — overlays on top, never reflows layout. */}
          {isFlyout && (
            <nav
              aria-label="Product navigation"
              className={cn(
                "absolute inset-0 z-50 flex w-[240px] flex-col",
                "bg-[var(--c-nav-background)] shadow-[var(--e-shadow-400)]",
              )}
            >
              {expandedBody}
            </nav>
          )}
        </>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Collapsed body — 48×48 rows, icon centered (12px inset all sides =
// nav/padding/item). Active state: 4px left indicator (nav/indicator/width)
// + translucent white fill (nav/item/active/background at 12% opacity,
// approximated since Figma's token carries no alpha).
// -----------------------------------------------------------------------------

function CollapsedBody({
  activeKey,
  onNavigate,
  onSearch,
  onAdminEntry,
  onExpand,
}: {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  onSearch: () => void
  onAdminEntry: () => void
  onExpand: () => void
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Expand navigation"
        onClick={onExpand}
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded outline-none",
          "focus-visible:shadow-[var(--e-shadow-focus)]",
        )}
      >
        <img src={pxNavLogoUrl} alt="Gainsight PX" className="h-6 w-6" />
      </button>

      {[SEARCH_ITEM, ...SHELL_NAV].map((item) => (
        <CollapsedNavButton
          key={item.key}
          item={item}
          active={item.key === activeKey}
          onClick={() => (item.key === "search" ? onSearch() : onNavigate(item.key))}
        />
      ))}

      <div className="border-t border-[var(--c-nav-item-divider)] py-[var(--c-nav-padding-item)]">
        <CollapsedNavButton
          item={SETTINGS_ITEM}
          active={activeKey === "settings"}
          onClick={onAdminEntry}
        />
      </div>
    </>
  )
}

function CollapsedNavButton({
  item,
  active,
  onClick,
}: {
  item: PxShellNavItem
  active: boolean
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          onClick={onClick}
          className={cn(
            "relative flex size-12 items-center justify-center outline-none transition-colors",
            "text-[var(--c-nav-item-content-subtle)]",
            "hover:bg-[color:var(--c-nav-item-active-background)]/12 hover:text-[var(--c-nav-item-content)]",
            "focus-visible:shadow-[var(--e-shadow-focus)]",
            active && "bg-[color:var(--c-nav-item-active-background)]/12 text-[var(--c-nav-item-content)]",
          )}
        >
          {active && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 bg-[var(--c-nav-item-indicator)]"
              style={{ width: "var(--c-nav-indicator-width)" }}
            />
          )}
          <PrismIcon name={item.icon} size={24} className="text-[var(--c-nav-item-content)]" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

// -----------------------------------------------------------------------------
// Expanded body — used both for the permanently pinned 240px nav and the
// temporary hover-flyout overlay. Header row (wordmark + pin toggle) →
// Search trigger row → main items, or Admin sections when adminMode is set.
// -----------------------------------------------------------------------------

function ExpandedBody({
  activeKey,
  onNavigate,
  pinned,
  onTogglePin,
  onSearch,
  adminMode,
  onAdminEntry,
  onAdminBack,
  adminSections,
  openSections,
  onToggleSection,
  activeAdminItem,
  onAdminItemSelect,
}: {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  pinned: boolean
  onTogglePin: () => void
  onSearch: () => void
  adminMode: boolean
  onAdminEntry: () => void
  onAdminBack: () => void
  adminSections: PxNavAdminSection[]
  openSections: Set<string>
  onToggleSection: (id: string) => void
  activeAdminItem: string | null
  onAdminItemSelect: (id: string) => void
}) {
  return (
    <>
      {/* Header: wordmark + pin toggle ------------------------------------ */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--c-nav-item-divider)] px-[var(--c-nav-padding-item)]">
        <span
          role="img"
          aria-label="Gainsight PX"
          className="h-6 w-auto [&_svg]:h-6 [&_svg]:w-auto"
          dangerouslySetInnerHTML={{ __html: pxNavLogoExpandedSvg }}
        />
        <button
          type="button"
          aria-label={pinned ? "Unpin navigation" : "Pin navigation"}
          aria-pressed={pinned}
          onClick={onTogglePin}
          className={cn(
            "flex size-6 items-center justify-center rounded outline-none transition-colors",
            "text-[var(--c-nav-item-content-subtle)]",
            "hover:bg-[color:var(--c-nav-item-active-background)]/12 hover:text-[var(--c-nav-item-content)]",
            "focus-visible:shadow-[var(--e-shadow-focus)]",
            pinned && "text-[var(--c-nav-item-content)]",
          )}
        >
          <PrismIcon name={pinned ? "pin-filled" : "pin-line"} size={24} className="text-[var(--c-nav-item-content)]" />
        </button>
      </div>

      {!adminMode && (
        <>
          {/* Search trigger row --------------------------------------- */}
          <button
            type="button"
            onClick={onSearch}
            className={cn(
              "flex h-12 shrink-0 items-center gap-[var(--c-nav-gap-icon-label)] border-b outline-none transition-colors",
              "border-[var(--c-nav-item-divider)] px-[var(--c-nav-padding-item)] text-left",
              "text-[var(--c-nav-item-content-subtle)] hover:text-[var(--c-nav-item-content)]",
              "focus-visible:shadow-[var(--e-shadow-focus)]",
            )}
          >
            <PrismIcon name="search" size={24} className="text-[var(--c-nav-item-content)]" />
            <span
              className={cn(
                "text-[length:var(--c-nav-item-font-size)]",
                "leading-[var(--c-nav-item-font-line-height)]",
                "font-[number:var(--c-nav-item-font-weight)]",
              )}
            >
              Search
            </span>
          </button>

          {/* Main items, followed immediately by Administration as the
              last item in the flowing list (not pinned to the rail's
              bottom edge) ------------------------------------------- */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {SHELL_NAV.map((item) => (
              <ExpandedNavRow
                key={item.key}
                item={item}
                active={item.key === activeKey}
                onClick={() => onNavigate(item.key)}
              />
            ))}

            <div className="shrink-0 border-t border-[var(--c-nav-item-divider)] py-[var(--c-nav-padding-item)]">
              <ExpandedNavRow
                item={SETTINGS_ITEM}
                active={activeKey === "settings"}
                trailingIcon="chevron-right"
                onClick={onAdminEntry}
              />
            </div>
          </div>
        </>
      )}

      {adminMode && (
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Settings row sticks to the top as the back control ------------ */}
          <button
            type="button"
            onClick={onAdminBack}
            aria-label="Back to main navigation"
            className={cn(
              "sticky top-0 z-10 flex h-12 shrink-0 items-center gap-[var(--c-nav-gap-icon-label)] outline-none transition-colors",
              "bg-[var(--c-nav-background)] px-[var(--c-nav-padding-item)] text-left",
              "text-[var(--c-nav-item-content)]",
              "hover:bg-[color:var(--c-nav-item-active-background)]/12",
              "focus-visible:shadow-[var(--e-shadow-focus)]",
            )}
          >
            <PrismIcon name="arrow-left" size={24} />
            <span
              className={cn(
                "flex-1 text-[length:var(--c-nav-item-font-size)]",
                "leading-[var(--c-nav-item-font-line-height)]",
                "font-[number:var(--c-nav-item-font-weight)]",
              )}
            >
              {SETTINGS_ITEM.label}
            </span>
          </button>

          {adminSections.map((section) => {
            const open = openSections.has(section.id)
            return (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => onToggleSection(section.id)}
                  aria-expanded={open}
                  className={cn(
                    "flex h-8 w-full shrink-0 items-center justify-between outline-none",
                    "px-[var(--p-space-300)] text-left",
                    "focus-visible:shadow-[var(--e-shadow-focus)]",
                  )}
                >
                  <span
                    className={cn(
                      "text-[length:var(--p-font-size-xsmall)]",
                      "font-[var(--p-font-weight-semi-bold)]",
                      "uppercase tracking-wide",
                      "text-[var(--c-nav-section-title)]",
                    )}
                  >
                    {section.title}
                  </span>
                  <PrismIcon
                    name={open ? "chevron-down" : "chevron-right"}
                    size={16}
                    sourceSize={24}
                    className="text-[var(--c-nav-item-content)]"
                  />
                </button>

                {open &&
                  section.items.map((sub) => {
                    const subActive = activeAdminItem === sub.id
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onAdminItemSelect(sub.id)}
                        className={cn(
                          "flex h-6 w-full shrink-0 items-center pl-20 pr-[var(--c-nav-padding-item)] text-left outline-none transition-colors",
                          "text-[length:var(--c-nav-item-font-size)]",
                          "leading-[var(--c-nav-item-font-line-height)]",
                          "font-[number:var(--c-nav-item-font-weight)]",
                          "text-[var(--c-nav-item-content-subtle)] hover:text-[var(--c-nav-item-content)]",
                          "focus-visible:shadow-[var(--e-shadow-focus)]",
                          subActive && "text-[var(--c-nav-item-content)]",
                        )}
                      >
                        {sub.label}
                      </button>
                    )
                  })}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

function ExpandedNavRow({
  item,
  active,
  trailingIcon,
  onClick,
}: {
  item: PxShellNavItem
  active: boolean
  trailingIcon?: PrismIconName
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "relative flex h-12 w-full shrink-0 items-center gap-[var(--c-nav-gap-icon-label)] outline-none transition-colors",
        "px-[var(--c-nav-padding-item)] text-left",
        "text-[var(--c-nav-item-content-subtle)]",
        "hover:bg-[color:var(--c-nav-item-active-background)]/12 hover:text-[var(--c-nav-item-content)]",
        "focus-visible:shadow-[var(--e-shadow-focus)]",
        active && "bg-[color:var(--c-nav-item-active-background)]/12 text-[var(--c-nav-item-content)]",
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-[var(--c-nav-item-indicator)]"
          style={{ width: "var(--c-nav-indicator-width)" }}
        />
      )}
      <PrismIcon name={item.icon} size={24} className="text-[var(--c-nav-item-content)]" />
      <span
        className={cn(
          "flex-1 text-[length:var(--c-nav-item-font-size)]",
          "leading-[var(--c-nav-item-font-line-height)]",
          "font-[number:var(--c-nav-item-font-weight)]",
        )}
      >
        {item.label}
      </span>
      {trailingIcon && (
        <PrismIcon name={trailingIcon} size={16} sourceSize={24} className="text-[var(--c-nav-item-content)]" />
      )}
    </button>
  )
}

export { PxShellRail, DEFAULT_ADMIN_SECTIONS, PX_NAV_LABELS }
