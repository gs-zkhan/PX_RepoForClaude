import * as React from "react"

import { cn } from "@/lib/utils"
import { scrollToSection } from "@/docs/use-hash-route"

type TocEntry = { id: string; title: string; depth: 1 | 2 }

// -----------------------------------------------------------------------------
// Right-hand in-page contents, with the visible section highlighted.
//
// Uses IntersectionObserver rather than scroll maths: it is cheaper and does
// not need to know about container heights or sticky offsets. `rootMargin`
// biases the active line towards whatever sits near the top of the viewport,
// which is what reads as "the section I'm looking at".
// -----------------------------------------------------------------------------
function DocsToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = React.useState<string | null>(entries[0]?.id ?? null)

  React.useEffect(() => {
    if (entries.length === 0) return

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    )

    for (const entry of entries) {
      const node = document.getElementById(entry.id)
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [entries])

  if (entries.length === 0) return null

  return (
    <aside className="hidden w-[200px] shrink-0 xl:block">
      <div className="sticky top-[var(--p-space-300)]">
        <p className="pb-[var(--p-space-100)] text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-heading-xxsmall-weight)] uppercase leading-[var(--t-font-label-small-line-height)] tracking-wide text-[var(--s-color-text-subtlest)]">
          On this page
        </p>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => scrollToSection(entry.id)}
                className={cn(
                  "block w-full border-l-2 py-[var(--p-space-050)] text-left outline-none transition-colors",
                  "text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-body-medium-line-height)]",
                  "focus-visible:shadow-[var(--e-shadow-focus)]",
                  entry.depth === 2
                    ? "pl-[var(--p-space-300)]"
                    : "pl-[var(--p-space-150)]",
                  entry.id === activeId
                    ? "border-[var(--s-color-line-brand)] text-[var(--s-color-text-selected)]"
                    : "border-[var(--s-color-line-subtle)] text-[var(--s-color-text-subtle)] hover:text-[var(--s-color-text-default)]",
                )}
              >
                {entry.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export { DocsToc }
export type { TocEntry }
