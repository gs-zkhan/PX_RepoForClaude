import type { ComponentDoc } from "@/docs/types"

// Documents the REAL Toggle API in this repo — a native checkbox switch, not
// a Radix primitive. Verified anatomy: 36x20 track, 16px handle, pill radius.
export const toggleDoc: ComponentDoc = {
  slug: "toggle",
  name: "Toggle",
  status: "stable",
  description: "A switch for a single binary setting that takes effect immediately, without a Save step.",
  sourcePath: "src/components/ui/toggle.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Toggle uses a native <input type=\"checkbox\" role=\"switch\"> under the hood, so form submission, keyboard toggling (Space) and screen-reader ARIA all work with zero custom wiring — there is no Radix primitive involved. `label` renders as visible text beside the track.",
      exampleId: "toggle/default",
    },
    {
      id: "checked",
      title: "Checked state",
      body:
        "Toggle is an uncontrolled-friendly input: `checked`, `defaultChecked` and `onChange` all pass straight through to the underlying input via the rest spread. Use `defaultChecked` for an uncontrolled toggle or `checked`+`onChange` to control it from state.",
      exampleId: "toggle/checked",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Set `disabled` to prevent interaction. It dims the label text and forces the track/handle to their disabled colours regardless of checked state, and disables the underlying input so it is skipped in tab order.",
      exampleId: "toggle/disabled",
    },
    {
      id: "no-label",
      title: "Without a visible label",
      body:
        "`label` is optional. Omit it when the surrounding row already provides the label text, but always pass an `aria-label` in that case so the control remains announced correctly.",
      exampleId: "toggle/no-label",
    },
  ],

  props: [
    {
      name: "label",
      type: "React.ReactNode",
      description: "Visible text rendered beside the track. Omit when a surrounding row already labels the control.",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disables the input and applies the shared disabled treatment to label, track and handle.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer <label>. Do not use it to change track or handle colours.",
    },
    {
      name: "...rest",
      type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "role" | "size">',
      description:
        "Any other native input prop — checked, defaultChecked, onChange, name, etc. — forwarded to the underlying <input type=\"checkbox\" role=\"switch\">.",
    },
  ],

  tokens: [
    "--c-switch-handle-active",
    "--c-switch-handle-disabled",
    "--c-switch-track-disabled",
    "--c-switch-track-off-default",
    "--c-switch-track-off-hover",
    "--c-switch-track-on-default",
    "--c-switch-track-on-hover",
    "--e-shadow-100",
    "--e-shadow-focus",
    "--p-radius-full",
    "--p-space-100",
    "--s-color-text-default",
    "--s-color-text-disabled",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
  ],

  guidelines: {
    dos: [
      "Use Toggle for settings that take effect immediately, with no separate Save action.",
      "Provide `aria-label` whenever `label` is omitted.",
      "Let the component's `group-has-[:checked]` state selectors drive track/handle colour — don't add your own checked-state classes.",
      "Use `defaultChecked`/`checked` per whether the toggle is uncontrolled or controlled — don't manage checked state outside the input.",
    ],
    donts: [
      "Don't reach for a Radix or custom switch primitive here — this component intentionally uses a native checkbox for zero-wiring accessibility.",
      "Don't override the track or handle size via className; the 36x20/16px anatomy is fixed and verified against Figma.",
      "Don't use Toggle for an action that requires an explicit Save/Cancel step — that's a Checkbox in a form, not a Toggle.",
    ],
  },
}
