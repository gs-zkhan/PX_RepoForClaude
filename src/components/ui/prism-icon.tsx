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

type SvgLoader = () => Promise<string>

const iconModules = import.meta.glob<string>(
  "/src/assets/icons/**/*.svg",
  {
    query: "?raw",
    import: "default",
  }
) as Record<string, SvgLoader>

const iconCache = new Map<string, string>()

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
  const [source, setSource] = React.useState<string | undefined>(
    () => iconCache.get(path)
  )

  React.useEffect(() => {
    let active = true
    const loader = iconModules[path]

    if (!loader) {
      console.warn(`Prism icon not found: ${path}`)
      setSource(undefined)
      return
    }

    const cached = iconCache.get(path)

    if (cached) {
      setSource(cached)
      return
    }

    loader()
      .then((svg) => {
        const prepared = prepareSvg(svg)
        iconCache.set(path, prepared)

        if (active) {
          setSource(prepared)
        }
      })
      .catch((error) => {
        console.error(`Failed to load Prism icon: ${path}`, error)
      })

    return () => {
      active = false
    }
  }, [path])

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
