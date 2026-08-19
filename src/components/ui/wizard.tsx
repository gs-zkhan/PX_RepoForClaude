import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Wizard — Prism DS anatomy (verified against prism-ds/src/components/
// Wizard, Figma node 1273:23). Multi-step progress indicator for
// onboarding, bulk imports, engagement builders — anywhere a task is
// broken into ordered numbered steps.
//
// Orientation: horizontal (default, connector line between circles) or
// vertical (connector below each circle, label to the right).
//
// State drives colors:
//   pending    — surface-sunken circle, subtle text
//   active     — primary-default circle, inverse (white) number, bold text
//   completed  — status-success circle, inverse tick icon, default text.
//                Only completed steps are clickable (enables back-nav).
//
// This is the progress indicator only — the caller owns the step body
// content and Next/Back/Skip footer buttons. Compose Wizard above a
// caller-rendered form + Button row.
// -----------------------------------------------------------------------------

type WizardOrientation = "horizontal" | "vertical"
type WizardStepState = "pending" | "active" | "completed"

type WizardStep = {
  id: string
  label?: string
  state: WizardStepState
}

type WizardProps = {
  steps: WizardStep[]
  orientation?: WizardOrientation
  /** Show step labels next to / under each circle. Default true. */
  showLabels?: boolean
  /** Show step numbers inside pending/active circles. Default true. */
  showNumbers?: boolean
  /** Called when a completed step is clicked — enables backwards nav. */
  onStepClick?: (id: string) => void
  className?: string
}

function Wizard({
  steps,
  orientation = "horizontal",
  showLabels = true,
  showNumbers = true,
  onStepClick,
  className,
}: WizardProps) {
  const isHorizontal = orientation === "horizontal"

  return (
    <nav
      aria-label="Progress"
      className={cn(
        "flex",
        isHorizontal ? "flex-row items-center" : "flex-col items-start",
        className,
      )}
    >
      <ol
        className={cn(
          "m-0 flex list-none p-0",
          isHorizontal ? "flex-row items-center" : "flex-col items-start",
        )}
      >
        {steps.map((step, idx) => (
          <li
            key={step.id}
            className={cn(
              "flex",
              isHorizontal ? "flex-row items-center" : "flex-col items-start",
            )}
          >
            <StepItem
              step={step}
              index={idx + 1}
              showLabel={showLabels}
              showNumber={showNumbers}
              onClick={onStepClick}
              orientation={orientation}
            />
            {idx < steps.length - 1 ? <Connector orientation={orientation} /> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

const CIRCLE_STATE: Record<WizardStepState, string> = {
  pending: "bg-[var(--s-color-surface-sunken)] text-[var(--s-color-text-subtle)]",
  active: "bg-[var(--s-color-action-primary-default)] text-[var(--s-color-text-inverse)]",
  completed: "bg-[var(--s-color-status-success-default)] text-[var(--s-color-text-inverse)]",
}

const LABEL_STATE: Record<WizardStepState, string> = {
  pending: "text-[var(--s-color-text-subtle)]",
  active: "font-semibold text-[var(--s-color-text-default)]",
  completed: "text-[var(--s-color-text-default)]",
}

function StepItem({
  step,
  index,
  showLabel,
  showNumber,
  onClick,
  orientation,
}: {
  step: WizardStep
  index: number
  showLabel: boolean
  showNumber: boolean
  onClick?: (id: string) => void
  orientation: WizardOrientation
}) {
  const clickable = step.state === "completed" && !!onClick
  const ariaCurrent = step.state === "active" ? "step" : undefined
  const ariaLabel = step.label
    ? `Step ${index}: ${step.label}${step.state === "completed" ? " — completed" : ""}`
    : `Step ${index}`

  const stepGap = orientation === "horizontal" ? "gap-[var(--p-space-100)]" : "gap-[var(--p-space-100)] py-[var(--p-space-050)]"

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center bg-transparent p-0 outline-none",
        stepGap,
        clickable ? "cursor-pointer" : "cursor-default",
        clickable && "focus-visible:rounded-[var(--p-radius-050)] focus-visible:shadow-[var(--e-shadow-focus)]",
      )}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      aria-disabled={step.state === "pending" ? true : undefined}
      disabled={!clickable}
      onClick={clickable ? () => onClick!(step.id) : undefined}
    >
      <span
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-[var(--p-radius-full)]",
          "text-[length:var(--t-font-label-small-size)] leading-none font-semibold",
          CIRCLE_STATE[step.state],
        )}
      >
        {step.state === "completed" ? (
          <PrismIcon name="tick" size={16} decorative />
        ) : showNumber ? (
          index
        ) : null}
      </span>
      {showLabel && step.label ? (
        <span
          className={cn(
            "whitespace-nowrap text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
            LABEL_STATE[step.state],
          )}
        >
          {step.label}
        </span>
      ) : null}
    </button>
  )
}

function Connector({ orientation }: { orientation: WizardOrientation }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "shrink-0 bg-[var(--s-color-line-default)]",
        orientation === "horizontal"
          ? "mx-[var(--p-space-100)] h-px w-4"
          : "my-[var(--p-space-025)] ml-3 h-4 w-px",
      )}
    />
  )
}

export { Wizard }
export type { WizardProps, WizardStep, WizardStepState, WizardOrientation }
