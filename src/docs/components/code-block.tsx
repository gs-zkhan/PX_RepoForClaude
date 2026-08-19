import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Code display for the docs site.
//
// No syntax highlighting: that would need a highlighter dependency, and the
// call was to keep this dependency-free. Text uses Tailwind's `font-mono`
// stack — Prism has no code/mono font token, so there is nothing to bind to
// here. If a `--t-font-code-*` token is ever added, switch to it.
// -----------------------------------------------------------------------------

type CodeBlockProps = {
  code: string
  /** Shown in the header, e.g. the example's file path. */
  label?: string
  /** Start expanded. Defaults to collapsed to keep pages scannable. */
  defaultOpen?: boolean
  className?: string
}

function CodeBlock({ code, label, defaultOpen = false, className }: CodeBlockProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [copied, setCopied] = React.useState(false)
  const resetTimer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => {
    return () => window.clearTimeout(resetTimer.current)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      // Fail quietly — the code is selectable, so the user still has a path.
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-b-[var(--p-radius-100)] border border-t-0 border-[var(--s-color-line-default)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-[var(--p-space-200)] bg-[var(--s-color-surface-sunken)] px-[var(--p-space-200)] py-[var(--p-space-100)]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 items-center gap-[var(--p-space-100)] text-left text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)] outline-none hover:text-[var(--s-color-text-default)] focus-visible:shadow-[var(--e-shadow-focus)]"
        >
          <PrismIcon
            name="chevron-right"
            size={16}
            decorative
            className={cn("shrink-0 transition-transform", open && "rotate-90")}
          />
          <span className="truncate font-mono">{label ?? (open ? "Hide code" : "Show code")}</span>
        </button>

        <Button variant="tertiary" size="small" onClick={copy}>
          {copied ? "Copied" : "Copy code"}
        </Button>
      </div>

      {open ? (
        <pre className="overflow-x-auto bg-[var(--s-color-surface-default)] p-[var(--p-space-200)]">
          <code className="font-mono text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-default)]">
            {code}
          </code>
        </pre>
      ) : null}
    </div>
  )
}

export { CodeBlock }
export type { CodeBlockProps }
