import type { ComponentDoc } from "@/docs/types"

// Documents the PxAnalyticsSecondaryNav pattern (src/patterns/px-analytics-
// secondary-nav). Added to the docs registry at explicit request, as an
// exception to this file's general "composed Px* patterns are out of scope"
// note (see navGroups below) — this pattern's Figma evidence, API, and
// accessibility model are substantial enough to warrant a full page rather
// than README-only documentation.
//
// STATUS: Visual Review: Approved. Approved for AI use: Yes. Approval date:
// 2026-08-29. The design owner visually verified the expanded navigation,
// the selected-row tint, the collapsed variant, the collapse/expand
// control, and the collapsed-rail hover/focus flyout (including item
// selection from it) — see ai/shell-registry.md and ai/figma-coverage.json
// (id shell-analytics-secondary-nav: status Approved,
// designOwnerApproval.approved: true) for the recorded evidence. This
// approval covers PxAnalyticsSecondaryNav only — it does not newly approve
// DropdownMenu, Accordion, IconButton, or any other shared component this
// pattern composes; their own status is unchanged.
export const pxAnalyticsSecondaryNavDoc: ComponentDoc = {
  slug: "px-analytics-secondary-nav",
  name: "Analytics Secondary Navigation (PxAnalyticsSecondaryNav)",
  status: "stable",
  description:
    "APPROVED. A fixed-width (312px), full-height, non-scrolling vertical navigation panel listing Analytics sub-pages, grouped into independently-collapsible sections, with its own collapse/expand control and a collapsed-rail hover/focus flyout. Composes as a sibling of <main> inside PxMainContainer's content row.",
  figmaNodeId: "9576:15005",
  sourcePath: "src/patterns/px-analytics-secondary-nav/PxAnalyticsSecondaryNav.tsx",

  sections: [
    {
      id: "status",
      title: "Review status (read first)",
      body:
        "Visual Review: Approved. Approved for AI use: Yes. Approval date: 2026-08-29. The design owner visually verified the expanded navigation, the selected-row tint, the collapsed variant, the collapse/expand control, and the collapsed-rail hover/focus flyout (including item selection from it). The original Analytics Figma component (frame 9576:15005) supplied the main navigation evidence; the collapse/expand requirement was added by the design owner afterward and matched against an authoritative update to that same frame; frame 9576:17226 supplied the collapsed-menu hover-flyout evidence; node 491:83 supplied the filled-chevron visual reference. This approval covers PxAnalyticsSecondaryNav only — see \"Deviations and design-owner decisions\" below, and src/patterns/px-analytics-secondary-nav/README.md for the full ledger.",
    },
    {
      id: "figma-sources",
      title: "Figma sources",
      body:
        "Frame 9576:15005 (\"Secondary Left Navigation - Analytics\") holds both variants: Property 1=Expanded (symbol 3397:2451, 312x664, default) and Property 1=Collapsed (symbol 9576:15105, 56x664). The Expanded symbol's Title row (node 9576:16007) is the authoritative source for the collapse button's text (\"All Reports\") and placement — it supersedes an earlier, unconfirmed guess. Owning page for sections/rows: Shell/Analytics/Secondary-Left Navigation (3351:3925). Full-page composition: Shell/Nav+SecNav (4191:21173) — verified to instance this exact component beside a collapsed (48px) primary rail. Collapse/expand icons: icons/filled/chevron-leftmenu-collapse-filled (491:83) and -expand-filled (491:82) — rendered exactly as Figma shows them (a permanently-filled blue circle, not a hover-only treatment).",
    },
    {
      id: "default",
      title: "Default (expanded)",
      body:
        "A Title row (`title` prop, e.g. \"All Reports\") with the collapse button on the right, followed by a vertical stack of independent Accordion sections (type=\"on-material\", size={48}) in a fixed order — Favorites, Audience, Features, Engagement — each holding sub-page navigation rows. All sections default to open, matching Figma's \"all sections start State=Open\" rule. `defaultCollapsed` defaults to false (expanded), matching Figma's default variant.",
      exampleId: "px-analytics-secondary-nav/default",
    },
    {
      id: "states",
      title: "Controlled section state and link semantics",
      body:
        "openSectionIds/onOpenSectionIdsChange controls section open/closed state externally. Rows render as a real <a href> when the item supplies `href` (real routing consumers get link semantics) or a <button> when it doesn't (selection changes only local state, matching PxShellRail's primary-nav precedent). Collapsing a section that contains the keyboard-focused row moves focus to that section's own header rather than dropping it to <body>.",
      exampleId: "px-analytics-secondary-nav/states",
    },
    {
      id: "collapse",
      title: "Collapse and expand",
      body:
        "A design-owner extension requested AFTER the original Analytics frame was authored, then matched exactly against an authoritative Figma update (frame 9576:15005) that shows both variants directly. Expanded: a 24x24 IconButton (iconStyle=\"filled\", icon=\"chevron-leftmenu-collapse-filled\") sits in a dedicated Title row beside the `title` text — not inside any accordion header. Collapsed: the entire panel (title, accordions, rows) is removed from the DOM/tab order/accessibility tree; a 56px-wide icon rail remains — a 24x24 expand button (chevron-leftmenu-expand-filled) followed by one 24px decorative icon per section, matching Figma's collapsed symbol exactly (not a lone button). Section-open and selected-item state survive every collapse/expand. Focus moves to the counterpart button on every toggle.",
      exampleId: "px-analytics-secondary-nav/collapse",
    },
    {
      id: "collapsed-hover-flyout",
      title: "Collapsed-menu hover flyout",
      body:
        "Figma frame 9576:17226 (\"Collapsed Menu Hover behaviour\"), added after the collapse/expand feature above. Each 56x56 section cell in the collapsed rail is a DropdownMenu trigger — hovering or focusing it opens a flyout (node 9576:17185) listing that section's items, reusing DropdownMenu/DropdownMenuItem directly (their --c-dropdown-menu-*/--e-shadow-500 tokens are an exact match for the FlyOut's own tokens). Clicking or Enter-selecting an item calls the same onSelectItem callback as the expanded rows, without expanding the panel. Only one flyout is open at a time (state lives on the parent). WCAG 1.4.13 compliant: hoverable (150ms close-delay lets the pointer travel from icon to flyout), persistent (stays open until dismissed), dismissible (Escape, outside click, or focus moving away all close it).",
      exampleId: "px-analytics-secondary-nav/collapsed-hover-flyout",
    },
    {
      id: "scrolling",
      title: "Scroll ownership",
      body:
        "Design-owner decision: this panel and the 48px primary rail never scroll and never acquire a scrollbar — only the content area to the right does. Implemented as overflow-hidden (clips, does not scroll) rather than removing overflow handling outright.",
      exampleId: "px-analytics-secondary-nav/scrolling",
    },
    {
      id: "semantic-decision",
      title: "Semantic decision: navigation rows, not a tree",
      body:
        "An earlier revision reused the shared Tree/TreeItem component for these rows. Corrected: Figma's own AI Instructions specify role=\"menuitem\"/\"link\" + aria-current=\"page\" — not role=\"tree\"/\"treeitem\" + aria-selected. These rows are a flat navigation list per section, matching the WAI-ARIA APG \"Navigation\" pattern, not \"Tree\"/\"Listbox\". Native <a>/<button> semantics give correct behavior for free.",
    },
    {
      id: "deviations",
      title: "Deviations and design-owner decisions (full ledger)",
      body:
        "1) Width rationale only: instructions say 312px matches the EXPANDED (240px) rail; real geometry shows a COLLAPSED (48px) rail — the value itself is correct, only the stated reason was wrong. No approval needed. 2) Active-item colour: ACCEPTED BY DESIGN OWNER — confirmed token-driven (--c-tree-branch-selected), not hard-coded; kept unchanged. 3) On-material header horizontal padding: corrected to --c-accordion-padding-on-material, scoped to type=\"on-material\" only — verified no effect on the approved PxCreateEditShellAccordion (default off-material type). 4) Scrolling: RESOLVED BY DESIGN-OWNER DECISION — overflow-hidden, only the content area scrolls. 5) Features icon: resolved — feature-px.svg confirmed via exact vector-path match, wired into src/assets/icons/24/. 6) ARIA role pattern: resolved — real <a>/<button> + aria-current. 7) Collapse/expand icon and placement: CORRECTED against an authoritative Figma update (frame 9576:15005) — an earlier guess used the wrong icon (a plain chevron + custom button colour instead of the actual permanently-filled asset) and the wrong placement (inside the first accordion's header instead of a dedicated Title row); both now implemented exactly as the updated frame shows, including the full icon-rail collapsed state (not a lone button).",
    },
  ],

  props: [
    {
      name: "title",
      type: "string",
      required: true,
      description: "Panel title shown in the expanded state's Title row (node 9576:16007), e.g. \"All Reports\". Independent of any section's label.",
    },
    {
      name: "sections",
      type: "PxAnalyticsNavSection[]",
      required: true,
      description: "Fixed-order section list ({ id, label, icon, items }). Also drives the collapsed state's icon rail (one icon per section, same order).",
    },
    {
      name: "activeItemId",
      type: "string",
      description: "The single currently-active sub-page item id, across all sections. Drives aria-current=\"page\" on exactly one row.",
    },
    {
      name: "onSelectItem",
      type: "(itemId: string, sectionId: string) => void",
      required: true,
      description: "Called when a row is activated (click, Enter, or Space via native button/link semantics).",
    },
    {
      name: "openSectionIds",
      type: "string[]",
      description: "Controlled open-section state. Omit to let the component manage it internally — defaults to every section open.",
    },
    {
      name: "onOpenSectionIdsChange",
      type: "(ids: string[]) => void",
      description: "Called when a section's Accordion header is toggled.",
    },
    {
      name: "collapsed",
      type: "boolean",
      description: "Controlled collapsed state. Omit to let the component manage it internally (see defaultCollapsed). Never resets openSectionIds or activeItemId.",
    },
    {
      name: "defaultCollapsed",
      type: "boolean",
      defaultValue: "false",
      description: "Initial collapsed state when uncontrolled — matches Figma's default (Property 1=Expanded).",
    },
    {
      name: "onCollapsedChange",
      type: "(collapsed: boolean) => void",
      description: "Called when the collapse/expand button is activated.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only (e.g. flex sizing from a parent row) — never a visual override.",
    },
  ],

  tokens: [
    "--c-accordion-border",
    "--c-accordion-padding-on-material",
    "--c-accordion-gap",
    "--c-tree-branch-default",
    "--c-tree-branch-hover",
    "--c-tree-branch-selected",
    "--t-tree-font-default-size",
    "--t-tree-font-default-line-height",
    "--t-tree-font-default-weight",
    "--t-font-heading-small-size",
    "--t-font-heading-small-weight",
    "--t-font-heading-small-line-height",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-surface-empty",
    "--s-color-text-default",
    "--c-icon-color-default",
    "--p-space-050",
    "--p-space-100",
    "--p-space-200",
    "--p-space-300",
    "--e-shadow-focus",
  ],

  guidelines: {
    dos: [
      "Render this as a sibling of <main> inside PxMainContainer's content row, positioned before the main content.",
      "Supply `href` on any item with a real destination URL, so it gets real link semantics instead of a button.",
      "Mark exactly one item's id as `activeItemId` to reflect the current page.",
      "Use type=\"on-material\" for every section — never off-material/off-material-shadow inside this nav.",
      "Let content scroll on the right — never re-add overflow-y-auto to this panel.",
      "Render the collapsed state as the full icon rail (expand button + one icon per section) — Figma's actual collapsed symbol, not a lone button.",
    ],
    donts: [
      "Don't render this on top of PxListShell — it composes PxMainContainer directly.",
      "Don't reuse Tree/TreeItem for these rows — they are real navigation destinations (link/button semantics), not a hierarchical tree.",
      "Don't add role=\"menuitem\" to the button variant — that role requires a real role=\"menu\" container.",
      "Don't reorder the sections without product sign-off — the order follows the analytics workflow.",
      "Don't put the collapse button inside any accordion's header — it belongs in the dedicated Title row.",
    ],
  },
}
