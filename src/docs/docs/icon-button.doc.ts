import type { ComponentDoc } from "@/docs/types"

// Documents the real IconButton API. Its own header comment says it is a
// "PX code-system extension — not a Prism Figma component", so figmaNodeId is
// intentionally omitted.
//
// The header also records a real token-ownership bug: this component used to
// reference --c-icon-button-* tokens that were documented but never actually
// generated into prism-generated.css. Since `color` is inherited, every
// undefined var() call silently fell through to the ambient text colour
// instead of erroring, so every instance rendered the wrong, always-neutral
// colour regardless of state. It now uses the verified --c-icon-color-* set
// where a matching state exists, falling back to the semantic
// --s-icon-color-*/--s-color-surface-* tier per the token-ownership priority
// order (component -> semantic -> primitive) where no component token exists
// yet (disabled content colour, all background states, radius).
export const iconButtonDoc: ComponentDoc = {
  slug: "icon-button",
  name: "Icon Button",
  status: "stable",
  description: "A 24px square button rendering a single icon glyph, with no visible label.",
  sourcePath: "src/components/ui/icon-button.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Renders a 24x24 button box with the icon centered inside, at the semantic --c-icon-color-default content colour. `label` is required and becomes the accessible name via aria-label — there is no visible text.",
      exampleId: "icon-button/default",
    },
    {
      id: "icon-size",
      title: "Icon size",
      body:
        "`iconSize` (16 or 24, default 24) scales only the glyph — the 24px button box never changes. Use 16 where Figma binds icon/size/016 on a compact nav/stepper control, such as the Date Filter's fiscal-year nav and rolling-window stepper.",
      exampleId: "icon-button/icon-size",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Disabled removes pointer events and switches the icon colour to the semantic --s-icon-color-disabled token, since no dedicated disabled content-colour component token exists yet.",
      exampleId: "icon-button/disabled",
    },
  ],

  props: [
    {
      name: "icon",
      type: "PrismIconName",
      required: true,
      description: "The glyph to render.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: "Accessible name, applied as aria-label. There is no visible text label.",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disables the button and applies the disabled icon colour.",
    },
    {
      name: "iconSize",
      type: "16 | 24",
      defaultValue: "24",
      description:
        "Rendered glyph size. The 24px button box is unchanged — only the glyph scales. Pass 16 for compact nav/stepper controls.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the button element.",
    },
  ],

  tokens: [
    "--c-icon-color-default",
    "--c-icon-color-hover",
    "--e-shadow-focus",
    "--p-radius-100",
    "--s-color-surface-empty",
    "--s-color-surface-muted",
    "--s-color-surface-sunken",
    "--s-color-text-default",
    "--s-icon-color-disabled",
  ],

  guidelines: {
    dos: [
      "Always pass a real, specific `label` — it is the button's only accessible name.",
      "Use `iconSize={16}` only for compact nav/stepper controls that Figma explicitly binds to icon/size/016; leave every other instance at the 24px default.",
      "Prefer the verified --c-icon-color-* / --s-icon-color-* / --s-color-surface-* tokens this component already uses over adding new ones.",
    ],
    donts: [
      "Don't resurrect the old --c-icon-button-* token names — they were documented but never generated, and using them again would silently reintroduce the always-neutral-colour bug this component was fixed for.",
      "Don't build a bespoke icon-only button from a native <button> with utility classes — compose this component.",
      "Don't change the 24px button box to fit a different icon size — only the inner glyph should scale via `iconSize`.",
    ],
  },
}
