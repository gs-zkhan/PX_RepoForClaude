import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Spinner — Figma "Spinner Loader 🟢" (node 20:20, Prism V1 - ShadCN).
//
// Indeterminate circular loading indicator. Track is a full circle (2px
// stroke, color/line/default); arc is a 270°-visible open path (2px stroke,
// round cap, color/line/brand) that rotates 360° continuously, 0.8s linear
// infinite. No dedicated component tokens per Figma's own spec — "uses
// Semantic and Primitive directly" (verified: color/neutral/400 and
// color/action/primary/default resolve to the exact hex our --s-color-line-*
// tokens already use).
//
// Sizes: xs(16) — inline button loading only. s(24) — inline table/list
// cell. m(32) — DEFAULT, section-level (panels/cards/drawers), use when
// unsure. l(48) — full-page/large content area. xl(56) — hero-level (modal
// overlay, onboarding). Never use xs/s as a standalone section or page
// loader (Figma's own "When NOT to use" rule).
//
// Use Spinner only for indeterminate/action-triggered loading (button
// submit, API call, search). When completion % is known, use Progress Bar.
// When the content layout is known, use Skeleton Loader instead.
// -----------------------------------------------------------------------------

type SpinnerSize = "xs" | "s" | "m" | "l" | "xl"

const SIZE_PX: Record<SpinnerSize, number> = {
  xs: 16,
  s: 24,
  m: 32,
  l: 48,
  xl: 56,
}

const RADIUS = 10
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_LENGTH = CIRCUMFERENCE * 0.75 // 270° of the 360° circle

type SpinnerProps = {
  size?: SpinnerSize
  /** Visually hidden label for screen readers, e.g. "Loading results". */
  label?: string
  className?: string
}

function Spinner({ size = "m", label = "Loading…", className }: SpinnerProps) {
  const px = SIZE_PX[size]

  return (
    <span role="status" aria-live="polite" className={cn("inline-flex", className)}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="animate-spin [animation-duration:1s]"
        style={{ transformOrigin: "center" }}
      >
        <circle cx="12" cy="12" r={RADIUS} stroke="var(--s-color-line-default)" strokeWidth="2" />
        <circle
          cx="12"
          cy="12"
          r={RADIUS}
          stroke="var(--s-color-line-brand)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { Spinner }
export type { SpinnerProps, SpinnerSize }
