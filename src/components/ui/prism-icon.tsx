import * as React from "react"

import { cn } from "@/lib/utils"

type PrismIconSize = 16 | 24 | 32 | 48 | 64

// "filled" is a separate asset set under src/assets/icons/filled/{16,24}/ —
// solid status glyphs (success-filled, warning-filled, danger-filled,
// information-filled) distinct from the default line-icon set. Only 16/24
// exist in that folder.
type PrismIconStyle = "line" | "filled"

type PrismIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string
  /**
   * Rendered visual size in pixels. Accepts any number for cases where Figma
   * specs an intermediate size (e.g. 20px tab icons). If it's not one of the
   * on-disk PrismIconSize values, `sourceSize` must be set to pick the folder.
   */
  size?: PrismIconSize | number
  /**
   * Source asset folder size. Only required when the SVG lives in a different
   * folder than the desired rendered size.
   * Example: a 24px SVG rendered at 16px:
   *   <PrismIcon name="search" sourceSize={24} size={16} />
   */
  sourceSize?: PrismIconSize
  /** "filled" looks up src/assets/icons/filled/{size}/{name}.svg instead of the line set. */
  iconStyle?: PrismIconStyle
  decorative?: boolean
  label?: string
}

// Eager: all 441 icons (~1.8MB raw text) are inlined into the module graph
// at build/dev time — zero runtime network requests, so no per-icon fetch
// race and no silent "icon never arrived" failures (each glob entry used to
// be a lazy dynamic import, meaning every rendered icon fired its own
// `?import&raw` HTTP request; a page with many icons could fire hundreds of
// concurrent requests, and any that stalled or dropped left that icon blank
// forever since there was no retry).
const iconModules = import.meta.glob<string>(
  "/src/assets/icons/**/*.svg",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>

const preparedIconCache = new Map<string, string>()

function prepareSvg(svg: string) {
  return svg
    .replace(/\swidth="[^"]*"/i, "")
    .replace(/\sheight="[^"]*"/i, "")
    .replace(
      "<svg",
      '<svg width="100%" height="100%" focusable="false"'
    )
}

function PrismIcon({
  name,
  size = 24,
  sourceSize,
  iconStyle = "line",
  decorative = true,
  label,
  className,
  style,
  ...props
}: PrismIconProps) {
  // sourceSize overrides the folder lookup; size controls rendered dimensions
  const folderSize = sourceSize ?? size
  const path =
    iconStyle === "filled"
      ? `/src/assets/icons/filled/${folderSize}/${name}.svg`
      : `/src/assets/icons/${folderSize}/${name}.svg`

  let source = preparedIconCache.get(path)

  if (source === undefined) {
    const raw = iconModules[path]

    if (raw === undefined) {
      console.warn(`Prism icon not found: ${path}`)
    } else {
      source = prepareSvg(raw)
      preparedIconCache.set(path, source)
    }
  }

  return (
    <span
      data-slot="prism-icon"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label ?? name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        "[&_svg]:block",
        className
      )}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      dangerouslySetInnerHTML={
        source ? { __html: source } : undefined
      }
      {...props}
    />
  )
}

export { PrismIcon }
export type { PrismIconProps, PrismIconSize, PrismIconStyle }
export type PrismIconName = string
