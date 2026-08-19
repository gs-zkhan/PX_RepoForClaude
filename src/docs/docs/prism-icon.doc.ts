import type { ComponentDoc } from "@/docs/types"

export const prismIconDoc: ComponentDoc = {
  slug: "prism-icon",
  name: "Prism Icon",
  status: "stable",
  description:
    "Foundational infrastructure that loads an SVG glyph from the on-disk icon set by name and size — used by almost every other component.",
  sourcePath: "src/components/ui/prism-icon.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "PrismIcon loads its SVG via import.meta.glob against src/assets/icons/**/*.svg, keyed by `${iconStyle}/${folderSize}/${name}.svg`, and caches the raw markup after the first load. With no props beyond `name`, it renders at 24px, decorative by default.",
      exampleId: "prism-icon/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "`size` accepts the on-disk sizes (16 | 24 | 32 | 48 | 64) or any number for an intermediate Figma spec (e.g. a 20px tab icon) — in the latter case `sourceSize` must be set to pick the actual folder to load from.",
      exampleId: "prism-icon/sizes",
    },
    {
      id: "source-size",
      title: "sourceSize vs size",
      body:
        "`sourceSize` selects the asset folder independently of `size`, which only controls the rendered box. Use this when the glyph you need only exists in one folder but must render at a different pixel size than that folder implies.",
      exampleId: "prism-icon/source-size",
    },
    {
      id: "filled",
      title: "Filled style",
      body:
        "`iconStyle=\"filled\"` looks up src/assets/icons/filled/{size}/{name}.svg — a separate, solid status-glyph set (success/warning/danger/information-filled). Only 16px and 24px exist in that folder.",
      exampleId: "prism-icon/filled",
    },
    {
      id: "accessible",
      title: "Accessible icons",
      body:
        "`decorative` defaults to true (aria-hidden, no accessible name) because most icons sit beside labelled text. Set `decorative={false}` with a `label` when the icon is the only carrier of meaning — for example a standalone status glyph with no adjacent text.",
      exampleId: "prism-icon/accessible",
    },
  ],

  props: [
    {
      name: "name",
      type: "string",
      required: true,
      description: "Icon filename (without extension) inside the resolved size/style folder.",
    },
    {
      name: "size",
      type: "16 | 24 | 32 | 48 | 64 | number",
      defaultValue: "24",
      description:
        "Rendered visual size in pixels. Also used as the asset-folder lookup unless `sourceSize` is set.",
    },
    {
      name: "sourceSize",
      type: "16 | 24 | 32 | 48 | 64",
      description:
        "Source asset folder size. Only required when the SVG lives in a different folder than the desired rendered size.",
    },
    {
      name: "iconStyle",
      type: '"line" | "filled"',
      defaultValue: '"line"',
      description:
        "\"filled\" looks up src/assets/icons/filled/{size}/{name}.svg instead of the default line set. Only 16/24 exist as filled assets.",
    },
    {
      name: "decorative",
      type: "boolean",
      defaultValue: "true",
      description:
        "When true, the icon is aria-hidden with no accessible name. Set false with `label` when the icon alone carries meaning.",
    },
    {
      name: "label",
      type: "string",
      description: "Accessible name used when `decorative` is false. Falls back to `name` if omitted.",
    },
    {
      name: "className",
      type: "string",
      description: "Applied to the outer <span>; use for placement, not for resizing (use `size` instead).",
    },
  ],

  tokens: [],

  guidelines: {
    dos: [
      "Set decorative={false} with a label whenever the icon is the sole carrier of meaning, e.g. a standalone status glyph.",
      "Use `sourceSize` when the exact glyph you need only exists in a different asset folder than your target render size.",
      "Verify an icon name exists under src/assets/icons/{size} (or filled/{size}) before using it — there is no fallback glyph.",
      "Use the 16/24 filled set only for solid status glyphs (success/warning/danger/information-filled).",
    ],
    donts: [
      "Don't invent an icon name that hasn't been verified against the assets folder — it will silently render blank with a console warning.",
      "Don't use `iconStyle=\"filled\"` at 32/48/64 — no filled assets exist above 24px.",
      "Don't leave `decorative` at its default true when the icon has no adjacent text explaining it.",
      "Don't resize an icon by wrapping it in a sized container — pass `size` directly so the SVG itself scales.",
    ],
  },
}
