import type { ComponentDoc } from "@/docs/types"

export const breadcrumbDoc: ComponentDoc = {
  slug: "breadcrumb",
  name: "Breadcrumb",
  status: "stable",
  description:
    "A horizontal trail of chevron-separated levels showing the user's location in a hierarchy; the last item is always the current page.",
  figmaNodeId: "20:28",
  sourcePath: "src/components/ui/breadcrumb.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Each item in `items` is `{ id, label, href? }`. The last item always renders as a plain span with `aria-current=\"page\"` — it is never a link, regardless of whether it has an href. Earlier items render as an `<a>` when `href` is supplied, or a button that calls `onItemClick` otherwise.",
      exampleId: "breadcrumb/default",
    },
    {
      id: "truncated",
      title: "Truncation",
      body:
        "When the trail exceeds `maxItems` (default 4), the middle collapses to an ellipsis button. Clicking it expands the full trail. The visible set always keeps the root item plus the trailing (maxItems - 2) items — the collapse never hides the current page or the root.",
      exampleId: "breadcrumb/truncated",
    },
    {
      id: "with-links",
      title: "Links vs. click handlers",
      body:
        "Give an item an `href` to render it as a real anchor with normal link semantics (open in new tab, copy link). Omit `href` and rely on `onItemClick` when navigation is handled entirely in-app, e.g. a client-side router that doesn't use real URLs for this level.",
      exampleId: "breadcrumb/with-links",
    },
  ],

  props: [
    {
      name: "items",
      type: "BreadcrumbItem[]",
      required: true,
      description: "The trail, in order from root to current page. BreadcrumbItem = { id, label, href? }.",
    },
    {
      name: "onItemClick",
      type: "(id: string) => void",
      description: "Called when a non-current item without an href is clicked, or an href item if onItemClick is also supplied (its default navigation is prevented).",
    },
    {
      name: "maxItems",
      type: "number",
      defaultValue: "4",
      description: "Max visible items before the middle collapses into an ellipsis. See Truncation.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer <nav>.",
    },
  ],

  tokens: [
    "--e-shadow-focus",
    "--p-radius-050",
    "--p-space-025",
    "--p-space-050",
    "--s-color-action-primary-default",
    "--s-color-text-default",
    "--s-icon-color-subtle",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
  ],

  guidelines: {
    dos: [
      "Always end the trail with the current page as the last item.",
      "Supply `href` whenever a real URL exists for that level, so the browser's link affordances work.",
      "Keep labels short — long labels crowd a truncated trail.",
    ],
    donts: [
      "Don't give the last item an href — it never renders as a link regardless.",
      "Don't set maxItems below 3; there's no room to keep both the root and the current page visible.",
      "Don't build a custom breadcrumb from `<a>`/`<button>` with manual chevrons — this component has no dedicated component tokens of its own and already composes the correct semantic tokens.",
    ],
  },
}
