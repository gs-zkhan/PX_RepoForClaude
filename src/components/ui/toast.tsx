import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Toast — Figma "Toast Message" (node 20:38, Prism V1 - ShadCN), built on
// @radix-ui/react-toast (installed this session) for stacking/queueing,
// auto-dismiss timers, pause-on-hover, swipe-to-dismiss, and live-region ARIA.
//
// Always dark regardless of Semantic mode — toast/background and
// toast/content are Primitive aliases per Figma's own spec, not Semantic
// tokens, so they never switch with light/dark mode.
//
// Fixed 480x48px (verified via all 24 variant symbols' bounding boxes).
// Figma's own "Behaviour" text also says "Width: 320px fixed" in the same
// breath as "480px" in the Spacing row — an internal inconsistency in the
// source file. Geometry (480px, measured across every instance) is trusted
// over the contradicting prose line.
//
// Auto-dismiss per Figma's Behaviour note: 4s with no action, 8s with an
// action (Undo/CTA), never for Danger (manual dismiss only, regardless of
// action) — Danger is always role="alert" aria-live="assertive"; all other
// variants are role="status" aria-live="polite".
// -----------------------------------------------------------------------------

type ToastVariant = "success" | "warning" | "danger" | "info"

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: "success-filled",
  warning: "warning-filled",
  danger: "danger-filled",
  info: "information-filled",
}

const ToastProvider = ToastPrimitive.Provider

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed bottom-6 left-6 z-[100] flex w-[480px] max-w-[calc(100vw-48px)] flex-col-reverse gap-[var(--p-space-100)] outline-none",
        className
      )}
      {...props}
    />
  )
}

type ToastActionConfig =
  | { type: "none" }
  | { type: "undo"; label?: string; onUndo: () => void }
  | { type: "cta"; label: string; onAction: () => void }

type ToastProps = Omit<React.ComponentProps<typeof ToastPrimitive.Root>, "children"> & {
  variant?: ToastVariant
  message: string
  action?: ToastActionConfig
}

function Toast({ variant = "info", message, action = { type: "none" }, duration, className, ...props }: ToastProps) {
  const resolvedDuration =
    duration ?? (variant === "danger" ? Infinity : action.type === "none" ? 4000 : 8000)

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      duration={resolvedDuration}
      type={variant === "danger" ? "foreground" : "background"}
      className={cn(
        "flex w-[480px] items-center gap-[var(--p-space-100)]",
        "rounded-[var(--p-radius-100)] bg-[var(--c-toast-background)]",
        "py-[var(--p-space-150)] pl-[var(--p-space-200)] pr-[var(--p-space-100)]",
        "shadow-[var(--e-shadow-100)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        "data-[swipe=cancel]:translate-x-0",
        "data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right",
        className
      )}
      {...props}
    >
      <PrismIcon name={VARIANT_ICON[variant]} iconStyle="filled" size={24} decorative className="shrink-0" />

      <ToastPrimitive.Title
        className={cn(
          "min-w-0 flex-1 truncate",
          "text-[length:var(--c-toast-font-size)] font-[number:var(--c-toast-font-weight)] leading-[var(--c-toast-font-line-height)]",
          "text-[var(--c-toast-content)]"
        )}
      >
        {message}
      </ToastPrimitive.Title>

      {action.type === "undo" ? (
        <ToastPrimitive.Action asChild altText="Undo">
          <button
            type="button"
            onClick={action.onUndo}
            className={cn(
              "shrink-0 rounded-[var(--p-radius-050)] px-[var(--p-space-100)] py-1",
              "text-[length:var(--c-toast-font-size)] font-[number:var(--c-toast-font-weight)] leading-[var(--c-toast-font-line-height)]",
              "text-[var(--c-toast-content)]",
              "bg-[var(--c-toast-action-default)] hover:bg-[var(--c-toast-action-hover)]"
            )}
          >
            {action.label ?? "Undo"}
          </button>
        </ToastPrimitive.Action>
      ) : null}

      {action.type === "cta" ? (
        <ToastPrimitive.Action asChild altText={action.label}>
          <button
            type="button"
            onClick={action.onAction}
            className={cn(
              "shrink-0 rounded-[var(--p-radius-050)] px-[var(--p-space-100)] py-1",
              "text-[length:var(--c-toast-font-size)] font-[number:var(--c-toast-font-weight)] leading-[var(--c-toast-font-line-height)]",
              "text-[var(--c-toast-content)]",
              "bg-[var(--c-toast-action-default)] hover:bg-[var(--c-toast-action-hover)]"
            )}
          >
            {action.label}
          </button>
        </ToastPrimitive.Action>
      ) : null}

      <ToastPrimitive.Close asChild aria-label="Dismiss notification">
        <button
          type="button"
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--p-radius-050)]",
            "text-[var(--c-toast-content)]",
            "hover:bg-[var(--c-toast-action-hover)]"
          )}
        >
          <PrismIcon name="cancel" size={24} decorative />
        </button>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
}

export { ToastProvider, ToastViewport, Toast }
export type { ToastVariant, ToastActionConfig, ToastProps }
