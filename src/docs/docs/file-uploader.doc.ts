import type { ComponentDoc } from "@/docs/types"

// Documents the REAL FileUploader (+ companion FileUploaderRow) API. A
// single-file drop-zone/picker with a 2 size x 2 variant x 4 status matrix
// (hover is a CSS state, not a fifth status). Caller owns file selection,
// upload progress and cancellation via callbacks; `status` only drives what
// is rendered.
export const fileUploaderDoc: ComponentDoc = {
  slug: "file-uploader",
  name: "File Uploader",
  status: "stable",
  description: "A drag-and-drop / click-to-browse drop zone for a single file, with loading, uploaded and error states.",
  figmaNodeId: "1273:15",
  sourcePath: "src/components/ui/file-uploader.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no props, FileUploader renders the idle state: an upload icon, a label with an embedded \"browse\" link, and an optional `hint` line. Clicking or dropping a file calls `onFilesSelected(files)` — the caller decides what happens next.",
      exampleId: "file-uploader/default",
    },
    {
      id: "status",
      title: "Status",
      body:
        "`status` drives the visual state end to end: \"loading\" shows a spinner, filename and Cancel (`onCancel`); \"uploaded\" shows a file icon, filename/size and Delete (`onDelete`); \"error\" shows an error icon, filename, an optional Retry link (`onRetry`) and `errorMessage`. Hover is a CSS state layered on top of \"idle\", not a fifth status value.",
      exampleId: "file-uploader/status",
    },
    {
      id: "variant-wider",
      title: "Wider variant",
      body: "`variant=\"wider\"` lays the icon and text out in a horizontal row instead of the stacked, centred \"square\" default — for narrower side-panel contexts.",
      exampleId: "file-uploader/variant-wider",
    },
    {
      id: "sizes",
      title: "Sizes",
      body: "`size` controls the icon glyph size (64/48px for \"square\", 48/32px for \"wider\") but not the drop zone's own padding scale, which is set independently via the size-specific padding tokens.",
      exampleId: "file-uploader/sizes",
    },
    {
      id: "multi-file-row",
      title: "Multiple files",
      body:
        "FileUploaderRow is a separate, companion component for a queued-file list below the main drop zone (Figma's \"Multiple File Interaction\" symbol) — it is not a FileUploader variant, so compose the two together for multi-file flows.",
      exampleId: "file-uploader/multi-file-row",
    },
  ],

  props: [
    {
      name: "size",
      type: '"large" | "small"',
      defaultValue: '"large"',
      description: "Controls the icon glyph size.",
    },
    {
      name: "variant",
      type: '"square" | "wider"',
      defaultValue: '"square"',
      description: "\"square\" stacks icon and text, centred. \"wider\" lays them out in a horizontal row.",
    },
    {
      name: "status",
      type: '"idle" | "loading" | "uploaded" | "error"',
      defaultValue: '"idle"',
      description: "Drives the rendered icon and content row. Hover is a CSS state on top of \"idle\", not part of this union.",
    },
    {
      name: "fileName",
      type: "string",
      description: "File name shown in loading/uploaded/error states.",
    },
    {
      name: "fileSize",
      type: "string",
      description: "File size label (e.g. \"2.4 MB\") shown in the uploaded state.",
    },
    {
      name: "errorMessage",
      type: "string",
      description: "Error message shown when `status=\"error\"`.",
    },
    {
      name: "label",
      type: "React.ReactNode",
      defaultValue: '"Drag and drop file here or browse"',
      description: "Idle-state label. If a string, the substring \"browse\" is rendered as a styled link.",
    },
    {
      name: "hint",
      type: "React.ReactNode",
      description: "Idle-state secondary hint text, e.g. accepted formats.",
    },
    {
      name: "accept",
      type: "string",
      description: "Accepted MIME types / extensions, passed to the native file input's `accept`.",
    },
    {
      name: "onFilesSelected",
      type: "(files: FileList) => void",
      description: "Called when the user selects or drops file(s).",
    },
    {
      name: "onCancel",
      type: "() => void",
      description: "Called from the loading state's Cancel action.",
    },
    {
      name: "onDelete",
      type: "() => void",
      description: "Called from the uploaded state's Delete action.",
    },
    {
      name: "onRetry",
      type: "() => void",
      description: "Called from the error state's Retry link, when provided.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables browsing/dropping and greys out the control.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the drop-zone element.",
    },
  ],

  tokens: [
    "--c-uploader-background",
    "--c-uploader-background-hover",
    "--c-uploader-background-hover-blue",
    "--c-uploader-border-default",
    "--c-uploader-border-error",
    "--c-uploader-border-hover-blue",
    "--c-uploader-content-action",
    "--c-uploader-content-browse",
    "--c-uploader-content-filesize",
    "--c-uploader-content-hint",
    "--c-uploader-content-label",
    "--c-uploader-error-text",
    "--c-uploader-gap-content",
    "--c-uploader-gap-row",
    "--c-uploader-padding-large",
    "--c-uploader-padding-row",
    "--c-uploader-padding-small",
    "--c-uploader-radius",
    "--c-uploader-row-hover-bg",
    "--e-shadow-focus",
    "--p-radius-050",
    "--p-space-050",
    "--p-space-100",
    "--s-icon-color-default",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Own file selection, upload progress and cancellation in the caller — FileUploader only reflects `status`, it does not track uploads itself.",
      "Pair `status=\"error\"` with `errorMessage` and, where retry makes sense, `onRetry`.",
      "Use FileUploaderRow alongside FileUploader for a multi-file queue, rather than rendering several FileUploader drop zones.",
    ],
    donts: [
      "Don't treat hover as a fifth `status` value — it's a CSS-only state layered on \"idle\".",
      "Don't build a bespoke drop zone with a native `<input type=\"file\">` and manual drag handlers — compose this component; the file input here is already visually hidden but keyboard-reachable.",
      "Don't skip `fileName` in loading/uploaded/error states — several state rows render nothing meaningful without it.",
    ],
  },
}
