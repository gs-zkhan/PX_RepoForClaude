import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Letter — Figma "Letter" (node 4049:1598, Prism V1 - ShadCN).
//
// A 32x32 rounded-square tile containing a single character.
//
// PURPOSE: it labels a filter criterion, so the criterion can be referenced by
// letter in advanced boolean logic — e.g. "(A and B) or (C and D)" in the
// Configure Filters modal. Confirmed by the design system owner 2026-08-07.
//
// Figma's description on this node ("Single letter avatar used as a fallback …
// Used internally by Avatar — do not place standalone") is **stale and wrong**
// — confirmed, not assumed. It also contradicts the component's own design:
// this is an 8px rounded SQUARE with a border and a brand-bordered interaction
// state, whereas Avatar is a circular, grey, borderless fallback that already
// exists as `AvatarFallback` in src/components/ui/avatar.tsx. Ignore the
// description; this component is standalone and belongs to the filter UI.
//
// Radius is not bound to a variable in Figma. The literal is 8px, which equals
// --p-radius-100, so that token is used rather than a raw value.
//
// State naming: Figma's second variant is called "Hover", but it renders a
// brand border + selected fill — that is a selected/active look, not a pointer
// hover. Exposed as `selected` so the prop describes what it means; the real
// pointer-hover behaviour is left to the composing component.
// -----------------------------------------------------------------------------

type LetterState = "default" | "selected" | "borderless"

type LetterProps = {
  /** Single character. Longer strings are not truncated — pass one character. */
  letter: string
  state?: LetterState
  className?: string
}

function Letter({ letter, state = "default", className }: LetterProps) {
  return (
    <span
      data-slot="letter"
      data-state={state}
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--p-radius-100)]",
        // Figma binds the primitive `superiority-blue/0` (#FFFFFF) on the
        // default variant but the semantic `color/surface/default` (also
        // #FFFFFF) on W/O Border. Same value, so the semantic token is used for
        // both rather than reaching for a primitive.
        "bg-[var(--s-color-surface-default)]",
        state !== "borderless" && "border",
        state === "default" && "border-[var(--s-color-line-default)]",
        state === "selected" &&
          "border-[var(--s-color-line-brand)] bg-[var(--s-color-surface-selected)]",
        "text-[length:var(--t-font-heading-xsmall-size)] font-[number:var(--t-font-heading-xsmall-weight)] leading-[var(--t-font-heading-xsmall-line-height)]",
        "text-[var(--s-color-text-subtle)]",
        className,
      )}
    >
      {letter}
    </span>
  )
}

export { Letter }
export type { LetterProps, LetterState }
