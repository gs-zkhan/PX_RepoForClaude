import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import { IconButton } from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// Banner — Figma "Banner · Alert 🟢" (node 1273:9, Prism V1 - ShadCN).
//
// Persistent, page- or section-level feedback that requires user awareness.
// Unlike Toast, Banner never auto-dismisses — it stays until the user
// dismisses it or the underlying condition is resolved. "Page Level" vs
// "Section Level" (Figma's own Type variants) is a placement decision, not a
// visual one — verified via screenshot: both render identically. Callers
// place a full-width Banner below the page header for page-level use, or
// inside a card/panel for section-level use; this component owns no
// placement/width opinion of its own.
//
// Sizes: Small — DEFAULT, single-line message only. Large — only when a
// description or CTA action is needed; never use Large when one sentence
// suffices (Figma's own rule).
//
// Icon uses the dedicated "filled" status icon set (success/warning/danger/
// information-filled), distinct from the default line-icon set — see the
// `iconStyle` prop added to PrismIcon for this.
//
// Do not stack more than 2 banners simultaneously (Figma's own rule) —
// caller's responsibility.
// -----------------------------------------------------------------------------

type BannerVariant = "success" | "warning" | "danger" | "information"

const VARIANT_ICON: Record<BannerVariant, string> = {
  success: "success-filled",
  warning: "warning-filled",
  danger: "danger-filled",
  information: "information-filled",
}

const VARIANT_BACKGROUND: Record<BannerVariant, string> = {
  success: "bg-[var(--c-banner-success-background)]",
  warning: "bg-[var(--c-banner-warning-background)]",
  danger: "bg-[var(--c-banner-danger-background)]",
  information: "bg-[var(--c-banner-information-background)]",
}

const VARIANT_BORDER: Record<BannerVariant, string> = {
  success: "border-[var(--c-banner-success-border)]",
  warning: "border-[var(--c-banner-warning-border)]",
  danger: "border-[var(--c-banner-danger-border)]",
  information: "border-[var(--c-banner-information-border)]",
}

const VARIANT_SHADOW: Record<BannerVariant, string> = {
  success: "shadow-[var(--e-shadow-green-100)]",
  warning: "shadow-[var(--e-shadow-yellow-100)]",
  danger: "shadow-[var(--e-shadow-red-100)]",
  information: "shadow-[var(--e-shadow-blue-100)]",
}

const VARIANT_ROLE: Record<BannerVariant, "alert" | "status"> = {
  success: "status",
  warning: "status",
  danger: "alert",
  information: "status",
}

type BannerAction = {
  label: string
  onClick: () => void
}

type BannerBaseProps = {
  variant?: BannerVariant
  onDismiss?: () => void
  /**
   * Right-aligned action button (Figma's "Controls=Button" variant). Sits at
   * the top-right on Large so it's aligned with the title; sits vertically
   * centered on Small. Common uses: Undo, Retry, Review changes.
   */
  action?: BannerAction
  className?: string
}

type BannerSmallProps = BannerBaseProps & {
  size?: "small"
  message: string
}

type BannerLargeProps = BannerBaseProps & {
  size: "large"
  title: string
  description?: string
}

type BannerProps = BannerSmallProps | BannerLargeProps

function Banner(props: BannerProps) {
  const { variant = "information", onDismiss, action, className } = props
  const isLarge = props.size === "large"

  return (
    <div
      role={VARIANT_ROLE[variant]}
      aria-live={VARIANT_ROLE[variant] === "alert" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-[var(--p-space-200)]",
        "rounded-[var(--c-banner-radius)] border p-[var(--c-banner-padding)]",
        VARIANT_BACKGROUND[variant],
        VARIANT_BORDER[variant],
        VARIANT_SHADOW[variant],
        className
      )}
    >
      <PrismIcon
        name={VARIANT_ICON[variant]}
        iconStyle="filled"
        size={24}
        decorative
        className="mt-0.5 shrink-0"
      />

      {isLarge ? (
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--p-space-100)]">
          <p className="text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)] text-[var(--c-banner-content-title)]">
            {(props as BannerLargeProps).title}
          </p>
          {(props as BannerLargeProps).description ? (
            <p className="text-[length:var(--t-banner-font-size)] leading-[var(--t-banner-font-line-height)] text-[var(--c-banner-content-body)]">
              {(props as BannerLargeProps).description}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="min-w-0 flex-1 self-center text-[length:var(--t-banner-font-size)] leading-[var(--t-banner-font-line-height)] text-[var(--c-banner-content-title)]">
          {(props as BannerSmallProps).message}
        </p>
      )}

      {action ? (
        <Button
          variant="secondary"
          size="small"
          onClick={action.onClick}
          className={cn("shrink-0", isLarge ? "mt-0.5" : "self-center")}
        >
          {action.label}
        </Button>
      ) : null}

      {onDismiss ? (
        <IconButton
          icon="cancel"
          label="Dismiss banner"
          onClick={onDismiss}
          className={cn("shrink-0", isLarge ? "mt-0.5" : "self-center")}
        />
      ) : null}
    </div>
  )
}

export { Banner }
export type { BannerProps, BannerVariant, BannerAction }
