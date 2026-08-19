import type { ComponentDoc } from "@/docs/types"

export const progressBarDoc: ComponentDoc = {
  slug: "progress-bar",
  name: "Progress Bar",
  status: "stable",
  description:
    "A quantified horizontal loading indicator for deterministic tasks where the completion percentage is known.",
  figmaNodeId: "20:23",
  sourcePath: "src/components/ui/progress-bar.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "ProgressBar renders an 8px-tall pill track with a status-colored fill sized to `value`. Height is always 8px and should never be changed; width is resizable to fit the layout column. Use it for upload progress, onboarding completion, or form step progress — use Spinner instead when duration is indeterminate.",
      exampleId: "progress-bar/default",
    },
    {
      id: "status",
      title: "Status",
      body:
        "Four fill colors set with the `status` prop: default (brand), success, warning and danger. Choose the status that matches what the completing task means, not an arbitrary accent color.",
      exampleId: "progress-bar/status",
    },
    {
      id: "with-label",
      title: "Pairing with a label",
      body:
        "ProgressBar alone is not accessible per Figma's own rule — always render a visible percentage or step count next to it. The component takes `label` only for the accessible name, the same convention MetricBar uses.",
      exampleId: "progress-bar/with-label",
    },
  ],

  props: [
    {
      name: "value",
      type: "number",
      required: true,
      description: "0-100. Values outside this range are clamped.",
    },
    {
      name: "status",
      type: '"default" | "success" | "warning" | "danger"',
      defaultValue: '"default"',
      description: "Fill color, matched to the meaning of the completing task.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description:
        "Accessible label describing what's being measured, e.g. \"Profile completion\". Not rendered visibly — pair with a caller-rendered percentage or step count.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, e.g. sizing the bar's width within a layout.",
    },
  ],

  tokens: [
    "--p-radius-full",
    "--s-color-line-brand",
    "--s-color-status-danger-default",
    "--s-color-status-success-default",
    "--s-color-status-warning-default",
    "--s-color-surface-muted",
  ],

  guidelines: {
    dos: [
      "Always pair ProgressBar with a visible percentage or step count rendered by the caller.",
      "Use it only when the completion percentage is deterministic and known.",
      "Choose `status` to match the meaning of the task (success on completion, danger on failure).",
      "Let width flex with the layout column; never override the fixed 8px height.",
    ],
    donts: [
      "Don't use ProgressBar for indeterminate-duration loading — use Spinner instead.",
      "Don't change the track height; it is fixed at 8px in Figma.",
      "Don't ship it without a visible label — the bar alone is not an accessible progress indicator.",
      "Don't render it right-to-left; ProgressBar always fills left-to-right.",
    ],
  },
}
