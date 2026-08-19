import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import type { InputControlRecipe } from "@/components/ui/input"
import { PrismIcon } from "@/components/ui/prism-icon"

// SearchBar composes Input — Input owns the complete textfield visual recipe.
// SearchBar owns: Figma size API, search icon slot, clear behaviour,
// size→controlRecipe mapping, adornment declarations, shape, search surface.
//
// Public size API uses ascending pixel order (small=32, medium=36, large=40).
// Figma token names (medium/xlarge/large) do not follow ascending order —
// see tokens/C_Default.tokens.json search/height/* for the source values.
// "xxlarge" (40px) is identical to "large" and is not exposed.

type SearchBarSize = "small" | "medium" | "large"

// Maps clean public sizes to Input's internal composition recipe.
// SearchBar is the only intended consumer of "search-*" controlRecipe values.
const sizeRecipe: Record<SearchBarSize, InputControlRecipe> = {
  small:  "search-medium",   // --c-search-height-medium  = 32px (Figma: "medium")
  medium: "search-xlarge",   // --c-search-height-xlarge  = 36px (Figma: "xlarge")
  large:  "search-large",    // --c-search-height-large   = 40px (Figma: "large"/"xxlarge")
}

type SearchBarProps = {
  size?: SearchBarSize
  /** Pill-shaped radius when true. Delegates to Input shape="pill". */
  rounded?: boolean
  /**
   * Inline=True/False (same Figma boolean property as Text Field/Dropdown/
   * Date Picker) — no border/background until Hover/Focus. Table cells,
   * dense list/panel contexts (e.g. PEC Dropdown column search) only —
   * never in a standalone search context.
   */
  inline?: boolean
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  /** When provided, shows a clear button while value is non-empty. */
  onClear?: () => void
} & Omit<React.ComponentProps<"input">, "size" | "type">

function SearchBar({
  size = "medium",  // 36px — public API default (Figma "xlarge")
  rounded = false,
  inline = false,
  value,
  defaultValue,
  placeholder = "Search…",
  disabled,
  onChange,
  onClear,
  className,
  ...props
}: SearchBarProps) {
  const hasClear = Boolean(onClear && value)

  return (
    <div className="relative flex w-full items-center">
      <Input
        type="search"
        controlRecipe={sizeRecipe[size]}
        trailingAdornment={24}
        shape={rounded ? "pill" : "default"}
        surface="search"
        inline={inline}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        className={className}
        {...props}
      />

      {/*
        Trailing icon slot, right-aligned per --c-search-padding-right (8px).
        Search icon and Clear button occupy the same slot — Clear replaces
        the search icon once a value is present, they never show together.
      */}
      {hasClear ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          tabIndex={-1}
          className={cn(
            "absolute flex items-center justify-center",
            "right-[var(--c-search-padding-right)]",
            "text-[var(--c-search-icon-default)]",
            "hover:text-[var(--s-icon-color-hover)]",
            "outline-none focus-visible:shadow-[var(--e-shadow-focus)] rounded",
          )}
        >
          <PrismIcon name="remove" size={16} />
        </button>
      ) : (
        <span
          className={cn(
            "pointer-events-none absolute flex items-center",
            "right-[var(--c-search-padding-right)]",
            "text-[var(--c-search-icon-default)]",
            disabled && "text-[var(--c-search-icon-disabled)]",
          )}
        >
          <PrismIcon name="search" size={24} />
        </span>
      )}
    </div>
  )
}

export { SearchBar }
export type { SearchBarProps, SearchBarSize }
