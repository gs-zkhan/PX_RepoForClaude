import type { ComponentDoc } from "@/docs/types"

export const sliderDoc: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  status: "stable",
  description:
    "A range control for choosing a numeric value or range by dragging a thumb along a track.",
  figmaNodeId: "1273:13",
  sourcePath: "src/components/ui/slider.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Slider is built on @radix-ui/react-slider for pointer/keyboard interaction and ARIA. `value`/`defaultValue` may be passed as a single number for a single-thumb slider; other native Radix Root props (`min`, `max`, `step`, `onValueChange`, `orientation`, etc.) pass straight through.",
      exampleId: "slider/default",
    },
    {
      id: "range",
      title: "Range (two thumbs)",
      body:
        "Passing an array of two numbers renders two thumbs — the thumb count is driven directly off `value.length` (or `defaultValue.length`), so Radix supports any number of thumbs this way.",
      exampleId: "slider/range",
    },
    {
      id: "with-value-label",
      title: "With a value label",
      body:
        "Slider has no built-in numeric readout. Figma's own spec requires the current value to always be visible, so compose a companion label in the parent rather than expecting one from this component.",
      exampleId: "slider/with-value-label",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Disabled swaps the thumb ring to --s-color-line-default, dims the range fill, and removes pointer interaction (`data-[disabled]:pointer-events-none` on the root).",
      exampleId: "slider/disabled",
    },
  ],

  props: [
    {
      name: "value",
      type: "number | number[]",
      description:
        "Controlled value. A scalar renders one thumb; an array renders one thumb per entry, matching Radix's multi-thumb model.",
    },
    {
      name: "defaultValue",
      type: "number | number[]",
      defaultValue: "0",
      description: "Uncontrolled initial value, normalised the same way as `value`.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the root. Other Radix Root props (min, max, step, disabled, onValueChange, orientation) pass through directly.",
    },
  ],

  tokens: [
    "--e-shadow-100",
    "--e-shadow-200",
    "--e-shadow-focus",
    "--p-color-neutral-300",
    "--p-radius-full",
    "--s-color-line-brand",
    "--s-color-line-default",
    "--s-color-surface-default",
  ],

  guidelines: {
    dos: [
      "Always render a companion numeric value label next to the slider — Figma requires the current value to be visible at all times.",
      "Pass an array of two values for a range slider.",
      "Let min/max/step pass through to Radix rather than clamping values yourself.",
    ],
    donts: [
      "Don't rely on Slider alone to communicate the current value — it has no built-in readout.",
      "Don't override the thumb or track colours via className; they come from --s-color-line-brand / --s-color-line-default.",
      "Don't build a second slider implementation for a range use case — this one already supports N thumbs via value.length.",
    ],
  },
}
