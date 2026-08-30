import type { ComponentDoc } from "@/docs/types"

// STATUS: APPROVED WITH DOCUMENTED EXCEPTION (2026-08-30). Design owner
// completed visual review and approved this component, with one accepted
// exception — see the "Review status" section immediately below. See
// ai/figma-coverage.json (id component-dashboard-widget-card) and
// src/components/ui/dashboard-widget-card.tsx for the full evidence trail.
export const dashboardWidgetCardDoc: ComponentDoc = {
  slug: "dashboard-widget-card",
  name: "Dashboard Widget Card",
  status: "stable",
  description:
    "APPROVED WITH DOCUMENTED EXCEPTION (2026-08-30). The header chrome of every analytics dashboard tile — title, data-source label, filter/share/overflow actions, a chart-type trigger + popover, a body slot, and an optional footer dropdown row (2 left + 1 right, per Figma).",
  figmaNodeId: "20:27",
  sourcePath: "src/components/ui/dashboard-widget-card.tsx",

  sections: [
    {
      id: "status",
      title: "Review status — approved with one documented exception",
      body:
        "Implemented against Figma page 20:27, AI Instructions (4407:49309) and Dos/Don'ts (4407:49334). Design owner completed visual review and approved this component on 2026-08-30. Documented exception: the chart-type popover's 4th option uses the existing Prism `icons/24/formula-number.svg` asset as the design-owner-accepted approximation, because the repository has no dedicated matching \"#\"/hash asset. It is visually approved but must not be described as an exact Figma icon match — see the Chart-type switcher section below.",
    },
    {
      id: "distinct",
      title: "Distinct from SummaryStat, CanvasCard, and chart components",
      body:
        "SummaryStat is a single KPI value+label display with no header/action anatomy. CanvasCard is an unrelated two-pane resizable editor shell. This component is only the widget's header chrome plus a content slot — it does not render or depend on any specific chart library; callers pass a chart component (or anything else) as `children`.",
    },
    {
      id: "header",
      title: "Header — title, source, actions",
      body:
        "Title + source label stack on the left. Up to 4 action types on the right, per Figma's own Dos/Don'ts limit: a chart-type switcher, filter, share, and overflow — additional actions belong inside the overflow menu, not as extra standalone icons. `aria-label` on the header combines title and source label, matching Figma's own example. CORRECTED (2026-08-30, per direct design-owner request): re-checked `get_variable_defs` on the title and subtitle text nodes individually — the AI Instructions' summarized prose (\"Widget title: SemiBold 14px\", \"source-label → color/action/primary/default\") does not match what the real component actually binds. Title uses `font.heading.small` (SemiBold 16px, line-height 24 — the same token Card's own title uses), colour `color/text/default`. Subtitle uses the full `font.label.small` set (Regular 12px, line-height 16, letter-spacing 0 — not just a font-size), colour `color/text/subtle` (not primary-blue). A 4px gap (`--p-space-050`) separates title and subtitle. This is a real, documented conflict between the AI Instructions' prose and the live component's bound variables; the direct per-node evidence is what's implemented.",
      exampleId: "dashboard-widget-card/default",
    },
    {
      id: "share-icon-provenance",
      title: "Share icon — audited and approved",
      body:
        "AUDITED (2026-08-30, per direct design-owner request): traced `icon=\"share\"` end to end — IconButton -> PrismIcon -> src/assets/icons/24/share.svg (a \"share network\" three-node glyph, source size 24, rendered at 24 with no scaling). This is a real, already-cataloged repo Prism icon, not a bespoke inline SVG or a Lucide/generic substitute. For the record: all 3 of the Dashboard Widget Card's defining Figma symbols (4432:50635, 4432:50637, 4445:50697) show exactly 3 RHS icon instances each — filter, PXAnalytics (chart-type), and more-vertical (overflow) — and NONE of them contains a Share icon instance, despite the AI Instructions' prose repeatedly listing \"share/export icon\" as one of the 4 fixed action types. This was flagged as an open evidence gap pending review; the design owner completed visual review on 2026-08-30 and approved this icon as-is alongside the rest of the component — no separate exception was recorded for it.",
    },
    {
      id: "icon-standardization",
      title: "Header icons — standardization audit",
      body:
        "Chart-type icons (via DashboardWidgetChartTypeSwitcher): render through PrismIcon at 24px (RESOLVED 2026-08-30 — a prior draft rendered them at 16px inside a 24×24 box, mismatching the sibling icons' actual size; Figma's defining symbols show the chart-type placeholder icon at a full 24×24, identical to its neighbours). Decorative (the radio's own `aria-label` supplies the accessible name). Filter/Share/Overflow: all compose the existing, unmodified IconButton, which already renders a 24×24 box with a 24px glyph by default — no IconButton change was made, and no unrelated IconButton consumer is affected. Each requires a real caller-supplied `label` (Filter/Share) or ships with a fixed \"More options\" label (Overflow) per Figma. The footer dropdown row's own leading icon (see Footer dropdown row section) composes a plain PrismIcon directly inside the Select trigger — decorative, since the trigger's placeholder text already names the field.",
    },
    {
      id: "keyboard-order",
      title: "Keyboard Tab order — re-verified",
      body:
        "RE-VERIFIED (2026-08-30, per direct design-owner request, via real Tab/Shift+Tab key presses from a neutral focus position — not only programmatic .focus()): with the chart-type switcher, filter, share, and overflow all present, Tab order is radiogroup (single Tab stop, landing on the checked option) -> Filter -> Share -> Overflow, and the reverse via Shift+Tab, confirmed bidirectionally. Grepped both this component and DashboardWidgetChartTypeSwitcher for tabIndex/keydown handling — neither exists; the order comes entirely from Radix's native roving-focus wiring and DOM order. This re-verification did not reproduce a reported \"Tab starts at Filter\" behaviour — a plausible explanation is that it was observed before the chart-type icon rendering fix (a prior build had invisible chart-type icons due to a missing sourceSize, which could read as an invisible-but-technically-focusable control to a visual reviewer); flagged here rather than assumed, since this could not be independently confirmed.",
    },
    {
      id: "filter-row",
      title: "Footer dropdown row — corrected position and anatomy",
      body:
        "CORRECTED (2026-08-30, per direct design-owner correction: \"footer DD are missing in the implementation\"): a prior draft rendered `filterRow` as a single generic gap-only row directly below the header, demonstrated only with plain placeholder text — neither the position nor the anatomy matched Figma. Re-inspected the defining symbol's own footer frame (4419:50511, at y=220 of a 288px-tall card, i.e. the BOTTOM, not the top) directly via get_metadata: it holds exactly 3 \"Dropdown\" component instances — two grouped on the left (bare \"Select Value\" + chevron, no icon) and one pinned to the right edge (leading `icons/24/placeholder` + \"Select Value\" + chevron — the icon is literally named \"placeholder\" in Figma, meaning even Figma hasn't finalized which icon belongs there). `filterRow` now renders AFTER `children` (bottom of the card) with a `justify-between` wrapper, so composing a left group + a right item reproduces this split. Compose the already-approved `Select`/`SelectTrigger`/`SelectValue`/`SelectContent` directly (per the AI Instructions' own \"Dropdown · Select, Size=Small\" note) — this component still does not build Select/Dropdown controls itself. Only render `filterRow` when the widget supports configurable granularity/date-range/segmentation — Figma explicitly warns against ever rendering an empty filter row.",
      exampleId: "dashboard-widget-card/default",
    },
    {
      id: "no-optional-actions",
      title: "Omitting optional actions and the footer row",
      body:
        "Every optional slot (`chartTypeSwitcher`, `filterAction`, `shareAction`, `filterRow`) is independently omittable — a static KPI widget with only an overflow menu and no footer row is a fully legal configuration, not a degraded one.",
      exampleId: "dashboard-widget-card/no-filters",
    },
    {
      id: "chart-type-switcher",
      title: "Chart-type switcher — trigger + popover (per user reference screenshots)",
      body:
        "CORRECTED A THIRD TIME (2026-08-30, per direct user correction with reference screenshots — the prior version of this section, which rendered every option as an always-visible icon button, was also wrong): the real control is a single trigger — the active option's icon plus a small chevron, like a dropdown — that opens a small popover listing all options vertically, with the active one visually highlighted (tinted background, primary-blue icon) and the rest neutral-gray. This anatomy came from screenshots the user supplied directly, not from Figma's static frames, which show only one motionless icon and cannot depict an open/closed popover state. `DashboardWidgetChartTypeSwitcher` is now built as `Popover` (existing, unmodified primitive) wrapping a `role=\"radiogroup\"` (@radix-ui/react-radio-group, unchanged from the prior correction) inside its content — this keeps Figma's AI-Instructions requirement (role=\"radiogroup\" with aria-label=\"Chart type\") exactly where it always applied: the list of options, once revealed. `chartTypeSwitcher` stays a generic, caller-supplied slot; the 4 example options (scatter/bar/line/number) match the user's screenshots, and `icons/24/formula-number.svg` is used as the closest available Prism asset for the \"#\"-style glyph shown (this repo has no dedicated hash icon) — flagged as an approximation, not an exact match. APPROVED (2026-08-30) with one documented exception (the formula-number icon, see the Review status section above). Manually verified in-browser at approval time: the trigger is a single Tab stop from a neutral focus position (Tab: trigger -> Filter -> Share -> Overflow, and the reverse via Shift+Tab); opening the popover (via click) moves focus into the radiogroup, landing on the checked option; ArrowUp/ArrowDown move roving focus between options; clicking an option selects it, updates the trigger's icon, and closes the popover; Escape closes the popover and restores focus to the trigger. Enter/Space to open the trigger, and Space to select a focused-but-unchecked option, could not be conclusively confirmed through this automated browser tool — the same gap reproduces identically on the repo's pre-existing, unmodified DropdownMenu trigger elsewhere in this app, so it reads as an automation-tool limitation rather than a wiring defect (no custom keydown handling or tabIndex exists anywhere in this component). `ViewSwitcher` (role=\"tablist\"/\"tab\") remains unrelated and unmodified — it was never reused for this control, for the same ARIA-mismatch reason as before.",
    },
  ],

  props: [
    { name: "title", type: "string", required: true, description: "Widget title (SemiBold)." },
    { name: "sourceLabel", type: "string", required: true, description: "Data source label (e.g. \"GAINSIGHT CS - PROD\") — always required per Figma's Dos/Don'ts." },
    { name: "chartTypeSwitcher", type: "React.ReactNode", description: "Compose a DashboardWidgetChartTypeSwitcher (a single trigger + popover, per user reference screenshots), WHEN a chart-type control is actually needed. Do not reuse ViewSwitcher here — see the chart-type switcher section above." },
    { name: "filterAction", type: "{ label: string; onClick: () => void }", description: "Renders a Filter IconButton when supplied. The accessible label is caller-supplied, not invented by this component." },
    { name: "shareAction", type: "{ label: string; onClick: () => void }", description: "Renders a Share IconButton when supplied. The accessible label is caller-supplied, not invented by this component." },
    { name: "overflowMenu", type: "React.ReactNode", description: "DropdownMenuItem elements for the overflow (⋮) menu. Omit to hide the trigger entirely." },
    { name: "filterRow", type: "React.ReactNode", description: "Footer dropdown row, rendered at the bottom (after `children`) with a justify-between wrapper — compose Select/SelectTrigger/SelectValue/SelectContent per the Footer dropdown row section. Only pass when the widget supports configurable data controls — never an empty node." },
    { name: "children", type: "React.ReactNode", description: "Widget body — any chart component, a table, or nothing." },
    { name: "className", type: "string", description: "Placement only." },
  ],

  tokens: [
    "--s-color-surface-default",
    "--s-color-line-default",
    "--s-color-text-default",
    "--s-color-text-subtle",
    "--s-color-action-primary-default",
    "--s-color-text-subtlest",
    "--t-font-heading-small-size",
    "--t-font-heading-small-weight",
    "--t-font-heading-small-line-height",
    "--t-font-heading-small-letter-spacing",
    "--t-font-label-small-size",
    "--t-font-label-small-weight",
    "--t-font-label-small-line-height",
    "--t-font-label-small-letter-spacing",
    "--p-radius-150",
    "--p-space-050",
    "--p-space-100",
    "--p-space-150",
  ],

  guidelines: {
    dos: [
      "Always supply `sourceLabel` — never leave it empty.",
      "Only render `filterRow` when the widget genuinely supports configurable data controls.",
      "Keep the header to the 4 fixed action types — put secondary actions in `overflowMenu`.",
      "Use the full `--t-font-label-small-*` token set for the subtitle, not just a font-size primitive.",
    ],
    donts: [
      "Don't use this component as a page-level header — use PxHeader instead.",
      "Don't render an empty filter row.",
      "Don't couple the body slot to a specific chart library.",
      "Don't compose ViewSwitcher into `chartTypeSwitcher` — Figma requires radiogroup semantics; use DashboardWidgetChartTypeSwitcher instead.",
      "Don't assume `icon=\"share\"` is Figma-verified — no Share icon instance exists in any of the 3 defining Figma symbols; treat it as an open evidence gap, not a resolved match.",
      "Don't render every chart-type option as an always-visible icon button — the real control is a single trigger (active icon + chevron) that opens a popover listing the options.",
      "Don't describe the chart-type popover's 4th option (`icons/24/formula-number.svg`) as an exact Figma icon match — it is the design-owner-accepted approximation for a \"#\"/hash glyph this repo has no dedicated asset for.",
      "Don't render `filterRow` directly below the header — it belongs at the bottom of the card, after `children`.",
    ],
  },
}
