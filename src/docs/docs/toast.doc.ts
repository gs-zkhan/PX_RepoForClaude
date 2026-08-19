import type { ComponentDoc } from "@/docs/types"

// Documents the REAL Toast API in this repo, built on @radix-ui/react-toast.
// Per explicit user ruling this session ("not needed for prototype"), this
// repo does not build a max-3-visible queue/dedup manager on top of Radix —
// only single-toast usage (one Toast mounted per notification) is currently
// supported. Do not imply a queueing system exists.
export const toastDoc: ComponentDoc = {
  slug: "toast",
  name: "Toast",
  status: "stable",
  description:
    "A short-lived, auto-dismissing message that confirms an action or reports a problem, without blocking the page.",
  figmaNodeId: "20:38",
  sourcePath: "src/components/ui/toast.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Toast must be rendered inside a ToastProvider, alongside a ToastViewport that positions the stack. Visibility is controlled — pass `open` and `onOpenChange` rather than mounting/unmounting the component. This repo supports one open Toast at a time; it does not implement a queue or dedup manager on top of Radix.",
      exampleId: "toast/default",
    },
    {
      id: "variants",
      title: "Variants",
      body:
        "Four variants, set with the `variant` prop, each with its own icon: success, warning, danger, info. Toast is always rendered dark regardless of light/dark mode — its background and content colours are Primitive aliases in Figma, not Semantic tokens, so they never switch with theme.",
      exampleId: "toast/variants",
    },
    {
      id: "action",
      title: "With an action",
      body:
        "`action` accepts `{ type: \"undo\" }` or `{ type: \"cta\", label }`. Either extends the auto-dismiss duration from 4s to 8s so the user has time to act before the toast disappears. Omit `action` (or pass `{ type: \"none\" }`) for a plain confirmation message.",
      exampleId: "toast/action",
    },
    {
      id: "danger",
      title: "Danger",
      body:
        "Danger never auto-dismisses, regardless of `action` — the user must close it manually. It is also announced differently: role=\"alert\" aria-live=\"assertive\", versus role=\"status\" aria-live=\"polite\" for every other variant, matching the higher urgency of the message.",
      exampleId: "toast/danger",
    },
  ],

  props: [
    {
      name: "variant",
      type: '"success" | "warning" | "danger" | "info"',
      defaultValue: '"info"',
      description: "Sets the icon and, for danger, the dismiss and ARIA behaviour. See Variants and Danger.",
    },
    {
      name: "message",
      type: "string",
      required: true,
      description: "The toast's text. Rendered in a single truncating line — keep it to one sentence.",
    },
    {
      name: "action",
      type: '{ type: "none" } | { type: "undo"; label?: string; onUndo: () => void } | { type: "cta"; label: string; onAction: () => void }',
      defaultValue: '{ type: "none" }',
      description:
        "Optional trailing action button. \"undo\" defaults its label to \"Undo\"; \"cta\" requires an explicit label. Either extends auto-dismiss to 8s.",
    },
    {
      name: "duration",
      type: "number",
      description:
        "Override the computed auto-dismiss duration (ms). Left unset, it resolves to Infinity for danger, 8000 with an action, or 4000 otherwise.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only. Do not use it to change background, radius, padding or typography.",
    },
  ],

  tokens: [
    "--c-toast-action-default",
    "--c-toast-action-hover",
    "--c-toast-background",
    "--c-toast-content",
    "--c-toast-font-line-height",
    "--c-toast-font-size",
    "--c-toast-font-weight",
    "--e-shadow-100",
    "--p-radius-050",
    "--p-radius-100",
    "--p-space-100",
    "--p-space-150",
    "--p-space-200",
    "--radix-toast-swipe-move-x",
  ],

  guidelines: {
    dos: [
      "Render exactly one ToastProvider + ToastViewport per app, and control `open`/`onOpenChange` from state.",
      "Keep `message` to a single sentence — it truncates rather than wraps.",
      "Use `danger` for failures that need manual acknowledgement, not for routine confirmations.",
      "Use the `action` prop for Undo/CTA instead of composing a second Button inside the message.",
    ],
    donts: [
      "Don't assume multiple toasts stack, dedupe, or cap at 3 visible — that manager was explicitly not built for this prototype; only single-toast usage is supported.",
      "Don't rely on light/dark mode to change a toast's colours — they are fixed dark regardless of theme.",
      "Don't give a danger toast an auto-dismiss duration; it is always manual-dismiss only.",
      "Don't restyle the toast surface with className — background, radius and padding belong to --c-toast-* tokens.",
    ],
  },
}
