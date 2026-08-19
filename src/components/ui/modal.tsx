import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import { IconButton } from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// Modal system — Figma "Modal" (node 20:37), "Modal Footer" (node 2825:35377),
// "Modal Backdrop" (node 3714:19875), all Prism V1 - ShadCN. Built on
// @radix-ui/react-dialog (already installed for Third Pane) per Modal's own
// AI instructions: "locks focus... role='dialog' aria-modal='true'... ESC
// key must dismiss."
//
// "Modal Backdrop" is not a separately exported component — its entire spec
// (full-viewport, color/overlay/backdrop fill, aria-hidden, click-to-dismiss,
// no radius/shadow) maps 1:1 onto Radix's own Dialog.Overlay, which both
// `Modal` and `ModalConfirmation` render internally. Same precedent as
// Third Pane.
//
// Sizes: Large 904px, Medium 712px, Small 424px (width fixed, height grows
// with content — verified, Figma explicitly forbids internal scrolling).
// Header is 56px (microcopy off) / 72px (microcopy on) — the design team
// updated the Figma file to match this (previously the prose said "56/72px"
// while the measured instances showed 72/92px; re-verified 2026-08-06 after
// the update and the live geometry now matches the doc exactly: 56/72).
//
// `ModalFooter` is a separate component that stacks flush (0 gap) below the
// Modal body — composed by the caller as a sibling inside `<Modal>`'s
// children, matching Figma's own "two separate components" structure. Its
// real geometry is 64/48/40px tall for Large/Medium/Small — Figma's prose
// says "64px for Large/Medium" but every measured instance is 64/48/40;
// geometry wins (re-confirmed 2026-08-06: a fresh pull of the Medium symbol
// still measures 48px even though the user believed it had been updated to
// 64 — user's call was to keep 48px, matching live Figma). Radius is
// bottom-corners-only (radius/200), matching the modal's own bottom corners
// exactly since it sits flush beneath.
//
// Footer elevation: verified via get_variable_defs directly on the Footer
// symbol (not prose) — the only bound effect is shadow/inverse (an upward
// DROP_SHADOW pair), not shadow/100/top. No border variable is bound at all
// — the footer has no top border in Figma, only the upward shadow separates
// it from the body above.
//
// `ModalConfirmation` is a structurally distinct variant (icon + title +
// subtitle + inline button row, no header, no separate footer, no close
// icon — "must be dismissed via its action buttons only") — implemented as
// its own component rather than a branch of `Modal`.
// -----------------------------------------------------------------------------

type ModalSize = "small" | "medium" | "large"

const SIZE_WIDTH: Record<ModalSize, string> = {
  small: "424px",
  medium: "712px",
  large: "904px",
}

const FOOTER_BUTTON_SIZE: Record<ModalSize, "small" | "medium" | "large"> = {
  small: "small",
  medium: "medium",
  large: "large",
}

function ModalOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="modal-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[var(--s-color-overlay-backdrop)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  size?: ModalSize
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

function Modal({ open, onOpenChange, size = "medium", title, description, children, className }: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <ModalOverlay />
        <DialogPrimitive.Content
          data-slot="modal"
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none",
            "flex flex-col overflow-hidden",
            "rounded-[var(--p-radius-200)] bg-[var(--s-color-surface-default)]",
            "shadow-[var(--e-shadow-300)]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
          style={{ width: SIZE_WIDTH[size] }}
        >
          <div
            className={cn(
              "relative flex shrink-0 flex-col justify-center border-b border-[var(--s-color-line-default)] px-[var(--p-space-300)]",
              description ? "h-[72px]" : "h-14",
            )}
          >
            <DialogPrimitive.Title
              className={cn(
                "pr-8",
                "text-[length:var(--c-modal-font-size)] font-[number:var(--c-modal-font-weight)] leading-[var(--c-modal-font-line-height)]",
                "text-[var(--s-color-text-default)]"
              )}
            >
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <p className="pr-8 text-sm leading-4 text-[var(--s-color-text-subtlest)]">
                {description}
              </p>
            ) : null}
            <DialogPrimitive.Close asChild>
              <IconButton icon="cancel" label="Close" className="absolute right-[var(--p-space-300)] top-1/2 -translate-y-1/2" />
            </DialogPrimitive.Close>
          </div>

          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

