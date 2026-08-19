import type { ComponentDoc } from "@/docs/types"

export const spinnerDoc: ComponentDoc = {
  slug: "spinner",
  name: "Spinner",
  status: "stable",
  description:
    "An indeterminate circular loading indicator for action-triggered or unknown-duration loading.",
  figmaNodeId: "20:20",
  sourcePath: "src/components/ui/spinner.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no props, Spinner renders at size m (32px) — the section-level default (panels, cards, drawers). Use this size when unsure. The track is a full circle in --s-color-line-default; the rotating arc is a 270°-visible open path in --s-color-line-brand, spinning continuously.",
      exampleId: "spinner/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Five sizes: xs (16px, inline button loading only), s (24px, inline table/list cell), m (32px, DEFAULT, section-level), l (48px, full-page/large content area), xl (56px, hero-level such as a modal overlay or onboarding). Never use xs or s as a standalone section or page loader.",
      exampleId: "spinner/sizes",
    },
    {
      id: "with-label",
      title: "Custom label",
      body:
        "`label` is visually hidden but announced by screen readers via `aria-live=\"polite\"`. Set it to describe what is loading rather than leaving the generic \"Loading…\" default.",
      exampleId: "spinner/with-label",
    },
    {
      id: "inline-button",
      title: "Inline in a button",
      body:
        "Compose xs Spinner as a Button child to show a submitting state — Button has no built-in loading prop, so this composition is the approved pattern for button-level loading.",
      exampleId: "spinner/inline-button",
    },
  ],

  props: [
    {
      name: "size",
      type: '"xs" | "s" | "m" | "l" | "xl"',
      defaultValue: '"m"',
      description: "Pixel size (16/24/32/48/56). See Sizes for when to use each.",
    },
    {
      name: "label",
      type: "string",
      defaultValue: '"Loading…"',
      description: "Visually hidden label announced to screen readers, e.g. \"Loading results\".",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer inline-flex wrapper.",
    },
  ],

  tokens: ["--s-color-line-brand", "--s-color-line-default"],

  guidelines: {
    dos: [
      "Use size m by default for section-level loading (panels, cards, drawers) when unsure.",
      "Use xs only inside a button or other micro-interaction, never as a standalone loader.",
      "Set a descriptive `label` so screen reader users know what is loading.",
      "Use Spinner only for indeterminate or action-triggered loading (button submit, API call, search).",
    ],
    donts: [
      "Don't use xs or s as a standalone section or page loader.",
      "Don't use Spinner when completion percentage is known — use Progress Bar instead.",
      "Don't use Spinner when the content layout is already known — use Skeleton instead.",
      "Don't override the track/arc colours via className; they use --s-color-line-default / --s-color-line-brand directly (no dedicated component tokens exist per Figma's own spec).",
    ],
  },
}
