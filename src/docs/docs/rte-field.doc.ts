import type { ComponentDoc } from "@/docs/types"

// STATUS: Approved with documented exception. Design-owner visual review
// complete 2026-08-31. Visual Review: Approved. Approved for AI use: Yes,
// with documented exceptions (Font size, Font properties remain visual-only
// — see the "real-vs-visual-only" section below; Alignment and Attachment
// are functional and are NOT exceptions).
// See ai/figma-coverage.json (id component-rte-field) and
// src/components/ui/rte-field.tsx for the full evidence trail.
export const rteFieldDoc: ComponentDoc = {
  slug: "rte-field",
  name: "RTE Field",
  status: "stable",
  description:
    "APPROVED WITH DOCUMENTED EXCEPTION (2026-08-31). Rich text editor for formatted multi-line input — Default (boxed), Inline (borderless), or Floating (toolbar-only, on selection).",
  figmaNodeId: "1273:14",
  sourcePath: "src/components/ui/rte-field.tsx",

  sections: [
    {
      id: "status",
      title: "Review status (read first)",
      body:
        "Implemented against Figma page 1273:14, AI Instructions (4901:21861) and Dos/Don'ts (4901:21824). Design-owner visual review complete: Approved with documented exception, 2026-08-31. Approved for AI use: Yes, with documented exceptions — Font size and Font properties remain visible but disabled/visual-only (not claimed as functional); Text alignment and Attachment are real and functional and are explicitly NOT exceptions. See \"Real vs. visual-only controls\" below for the exact, honest scope of what native contentEditable/execCommand supports today.",
    },
    {
      id: "no-dependency",
      title: "No RTE package added — native contentEditable implementation",
      body:
        "Per explicit instruction to prefer a small repository-native implementation over installing a rich-text-editor library: this uses a native `contentEditable` region with `document.execCommand` for the formatting commands that have real, reliable cross-browser support (bold/italic/underline, ordered/unordered list, indent/outdent, link, remove-formatting). `execCommand` is a deprecated API but remains universally implemented in every evergreen browser for exactly these commands, and is the only dependency-free way to get real contentEditable formatting. If it is ever actually removed from browsers, the smallest maintainable next step is a Selection/Range-based reimplementation of just these commands — not a new dependency.",
    },
    {
      id: "real-vs-visual-only",
      title: "Real vs. visual-only controls — not silently overclaimed",
      body:
        "REAL, implemented: Bold, Italic, Underline, Bulleted list, Numbered list, Indent in/out, Link (a `window.prompt` for the URL — the smallest real implementation, not a fabricated modal), Clear formatting, Text alignment (Left/Centre/Right), and Attachment (surfaces the browser's own file selection). VISUAL-ONLY (rendered at the evidenced toolbar position, `disabled`, not wired to behaviour): Font size, Font properties. CORRECTED (design-owner review): a prior pass also left Text alignment and Attachment disabled; both are now real, per direct design-owner instruction that they must not remain disabled — see the two dedicated sections below. Font size and Font properties remain visual-only: Figma's own AI Instructions describe all four via a \"↓\" shorthand implying each opens a picker/menu, and building the two remaining real pickers (a font-size scale, a font-properties panel) was out of scope for this pass and is not claimed as working.",
    },
    {
      id: "alignment",
      title: "Text alignment — real, Left/Centre/Right only",
      body:
        "Implemented as a Popover + `RadioGroupPrimitive.Root` icon picker — the exact composition this repo already established in `DashboardWidgetChartTypeSwitcher` for a single-choice icon control behind a disclosure trigger, reused here rather than inventing a second pattern. The trigger button shows the current alignment's icon and an accessible name (\"Text alignment: Align left\", etc.); selecting an option in the popover applies the real `document.execCommand('justifyLeft'|'justifyCenter'|'justifyRight')` and closes the popover, returning focus to the trigger (Radix's own built-in behaviour). Only Left/Centre/Right are offered — this repo's icon set has `text-align-left`/`text-align-center`/`text-align-right` but no `text-align-justify` (the only \"justify\"-named asset, `align-justified`, belongs to a different, layout-alignment icon family, confirmed via a full icon-inventory audit) — Justify is omitted rather than approximated with the wrong icon. Keyboard: the trigger is a real Tab stop; the popover's `RadioGroupPrimitive` gives native Arrow-key navigation between the three options and Radix's own Escape/click-outside dismissal.",
      exampleId: "rte-field/default",
    },
    {
      id: "attachment",
      title: "Attachment — real file selection, no upload backend",
      body:
        "A hidden, native `<input type=\"file\">` triggered by the toolbar button. Selecting a file calls the caller-supplied `onAttachmentSelected(files: FileList)` — the exact `onFilesSelected`-style naming convention this repo's own `FileUploader` already uses for file-related callbacks. This component's responsibility ends at that callback: it does NOT upload, store, preview, or validate the file in any way, and no fake upload backend was implemented. The consuming application owns uploading/storing the file and any validation. When `onAttachmentSelected` is omitted, the button is disabled (the same graceful-degradation pattern as this component's other optional callbacks) rather than silently doing nothing on click. The Gallery demonstrates this with a real, user-picked file from the browser's own file picker — no binary test fixture was added to the repository.",
    },
    {
      id: "types",
      title: "Type — Default / Inline / Floating (alternative modes, not a set)",
      body:
        "Default: boxed (border+bg), toolbar always visible, optional CTA row — the primary, standalone editor surface (comment boxes, description fields, email composers). Inline: borderless, bottom-border only, toolbar hidden until Active/Filled/Hover-Elements, never has CTAs — for supplementary inputs where the form boundary is established by context (table-cell edits, card body edits) — never as the primary editor. Floating: no label, no boxed chrome, no CTA row — just the bare editable region; the toolbar itself renders in a small panel positioned near the current text selection, appearing only while a real, non-empty selection exists inside the field, dismissing on Escape/selection-clear/click-outside. Per the Dos/Don'ts: never show a Default toolbar and a Floating toolbar simultaneously — pick one context per field.",
      exampleId: "rte-field/default",
    },
    {
      id: "inline-example",
      title: "Inline — borderless, integrated",
      exampleId: "rte-field/inline",
    },
    {
      id: "floating-example",
      title: "Floating — toolbar on selection only",
      exampleId: "rte-field/floating",
    },
    {
      id: "show-ctas",
      title: "ShowCTAs — Default type only",
      body:
        "ShowCTAs=true: Cancel (secondary) + Save (primary) render right-aligned below the text area — use when the RTE is self-contained (comment widget, inline edit, card). ShowCTAs=false: no CTA row — use when a parent modal/drawer already owns Save/Cancel; never duplicate the action row. Inline and Floating never show CTAs (matches Figma's own variant set, which has no Inline/Floating × ShowCTAs=true combination). Save is disabled until the field has real, non-empty content — driven by the editable region's own text, not a separate prop the caller must track.",
    },
    {
      id: "validation-and-limit",
      title: "Validation, required, and character limit",
      body:
        "`error` sets `aria-invalid` on the editable region and renders a `role=\"alert\"` message linked via `aria-describedby`. `required` adds a visual asterisk on the label and `aria-required`. A character-count readout (`n/maxLength`) only renders when `maxLength` is actually supplied — matching the AI Instructions' own conditional (\"show counter... when maxLength is set\"), never shown unconditionally.",
      exampleId: "rte-field/validation-and-limit",
    },
    {
      id: "paste-and-placeholder",
      title: "Paste behaviour and placeholder",
      body:
        "Pasting strips all formatting — only `text/plain` from the clipboard is inserted, per the AI Instructions' Content-area note (\"strip all formatting on paste — plain text only\"). The placeholder is a real empty-state check (contentEditable has no native placeholder attribute), shown via CSS `:empty::before` and hidden the moment any content exists.",
    },
    {
      id: "read-only-disabled",
      title: "Read-only vs. Disabled",
      body:
        "Read-only: `contentEditable=false}` while content remains visible and selectable (native browser behaviour), toolbar buttons disabled — matches \"Read-only mode: disables toolbar and prevents editing, content is selectable.\" Disabled: background switches to `--s-color-surface-disabled`, content and placeholder both render in `--s-color-text-disabled`, not interactive — \"use only when editing is genuinely unavailable in context.\"",
    },
  ],

  props: [
    { name: "type", type: '"default" | "inline" | "floating"', defaultValue: '"default"', description: "Selects the anatomy — these are alternative modes, not variants meant to combine." },
    { name: "value", type: "string", required: true, description: "Controlled. The editable region's innerHTML." },
    { name: "onValueChange", type: "(html: string) => void", required: true, description: "Controlled only — no internal uncontrolled fallback." },
    { name: "label", type: "string", description: "Default/Inline only — Floating has no label per Figma's own anatomy." },
    { name: "placeholder", type: "string", defaultValue: '"Type"', description: "Shown via CSS :empty::before, not a native placeholder attribute." },
    { name: "disabled", type: "boolean", defaultValue: "false", description: "Not interactive; background switches to the disabled surface token." },
    { name: "readOnly", type: "boolean", defaultValue: "false", description: "Not editable, but content remains selectable; toolbar disabled." },
    { name: "required", type: "boolean", defaultValue: "false", description: "Adds a visual asterisk and aria-required." },
    { name: "error", type: "string", description: "Sets aria-invalid and renders a role=\"alert\" message." },
    { name: "showCtAs", type: "boolean", defaultValue: "false", description: "Default type only. Renders Cancel/Save; Save enabled only once content exists." },
    { name: "onSave / onCancel", type: "() => void", description: "Only relevant when showCtAs is true." },
    { name: "maxLength", type: "number", description: "When set, shows a character counter and hard-clamps further input." },
    { name: "onAttachmentSelected", type: "(files: FileList) => void", description: "Called with the browser's own FileList when a file is picked. The component never uploads it; disabled when omitted." },
  ],

  tokens: [
    "--s-color-line-default",
    "--s-color-action-primary-default",
    "--s-color-surface-default",
    "--s-color-surface-disabled",
    "--s-color-surface-muted",
    "--s-color-text-disabled",
    "--s-color-text-default",
    "--s-color-text-subtlest",
    "--s-color-status-danger-default",
    "--p-radius-100",
    "--p-radius-075",
    "--p-space-100",
    "--p-space-075",
    "--p-space-050",
    "--e-shadow-300",
    "--e-shadow-focus",
  ],

  guidelines: {
    dos: [
      "Use Default type for standalone rich text inputs — comment boxes, description fields, email composers.",
      "Show the Floating toolbar on text selection only, never on initial focus.",
      "Use ShowCTAs=true when the RTE is self-contained in a card or widget.",
      "Enable Save only once real content exists (Filled/Hover-Elements states).",
    ],
    donts: [
      "Don't use Inline type for primary content entry — it's for supplementary, contextually-bounded inputs only.",
      "Don't show both a Default toolbar and a Floating toolbar simultaneously.",
      "Don't use ShowCTAs=true inside a modal that already has its own footer actions.",
      "Don't use RTE Field for single-line input (use Text Field) or plain multi-line text with no formatting (use Textarea).",
      "Don't claim Font size / Font properties are functional — they remain visual-only in this implementation.",
      "Don't expect Attachment to upload anything — it only surfaces the selected FileList; your application must handle upload/storage.",
    ],
  },
}
