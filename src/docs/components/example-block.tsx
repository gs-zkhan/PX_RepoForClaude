import * as React from "react"

import { CodeBlock } from "@/docs/components/code-block"
import { getExampleComponent, getExampleSource } from "@/docs/registry"

// -----------------------------------------------------------------------------
// A live example canvas plus the source that produced it.
//
// The canvas sits on --s-color-surface-default (white) so components with a
// subtle background of their own — Skeleton, inline fields — remain visible,
// which is why the validation gallery moved to white too.
//
// Rendered via createElement rather than `const Example = ...; <Example />`:
// the lookup returns a module reference from an EAGER glob, so it is the same
// object on every render and component state is preserved. Assigning it to a
// capitalised local trips react-hooks/static-components, which cannot tell a
// stable module lookup from a component defined inline — createElement states
// the intent (render this existing component) without the false positive.
// -----------------------------------------------------------------------------

type ExampleBlockProps = {
  exampleId: string
}

function ExampleBlock({ exampleId }: ExampleBlockProps) {
  const source = getExampleSource(exampleId)
  const component = getExampleComponent(exampleId)

  if (!component || source === null) {
    // Surface the broken id rather than rendering nothing — a silently missing
    // example is the kind of thing that rots unnoticed.
    return (
      <div className="rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-sunken)] p-[var(--p-space-300)] text-[length:var(--t-font-body-medium-size)] text-[var(--s-color-text-subtle)]">
        No example found for <span className="font-mono">{exampleId}</span>. Expected{" "}
        <span className="font-mono">src/docs/examples/{exampleId}.tsx</span>.
      </div>
    )
  }

  return (
    <div>
      <div className="flex min-h-[96px] flex-wrap items-center gap-[var(--p-space-200)] rounded-t-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] p-[var(--p-space-300)]">
        {React.createElement(component)}
      </div>
      <CodeBlock code={source} label={`src/docs/examples/${exampleId}.tsx`} />
    </div>
  )
}

export { ExampleBlock }
