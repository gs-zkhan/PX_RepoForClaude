// -----------------------------------------------------------------------------
// Pure logic for RteField — extracted so it can be unit-tested directly,
// matching this repo's existing convention (src/lib/color.ts) rather than
// requiring a DOM-rendering test harness this repo does not otherwise use.
// -----------------------------------------------------------------------------

/** No maxLength set means there is no limit to exceed. */
function exceedsMaxLength(textLength: number, maxLength: number | undefined): boolean {
  if (maxLength === undefined) return false
  return textLength > maxLength
}

/** Save is only ever enabled once the field has real, non-whitespace content. */
function hasRealContent(text: string): boolean {
  return text.trim().length > 0
}

// CORRECTED (design-owner review): text alignment moved from a permanently
// disabled, visual-only toolbar button to a real, implemented control. Only
// Left/Center/Right are offered — this repo's icon set has no
// `text-align-justify` glyph (confirmed via a full icon-inventory audit;
// the only "justify"-named asset, `align-justified`, belongs to a
// different, layout-alignment icon family, not text alignment), so Justify
// is deliberately omitted rather than approximated with the wrong icon.
const ALIGN_VALUES = ["left", "center", "right"] as const
type TextAlignValue = (typeof ALIGN_VALUES)[number]

const ALIGN_COMMAND: Record<TextAlignValue, string> = {
  left: "justifyLeft",
  center: "justifyCenter",
  right: "justifyRight",
}

function getAlignCommand(value: TextAlignValue): string {
  return ALIGN_COMMAND[value]
}

export { exceedsMaxLength, hasRealContent, getAlignCommand, ALIGN_VALUES }
export type { TextAlignValue }
