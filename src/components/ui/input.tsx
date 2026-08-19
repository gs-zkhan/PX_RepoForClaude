import * as React from "react"

import { cn } from "@/lib/utils"

type InputAdornmentSize = 16 | 24

/**
 * Internal composition API for height selection.
 * "textfield" is the default and the only value for standard Text Field usage.
 * "search-*" variants are reserved for SearchBar — product screens must use
 * <SearchBar> rather than passing search recipes to <Input> directly.
 */
type InputControlRecipe =
  | "textfield"
  | "search-medium"
  | "search-large"
  | "search-xlarge"
  | "search-xxlarge"

// Omit native HTML `size` (number, controls visible char width) — replaced below
type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  /**
   * Internal composition API — intended for SearchBar only.
   * Defaults to "textfield" which uses --c-textfield-height-large (32px).
   * Do not pass search-* recipes from product screens; use <SearchBar> instead.
   */
  controlRecipe?: InputControlRecipe
  /**
   * Text Field size — Large (32px, DEFAULT) or Small (24px, table-cell inline
   * edit / PEC search only). Only applies when controlRecipe is "textfield".
   */
  size?: "large" | "small"
  /**
   * Success state — mirrors `aria-invalid` for the error state. Sets
   * border/content to --c-textfield-border-success / content-success.
   */
  success?: boolean
  /**
   * Inline=True (Figma boolean property) — removes border/background so the
   * field blends into its container surface. Border still appears on
   * Hover/Focus/Error. Table cells, inline editing, dense UI contexts only —
   * never in a standalone form.
   */
  inline?: boolean
  /**
   * Pixel size of the leading icon. Input applies left padding to clear it.
   * 16 → pl-9 (36px)  |  24 → pl-10 (40px)
   * Icon positioning (left-3) is owned by the composing component.
   */
  leadingAdornment?: InputAdornmentSize
  /**
   * Pixel size of the trailing action. Input applies right padding to clear it.
   * 16 → pr-8 (32px)  |  24 → pr-10 (40px)
   * Button positioning (right-2) is owned by the composing component.
   */
  trailingAdornment?: InputAdornmentSize
  /** "pill" uses --p-radius-full. Defaults to "default" (--c-textfield-radius). */
  shape?: "default" | "pill"
  /**
   * Selects the component token family for radius/padding/border/background/
   * content/typography. "search" uses --c-search-* (SearchBar only).
   */
  surface?: "textfield" | "search"
}

// Height per recipe — "textfield" is size-dependent (Large/Small); "search-*" use Search tokens
const textfieldHeight = {
  large: "h-[var(--c-textfield-height-large)]",  // 32px — DEFAULT
  small: "h-[var(--c-textfield-height-small)]",  // 24px — table cell inline edit / PEC search only
}

const textfieldPaddingVertical = {
  large: "py-[var(--c-textfield-padding-vertical-large)]",
  small: "py-[var(--c-textfield-padding-vertical-small)]",
}

const searchRecipeHeight: Partial<Record<InputControlRecipe, string>> = {
  "search-medium":  "h-[var(--c-search-height-medium)]",    // 32px — Search token
  "search-large":   "h-[var(--c-search-height-large)]",     // 40px
  "search-xlarge":  "h-[var(--c-search-height-xlarge)]",    // 36px
  "search-xxlarge": "h-[var(--c-search-height-xxlarge)]",   // 40px (same value as search-large)
}

// Left padding: icon at left-3 (12px) + icon width + gap
const leadingPadding: Record<InputAdornmentSize, string> = {
  16: "pl-9",   // 12 + 16 + 8 = 36px
  24: "pl-10",  // 12 + 24 + 4 = 40px
}

// Right padding: action at right-2 (8px) + icon width + gap
const trailingPadding: Record<InputAdornmentSize, string> = {
  16: "pr-8",   // 8 + 16 + 8 = 32px
  24: "pr-10",  // 8 + 24 + 8 = 40px
}

