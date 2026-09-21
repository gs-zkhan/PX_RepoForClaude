import type { ComponentDoc } from "@/docs/types"

// Deliberate, explicitly-requested exception to this registry's general
// "every doc here is a typed Prism component" rule (see the header comment
// on navGroups in src/docs/registry.ts) — the same treatment already given
// to PxAnalyticsSecondaryNav. Full source of truth is
// ai/v1.1-release-checkpoint.md; this page mirrors it for in-app discovery.
export const v11ReleaseCheckpointDoc: ComponentDoc = {
  slug: "v1-1-release-checkpoint",
  name: "v1.1 Release Checkpoint",
  status: "stable",
  description:
    "Status: READY FOR BROADER DESIGNER USE. What v1.1 achieves, the architecture, the 4 supported shell families, the cold-generation evidence, and the known non-blocking limitations.",
  sourcePath: "ai/v1.1-release-checkpoint.md",

  sections: [
    {
      id: "goal",
      title: "What v1.1 achieves",
      body:
        "Generate a correct, on-brand PX screen from a plain product description alone — no Figma, no shell/token/registry vocabulary required from the requester.",
    },
    {
      id: "architecture",
      title: "Architecture (bottom to top)",
      body:
        "ShadCN/Radix supply the behavior and accessibility foundation. Prism tokens and icons supply PX's visual identity. Approved and provisional PX components (src/components/ui) are the typed, reusable pieces. Patterns and shells (src/patterns) compose those into page-level layouts. Natural-language screen generation is Claude composing all of the above from a plain request.",
    },
    {
      id: "shell-families",
      title: "The 4 supported shell/archetype families",
      body:
        "List (PxListShell — table/master dataset + filters). Detail/Drilldown (PxDetailDrilldownShell — single-record read view). Create/Edit (PxCreateEditShell, tiered Modal/Accordion/Wizard by field count/branching). Analytics (PxAnalyticsSecondaryNav — KPI/chart dashboard).",
    },
    {
      id: "cold-generation-evidence",
      title: "Cold-generation evidence (Tests #1–8)",
      body:
        "Test #1: historical/negative fixture (the defect PR #13 fixed). #2, #3, #4, #6, #8: PASS. #5: PARTIAL — no Detail/Drilldown shell existed yet. #7: initially PARTIAL, final PASS after policy hardening, with no change to the generated screen. Never summarize this as \"8/8 clean\" — #1 and #5 are real, load-bearing findings. Full records live in ai/cold-generation/README.md.",
    },
    {
      id: "hardening-outcomes",
      title: "v1.1 hardening outcomes",
      body:
        "The Product Surface Rule (shadow vs. border by surface context, PX-wide). TableFrame (standard table toolbar/surface composition). The max-4 StatsRow rule. Scoped-composition decisions for DropdownMenu, Popover, and Input/PxHeader — each naming specific sanctioned internal consumers rather than opening general access. An automated dependency-consistency CI check that catches the next instance of this class of gap on its own.",
    },
    {
      id: "limitations",
      title: "Known non-blocking limitations",
      body:
        "Many shared components are still Mapped-review-pending (usable, not yet design-owner visually reviewed). There is no generic FormField wrapper yet (a documented interim workaround exists). Dual-axis chart capability and page-level \"supporting description\" typography both remain deferred. src/pages/audience-explorer.tsx is legacy/orphaned, never canonical, not routed. Visual fidelity always still benefits from a final designer look — this system gets structure and composition right, not final pixel sign-off.",
    },
    {
      id: "go-deeper",
      title: "Go deeper",
      body:
        "CLAUDE.md (the rules Claude actually follows), ai/shell-registry.md (shell anatomy/approval detail), ai/figma-coverage.json (component-by-component eligibility), and ai/cold-generation/README.md (full benchmark history).",
    },
  ],

  props: [],
}
