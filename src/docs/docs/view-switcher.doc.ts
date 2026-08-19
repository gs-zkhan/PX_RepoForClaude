import type { ComponentDoc } from "@/docs/types"

// Documents the REAL ViewSwitcher API in this repo. ViewSwitcher, Views and
// ViewSelector are three distinct components — do not conflate them beyond
// the one-sentence disambiguation below; each is documented only on its own
// real API.
export const viewSwitcherDoc: ComponentDoc = {
  slug: "view-switcher",
  name: "View Switcher",
  status: "stable",
  description: "A pill-style toggle group for switching between 2-3 fixed layout modes of the same content, e.g. Chart / Table / List.",
  figmaNodeId: "2799:31827",
  sourcePath: "src/components/ui/view-switcher.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "ViewSwitcher renders a pill container (radius/full) with 2px padding; the active tab gets a white background and shadow/100 elevation, selected immediately on click with no hover state. It is for fixed layout modes within the same page context — not for named/user-saved views (use ViewSelector) and not for more than 3 options (use a dropdown).",
      exampleId: "view-switcher/default",
    },
    {
      id: "with-icons",
      title: "With icons",
      body:
        "Each option may carry an optional 16px `icon` alongside its label — Figma's spec allows mixing icon and no-icon options in the same switcher, so an icon is not required on every option.",
      exampleId: "view-switcher/with-icons",
    },
    {
      id: "two-options",
      title: "Two options",
      body:
        "ViewSwitcher supports as few as 2 options, not only 3. The container is always 32px tall regardless of option count; tab label typography is font.heading.xxsmall (12px SemiBold), verified via get_variable_defs rather than assumed larger.",
      exampleId: "view-switcher/two-options",
    },
  ],

  props: [
    {
      name: "options",
      type: "ViewSwitcherOption[]",
      required: true,
      description: "2-3 fixed options, each `{ value, label, icon? }`. For more than 3, use a dropdown instead of this component.",
    },
    {
      name: "value",
      type: "string",
      required: true,
      description: "The currently active option's value.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      required: true,
      description: "Called with the clicked option's value. Selection is immediate — there is no hover-preview state.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only on the outer pill container. Do not use it to change the active tab's background, radius or shadow.",
    },
  ],

  tokens: [
    "--c-view-switcher-background",
    "--c-view-switcher-padding",
    "--c-view-switcher-radius",
    "--c-view-switcher-tab-active-bg",
    "--c-view-switcher-tab-active-label",
    "--c-view-switcher-tab-inactive-label",
    "--c-view-switcher-tab-padding-h",
    "--e-shadow-100",
    "--p-space-050",
    "--s-icon-color-default",
    "--t-font-heading-xxsmall-line-height",
    "--t-font-heading-xxsmall-size",
    "--t-font-heading-xxsmall-weight",
  ],

  guidelines: {
    dos: [
      "Use ViewSwitcher only for 2-3 fixed layout modes of the same underlying content.",
      "Mix icon and no-icon options freely within one switcher, per Figma's own spec.",
      "Keep `value` controlled from state and update it in `onValueChange`.",
    ],
    donts: [
      "Don't use ViewSwitcher for named/user-saved views — that's ViewSelector.",
      "Don't use ViewSwitcher for a labeled filter control — that's Views.",
      "Don't add a 4th option or a hover state — swap to a dropdown once there are more than 3 options; selection is immediate by design.",
    ],
  },
}
