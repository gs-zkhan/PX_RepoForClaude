import type { ComponentDoc } from "@/docs/types"

// Documents all three exports from modal.tsx together — Modal, ModalFooter
// and ModalConfirmation are separate components but belong on one page, the
// same way this file composes them (ModalFooter as a sibling inside Modal's
// children; ModalConfirmation as its own structurally distinct variant).
export const modalDoc: ComponentDoc = {
  slug: "modal",
  name: "Modal",
  status: "stable",
  description:
    "A Radix Dialog-backed modal system: Modal (header + body), ModalFooter (flush action row) and ModalConfirmation (icon + message + inline actions).",
  figmaNodeId: "20:37",
  sourcePath: "src/components/ui/modal.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Modal is built on @radix-ui/react-dialog: it locks focus, sets role=\"dialog\" and aria-modal=\"true\", and ESC dismisses. Width is fixed per size (Large 904px / Medium 712px / Small 424px, default Medium) while height always grows with content — Figma explicitly forbids internal scrolling. The header is 56px tall with no description, 72px with one. Compose ModalFooter as a sibling inside Modal's children, matching Figma's own two-separate-components structure — Modal renders only its overlay, header and close icon.",
      exampleId: "modal/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Three sizes set with `size`: Large (904px), Medium (712px, default) and Small (424px). Pass the same `size` to ModalFooter so its button sizing and height track the modal.",
      exampleId: "modal/sizes",
    },
    {
      id: "footer-actions",
      title: "Footer actions",
      body:
        "ModalFooter renders up to three actions: `tertiaryAction` pinned to the far left, `secondaryAction` and `primaryAction` grouped on the right. All three are optional and independently omissible — an empty slot on the left collapses to a spacer rather than shifting the right group. Footer height is 64px/48px/40px for Large/Medium/Small (verified against live Figma geometry, not the file's prose, which is inconsistent) and sits flush below the modal body with only an upward inverse shadow separating them — no top border.",
      exampleId: "modal/footer-actions",
    },
    {
      id: "confirmation",
      title: "Confirmation variant",
      body:
        "ModalConfirmation is a structurally distinct component, not a branch of Modal — it has no header bar, no separate footer component and no close icon, and per Figma's own rule must be dismissed via its action buttons only. It shows a 64px circular icon (success or danger), a title, a description, and an inline button row.",
      exampleId: "modal/confirmation",
    },
  ],

  props: [
    {
      name: "Modal: open",
      type: "boolean",
      required: true,
      description: "Controls visibility.",
    },
    {
      name: "Modal: onOpenChange",
      type: "(open: boolean) => void",
      required: true,
      description: "Called on close via ESC, overlay click, or the close icon.",
    },
    {
      name: "Modal: size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"medium"',
      description: "Fixed width: 424 / 712 / 904px. Height always grows with content.",
    },
    {
      name: "Modal: title",
      type: "string",
      required: true,
      description: "Rendered as the Dialog title in the 56/72px header.",
    },
    {
      name: "Modal: description",
      type: "string",
      description: "When present, grows the header to 72px and renders below the title.",
    },
    {
      name: "Modal: children",
      type: "React.ReactNode",
      description: "Body content, plus a sibling ModalFooter if the modal needs actions.",
    },
    {
      name: "Modal: className",
      type: "string",
      description: "Placement/override escape hatch on the Dialog content element.",
    },
    {
      name: "ModalFooter: size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"medium"',
      description: "Sets footer height (40/48/64px) and the button size used for each action.",
    },
    {
      name: "ModalFooter: tertiaryAction",
      type: "ModalFooterAction | undefined",
      description: "{ label, onClick, disabled? } rendered as a tertiary button pinned to the far left.",
    },
    {
      name: "ModalFooter: secondaryAction",
      type: "ModalFooterAction | undefined",
      description: "{ label, onClick, disabled? } rendered as a secondary button in the right-hand group.",
    },
    {
      name: "ModalFooter: primaryAction",
      type: "ModalFooterAction | undefined",
      description: "{ label, onClick, disabled? } rendered as a primary button in the right-hand group.",
    },
    {
      name: "ModalFooter: className",
      type: "string",
      description: "Placement/override escape hatch on the footer row.",
    },
    {
      name: "ModalConfirmation: open",
      type: "boolean",
      required: true,
      description: "Controls visibility.",
    },
    {
      name: "ModalConfirmation: onOpenChange",
      type: "(open: boolean) => void",
      required: true,
      description: "Called on close. In practice, only the action buttons should trigger this — no close icon is rendered.",
    },
    {
      name: "ModalConfirmation: variant",
      type: '"success" | "danger"',
      defaultValue: '"success"',
      description: "Selects the icon (success-filled / danger-filled) and its subtlest background tint.",
    },
    {
      name: "ModalConfirmation: title",
      type: "string",
      required: true,
      description: "Confirmation headline.",
    },
    {
      name: "ModalConfirmation: description",
      type: "string",
      required: true,
      description: "Supporting message below the title.",
    },
    {
      name: "ModalConfirmation: secondaryAction",
      type: "ModalFooterAction | undefined",
      description: "Optional secondary button in the inline action row.",
    },
    {
      name: "ModalConfirmation: primaryAction",
      type: "ModalFooterAction",
      required: true,
      description: "Primary button in the inline action row — always present, since there's no other dismiss path.",
    },
    {
      name: "ModalConfirmation: className",
      type: "string",
      description: "Placement/override escape hatch on the Dialog content element.",
    },
  ],

  tokens: [
    "--c-modal-font-line-height",
    "--c-modal-font-size",
    "--c-modal-font-weight",
    "--e-shadow-300",
    "--e-shadow-inverse",
    "--p-radius-200",
    "--p-radius-full",
    "--p-space-200",
    "--p-space-300",
    "--p-space-400",
    "--s-color-line-default",
    "--s-color-overlay-backdrop",
    "--s-color-status-danger-subtlest",
    "--s-color-status-success-subtlest",
    "--s-color-surface-default",
    "--s-color-text-default",
    "--s-color-text-subtlest",
  ],

  guidelines: {
    dos: [
      "Compose ModalFooter as a sibling inside Modal's children, matching Figma's own two-component structure.",
      "Pass the same `size` to Modal and ModalFooter so button sizing and footer height stay in sync.",
      "Use ModalConfirmation only for a terminal success/danger message dismissed by its own buttons — never add a close icon to it.",
      "Let content height grow naturally; Modal never scrolls internally per Figma's own rule.",
    ],
    donts: [
      "Don't add a scrollable body inside Modal — resize content or split into steps instead.",
      "Don't build a bespoke confirmation dialog from Modal + manual icon/button layout — use ModalConfirmation.",
      "Don't add a top border to ModalFooter; separation from the body comes only from the upward inverse shadow.",
      "Don't restyle Button instances inside ModalFooter or ModalConfirmation via className — pass `disabled` or change the action instead.",
    ],
  },
}
