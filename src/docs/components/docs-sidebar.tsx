import { cn } from "@/lib/utils"
import { navGroups } from "@/docs/registry"
import { navigate } from "@/docs/use-hash-route"
import type { DocStatus } from "@/docs/types"

const STATUS_LABEL: Record<DocStatus, string> = {
  stable: "",
  beta: "Beta",
  deprecated: "Deprecated",
}

function StatusChip({ status }: { status?: DocStatus }) {
  if (!status || status === "stable") return null
  return (
    <span
      className={cn(
        "ml-auto shrink-0 rounded-[var(--p-radius-050)] px-[var(--p-space-050)]",
        "text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)]",
        status === "deprecated"
          ? "bg-[var(--s-color-surface-muted)] text-[var(--s-color-text-subtlest)]"
          : "bg-[var(--s-color-action-primary-subtlest)] text-[var(--s-color-text-information)]",
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function DocsSidebar({ activeSlug }: { activeSlug: string | null }) {
  return (
    <nav
      aria-label="Design system components"
      className="w-[240px] shrink-0 overflow-y-auto border-r border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] px-[var(--p-space-200)] py-[var(--p-space-300)]"
    >
      <button
        type="button"
        onClick={() => navigate("/")}
        className={cn(
          "mb-[var(--p-space-300)] block w-full rounded-[var(--p-radius-050)] px-[var(--p-space-150)] py-[var(--p-space-100)] text-left outline-none",
          "text-[length:var(--t-font-heading-xsmall-size)] font-[number:var(--t-font-heading-xsmall-weight)] leading-[var(--t-font-heading-xsmall-line-height)]",
          "text-[var(--s-color-text-default)] hover:bg-[var(--s-color-surface-muted)] focus-visible:shadow-[var(--e-shadow-focus)]",
        )}
      >
        Prism · PX
      </button>

      {navGroups.map((group) => (
        <div key={group.title} className="mb-[var(--p-space-300)]">
          <p className="px-[var(--p-space-150)] pb-[var(--p-space-100)] text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-heading-xxsmall-weight)] uppercase leading-[var(--t-font-label-small-line-height)] tracking-wide text-[var(--s-color-text-subtlest)]">
            {group.title}
          </p>
          <ul>
            {group.items.map((item) => {
              const active = item.slug === activeSlug
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => navigate(`/components/${item.slug}`)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-[var(--p-space-100)] rounded-[var(--p-radius-050)] px-[var(--p-space-150)] py-[var(--p-space-100)] text-left outline-none transition-colors",
                      "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
                      "focus-visible:shadow-[var(--e-shadow-focus)]",
                      active
                        ? "bg-[var(--s-color-surface-selected)] font-[number:var(--t-font-heading-xxsmall-weight)] text-[var(--s-color-text-selected)]"
                        : "text-[var(--s-color-text-subtle)] hover:bg-[var(--s-color-surface-muted)] hover:text-[var(--s-color-text-default)]",
                    )}
                  >
                    <span className="truncate">{item.name}</span>
                    <StatusChip status={item.status} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export { DocsSidebar }