function Input({
  className,
  type,
  controlRecipe = "textfield",
  size = "large",
  success = false,
  inline = false,
  leadingAdornment,
  trailingAdornment,
  shape = "default",
  surface = "textfield",
  ...props
}: InputProps) {
  const isTextfield = controlRecipe === "textfield"
  const isSearch = surface === "search"

  return (
    <input
      type={type}
      data-slot="input"
      data-state={success ? "success" : undefined}
      className={cn(
        "flex w-full border outline-none transition-colors",
        // Height — Text Field is size-dependent; search recipes are fixed
        isTextfield ? textfieldHeight[size] : searchRecipeHeight[controlRecipe],
        // Radius
        shape === "pill"
          ? "rounded-[var(--p-radius-full)]"
          : isSearch
            ? "rounded-[var(--c-search-radius-default)]"
            : "rounded-[var(--c-textfield-radius)]",
        // Horizontal padding — adornment offsets or component defaults
        leadingAdornment
          ? leadingPadding[leadingAdornment]
          : isSearch
            ? "pl-[var(--c-search-padding-left)]"
            : "pl-[var(--c-textfield-padding-left)]",
        trailingAdornment
          ? trailingPadding[trailingAdornment]
          : isSearch
            ? "pr-[var(--c-search-padding-right)]"
            : "pr-[var(--c-textfield-padding-right)]",
        isTextfield
          ? textfieldPaddingVertical[size]
          : isSearch
            ? "py-[var(--c-search-padding-vertical)]"
            : "py-[var(--c-textfield-padding-vertical-large)]",
        // Border — Inline=True starts transparent, still shows on hover/focus/error/success
        "border-[length:var(--c-textfield-border-width)]",
        inline
          ? "border-transparent"
          : isSearch
            ? "border-[var(--c-search-border-default)]"
            : "border-[var(--c-textfield-border-default)]",
        // Background — Inline=True has no fill until an active state applies
        inline
          ? "bg-transparent"
          : isSearch
            ? "bg-[var(--c-search-background-default)]"
            : "bg-[var(--c-textfield-background-default)]",
        // Typography
        isSearch ? "text-[length:var(--c-search-font-size)]" : "text-[length:var(--c-textfield-font-size)]",
        "font-[number:var(--c-textfield-font-weight)]",
        isSearch ? "leading-[var(--c-search-font-line-height)]" : "leading-[var(--c-textfield-font-line-height)]",
        isSearch ? "text-[var(--c-search-content-value)]" : "text-[var(--c-textfield-content-value)]",
        isSearch
          ? "placeholder:text-[var(--c-search-content-placeholder)]"
          : "placeholder:text-[var(--c-textfield-content-placeholder)]",
        // Hover
        isSearch ? "hover:border-[var(--c-search-border-active)]" : "hover:border-[var(--c-textfield-border-hover)]",
        // Focus
        isSearch
          ? "focus-visible:border-[var(--c-search-border-active)]"
          : "focus-visible:border-[var(--c-textfield-border-focus)]",
        "focus-visible:ring-[length:var(--c-textfield-focus-ring-width)]",
        "focus-visible:ring-[var(--c-textfield-focus-ring-color)]",
        // Success state
        "data-[state=success]:border-[var(--c-textfield-border-success)]",
        // Disabled — surface drives background/content tokens
        "disabled:cursor-not-allowed",
        isSearch
          ? "disabled:border-[var(--c-search-border-default)]"
          : "disabled:border-[var(--c-textfield-border-disabled)]",
        isSearch
          ? "disabled:bg-[var(--c-search-background-disabled)]"
          : "disabled:bg-[var(--c-textfield-background-disabled)]",
        isSearch
          ? "disabled:text-[var(--c-search-content-disabled)]"
          : "disabled:text-[var(--c-textfield-content-disabled)]",
        isSearch
          ? "disabled:placeholder:text-[var(--c-search-content-disabled)]"
          : "disabled:placeholder:text-[var(--c-textfield-content-disabled)]",
        // Error state
        "aria-invalid:border-[var(--c-textfield-border-error)]",
        "aria-invalid:text-[var(--c-textfield-content-error)]",
        "aria-invalid:focus-visible:ring-[var(--c-textfield-content-error)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
export type { InputProps, InputAdornmentSize, InputControlRecipe }
