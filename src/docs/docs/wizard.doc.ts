import type { ComponentDoc } from "@/docs/types"

// Documents the REAL Wizard API in this repo — a multi-step progress
// indicator only. The caller owns the step body content and the
// Next/Back/Skip footer buttons; Wizard does not manage step navigation
// itself beyond reporting clicks on already-completed steps.
export const wizardDoc: ComponentDoc = {
  slug: "wizard",
  name: "Wizard",
  status: "stable",
  description: "A multi-step numbered progress indicator for onboarding, bulk imports, or any task broken into ordered steps.",
  figmaNodeId: "1273:23",
  sourcePath: "src/components/ui/wizard.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Wizard renders a row of numbered circles connected by a line, driven entirely by each step's `state`: pending (surface-sunken circle, subtle text), active (primary-default circle, inverse number, bold text), completed (status-success circle, inverse tick icon). This is the progress indicator only — compose it above a caller-rendered form and Button row.",
      exampleId: "wizard/default",
    },
    {
      id: "vertical",
      title: "Vertical orientation",
      body:
        "`orientation=\"vertical\"` stacks steps with the connector drawn below each circle and the label to the right, instead of a horizontal line between circles. Use it for a side-rail step list rather than a top header.",
      exampleId: "wizard/vertical",
    },
    {
      id: "clickable-back-nav",
      title: "Clickable back-navigation",
      body:
        "Only steps with state \"completed\" are clickable, and only when `onStepClick` is provided — this is what enables backwards navigation. Active and pending steps are never clickable, matching a linear wizard's constraint that you cannot skip ahead.",
      exampleId: "wizard/clickable-back-nav",
    },
    {
      id: "no-labels",
      title: "Numbers only",
      body:
        "`showLabels={false}` renders only the numbered circles with no adjacent text, for a compact header where the current step's name is already shown elsewhere. `showNumbers={false}` similarly hides the digit inside pending/active circles, leaving just the completed tick.",
      exampleId: "wizard/no-labels",
    },
  ],

  props: [
    {
      name: "steps",
      type: "WizardStep[]",
      required: true,
      description: "Ordered list of `{ id, label?, state }`. `state` is \"pending\" | \"active\" | \"completed\".",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: "Horizontal draws a connector line between circles; vertical draws it below each circle with the label to the right.",
    },
    {
      name: "showLabels",
      type: "boolean",
      defaultValue: "true",
      description: "Show step labels next to (horizontal) or under (vertical) each circle.",
    },
    {
      name: "showNumbers",
      type: "boolean",
      defaultValue: "true",
      description: "Show step numbers inside pending/active circles. Completed circles always show a tick regardless of this prop.",
    },
    {
      name: "onStepClick",
      type: "(id: string) => void",
      description: "Called when a completed step is clicked. Only completed steps are clickable — this is what enables backwards navigation.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only on the outer <nav>. Do not use it to change circle size, colours or typography.",
    },
  ],

  tokens: [
    "--e-shadow-focus",
    "--p-radius-050",
    "--p-radius-full",
    "--p-space-025",
    "--p-space-050",
    "--p-space-100",
    "--s-color-action-primary-default",
    "--s-color-line-default",
    "--s-color-status-success-default",
    "--s-color-surface-sunken",
    "--s-color-text-default",
    "--s-color-text-inverse",
    "--s-color-text-subtle",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Compose Wizard above the caller's own step body content and Next/Back/Skip Button row — it is a progress indicator only.",
      "Derive each step's `state` from the caller's own current-step logic and keep it in sync as the user moves forward.",
      "Use `orientation=\"vertical\"` for a side-rail layout, horizontal for a top header.",
      "Provide `onStepClick` only when backwards navigation to completed steps is actually supported by the flow.",
    ],
    donts: [
      "Don't expect Wizard to render step content or footer navigation buttons — the caller owns both.",
      "Don't make pending or active steps clickable; only \"completed\" steps can be, per the component's own logic.",
      "Don't override circle size or state colours via className — they come from --s-color-action-primary-default, --s-color-status-success-default and --s-color-surface-sunken.",
    ],
  },
}
