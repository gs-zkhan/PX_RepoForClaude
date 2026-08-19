import type { DocProp } from "@/docs/types"

// Hand-authored rather than generated from the TS types: react-docgen would be
// another build dependency, and the prose in `description` (when to reach for a
// prop, not just its type) is the part that actually helps a reader or an agent.
function PropsTable({ props: rows }: { props: DocProp[] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[var(--s-color-surface-sunken)]">
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th
                key={h}
                scope="col"
                className="whitespace-nowrap px-[var(--p-space-200)] py-[var(--p-space-150)] text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-heading-xxsmall-weight)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-[var(--s-color-line-subtle)] align-top">
              <td className="whitespace-nowrap px-[var(--p-space-200)] py-[var(--p-space-150)]">
                <span className="font-mono text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-default)]">
                  {row.name}
                </span>
                {row.required ? (
                  <span
                    className="ml-[var(--p-space-050)] text-[var(--s-color-text-warning)]"
                    title="Required"
                    aria-label="Required"
                  >
                    *
                  </span>
                ) : null}
              </td>
              <td className="px-[var(--p-space-200)] py-[var(--p-space-150)]">
                <span className="font-mono text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-purple)]">
                  {row.type}
                </span>
              </td>
              <td className="whitespace-nowrap px-[var(--p-space-200)] py-[var(--p-space-150)]">
                <span className="font-mono text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
                  {row.defaultValue ?? "—"}
                </span>
              </td>
              <td className="px-[var(--p-space-200)] py-[var(--p-space-150)] text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-subtle)]">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { PropsTable }