type ModalFooterAction = {
  label: string
  onClick: () => void
  disabled?: boolean
}

type ModalFooterProps = {
  size?: ModalSize
  tertiaryAction?: ModalFooterAction
  secondaryAction?: ModalFooterAction
  primaryAction?: ModalFooterAction
  className?: string
}

function ModalFooter({ size = "medium", tertiaryAction, secondaryAction, primaryAction, className }: ModalFooterProps) {
  const buttonSize = FOOTER_BUTTON_SIZE[size]

  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex shrink-0 items-center justify-between",
        "rounded-b-[var(--p-radius-200)] bg-[var(--s-color-surface-default)]",
        "shadow-[var(--e-shadow-inverse)]",
        "px-[var(--p-space-300)]",
        size === "large" ? "h-16" : size === "medium" ? "h-12" : "h-10",
        className
      )}
    >
      {tertiaryAction ? (
        <Button variant="tertiary" size={buttonSize} onClick={tertiaryAction.onClick} disabled={tertiaryAction.disabled}>
          {tertiaryAction.label}
        </Button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-[var(--p-space-200)]">
        {secondaryAction ? (
          <Button variant="secondary" size={buttonSize} onClick={secondaryAction.onClick} disabled={secondaryAction.disabled}>
            {secondaryAction.label}
          </Button>
        ) : null}
        {primaryAction ? (
          <Button variant="primary" size={buttonSize} onClick={primaryAction.onClick} disabled={primaryAction.disabled}>
            {primaryAction.label}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

type ModalConfirmationVariant = "success" | "danger"

const CONFIRMATION_ICON: Record<ModalConfirmationVariant, string> = {
  success: "success-filled",
  danger: "danger-filled",
}

const CONFIRMATION_ICON_BG: Record<ModalConfirmationVariant, string> = {
  success: "bg-[var(--s-color-status-success-subtlest)]",
  danger: "bg-[var(--s-color-status-danger-subtlest)]",
}

type ModalConfirmationProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: ModalConfirmationVariant
  title: string
  description: string
  secondaryAction?: ModalFooterAction
  primaryAction: ModalFooterAction
  className?: string
}

function ModalConfirmation({
  open,
  onOpenChange,
  variant = "success",
  title,
  description,
  secondaryAction,
  primaryAction,
  className,
}: ModalConfirmationProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <ModalOverlay />
        <DialogPrimitive.Content
          data-slot="modal-confirmation"
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 outline-none",
            "rounded-[var(--p-radius-200)] bg-[var(--s-color-surface-default)] p-[var(--p-space-400)]",
            "shadow-[var(--e-shadow-300)]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
        >
          <div className="flex items-center gap-[var(--p-space-200)]">
            <div className={cn("flex size-16 shrink-0 items-center justify-center rounded-[var(--p-radius-full)]", CONFIRMATION_ICON_BG[variant])}>
              {/* No 32px filled asset exists (only 16/24) — scaled up from
                  24px as a documented exception, see project_pending_exceptions.md */}
              <PrismIcon name={CONFIRMATION_ICON[variant]} iconStyle="filled" size={32} sourceSize={24} decorative />
            </div>
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title
                className={cn(
                  "text-[length:var(--c-modal-font-size)] font-[number:var(--c-modal-font-weight)] leading-[var(--c-modal-font-line-height)]",
                  "text-[var(--s-color-text-default)]"
                )}
              >
                {title}
              </DialogPrimitive.Title>
              <p className="text-sm leading-6 text-[var(--s-color-text-subtlest)]">{description}</p>
            </div>
          </div>

          <div className="mt-[var(--p-space-300)] flex items-center justify-end gap-[var(--p-space-200)]">
            {secondaryAction ? (
              <Button variant="secondary" size="large" onClick={secondaryAction.onClick} disabled={secondaryAction.disabled}>
                {secondaryAction.label}
              </Button>
            ) : null}
            <Button variant="primary" size="large" onClick={primaryAction.onClick} disabled={primaryAction.disabled}>
              {primaryAction.label}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { Modal, ModalFooter, ModalConfirmation }
export type { ModalProps, ModalSize, ModalFooterProps, ModalFooterAction, ModalConfirmationProps, ModalConfirmationVariant }
