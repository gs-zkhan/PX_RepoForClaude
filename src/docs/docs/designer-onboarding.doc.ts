import type { ComponentDoc } from "@/docs/types"

// Deliberate, explicitly-requested exception to this registry's general
// "every doc here is a typed Prism component" rule (see the header comment
// on navGroups in src/docs/registry.ts) — the same treatment already given
// to PxAnalyticsSecondaryNav. Full source of truth is DESIGNER_ONBOARDING.md
// at the repo root; this page mirrors it for in-app discovery only.
export const designerOnboardingDoc: ComponentDoc = {
  slug: "designer-onboarding",
  name: "Designer Onboarding",
  status: "stable",
  description:
    "A 5-minute guide for a PX designer using Claude Code — no shell names, token names, registry statuses, or prompt engineering required.",
  sourcePath: "DESIGNER_ONBOARDING.md",

  sections: [
    {
      id: "getting-started",
      title: "Getting started",
      body:
        "Clone or open this repo, open Claude Code in it, describe the screen you want in plain product language, ask Claude to build it using the existing PX design system, then review what it built and refine visually by talking to it.",
    },
    {
      id: "what-to-say",
      title: "What to say",
      body:
        "Describe the product like you would to another designer: what the page is for, what information it should show, the key actions, whether clicking a row opens a detail view, whether a form needs multiple sections, and what analytics would be useful.",
    },
    {
      id: "what-you-dont-need-to-know",
      title: "What you don't need to know",
      body:
        "You never need to say shell names (PxListShell, PxDetailDrilldownShell, PxCreateEditShellAccordion, ...), token names, component registry statuses, Figma node IDs, or ShadCN/Radix internals. Claude derives all of that from the repo.",
    },
    {
      id: "what-claude-does",
      title: "What Claude does automatically",
      body:
        "Picks the right shell from your screen's anatomy, searches for an existing component before building anything new, follows component eligibility rules, applies the surface/elevation rule and standard table composition, caps summary-stat rows at 4, discloses when it uses a not-yet-fully-reviewed component, and stops to explain if something genuinely isn't supported yet.",
    },
    {
      id: "designer-responsibility",
      title: "What's still yours",
      body:
        "Product intent, content and copy, information hierarchy, whether the analytics it picked are actually useful, and the final visual judgment call.",
    },
    {
      id: "starter-prompts",
      title: "Starter prompts",
      body: "Four copy-paste examples, one per archetype — adjust the specifics to your own screen.",
      children: [
        {
          id: "starter-list",
          title: "List page",
          body:
            "Create a Customers page. Show useful summary information at the top and a searchable/filterable table of customers. Customer name should open the customer detail view. Add the columns and controls you think are useful. Use the existing PX design system.",
        },
        {
          id: "starter-detail",
          title: "Detail/Drilldown page",
          body:
            "Create a detail page for a customer. I need a way back to the list, the customer name and status, some useful summary metrics, recent activity, and relevant analytics. Use the existing PX design system.",
        },
        {
          id: "starter-create-edit",
          title: "Create/Edit form",
          body:
            "Create an experience to add a new customer with name, website, industry, plan, owner, ARR, seats, health and notes. Organize it appropriately based on the complexity of the form. Use the existing PX design system.",
        },
        {
          id: "starter-analytics",
          title: "Analytics page",
          body:
            "Create an analytics page showing feature adoption. Include useful summary metrics, trends, breakdowns and filters. Use the existing PX design system. Choose the analytics and layout you think make sense and I'll refine them visually.",
        },
      ],
    },
    {
      id: "unsupported",
      title: "If the design system can't do something",
      body:
        "Claude will reuse an existing approved component if one fits, use a not-yet-fully-reviewed component only when the rules allow it (and tell you), never quietly invent a missing PX component, and stop and explain the gap if the capability genuinely doesn't exist yet.",
    },
  ],

  props: [],
}
