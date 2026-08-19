import * as React from "react"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PrismIcon } from "@/components/ui/prism-icon"
import { ExampleBlock } from "@/docs/components/example-block"
import { PropsTable } from "@/docs/components/props-table"
import { DocsToc, type TocEntry } from "@/docs/components/docs-toc"
import type { ComponentDoc, DocSection } from "@/docs/types"

// Only colour tokens get a swatch. Inferred from the token name rather than
// resolving each value at runtime: the Prism naming convention is consistent
// (background / content / border / color are colours; height, padding, gap,
// radius and font are not), so a rendered swatch for a length value — which
// would just be an empty box — is avoided without any measurement work.
const COLOUR_TOKEN_PATTERN = /-(background|content|border|color|colour|bg|text|fill)(-|$)/

function isColourToken(token: string) {
  return COLOUR_TOKEN_PATTERN.test(token)
}

function flattenSections(sections: DocSection[]): TocEntry[] {
  const out: TocEntry[] = []
  for (const section of sections) {
    out.push({ id: section.id, title: section.title, depth: 1 })
    for (const child of section.children ?? []) {
      out.push({ id: child.id, title: child.title, depth: 2 })
    }
  }
  return out
}

function SectionHeading({ id, title, level }: { id: string; title: string; level: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3"
  return (
    <Tag
      id={id}
      className={cn(
        "scroll-mt-[var(--p-space-400)] text-[var(--s-color-text-default)]",
        level === 2
          ? "text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)]"
          : "text-[length:var(--t-font-heading-xsmall-size)] font-[number:var(--t-font-heading-xsmall-weight)] leading-[var(--t-font-heading-xsmall-line-height)]",
      )}
    >
      {title}
    </Tag>
  )
}

function Section({ section, level }: { section: DocSection; level: 2 | 3 }) {
  return (
    <section className="flex flex-col gap-[var(--p-space-200)]">
      <SectionHeading id={section.id} title={section.title} level={level} />
      {section.body ? (
        <p className="max-w-[70ch] text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-subtle)]">
          {section.body}
        </p>
      ) : null}
      {section.exampleId ? <ExampleBlock exampleId={section.exampleId} /> : null}
      {section.children?.map((child) => (
        <Section key={child.id} section={child} level={3} />
      ))}
    </section>
  )
}

function GuidelineList({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: "do" | "dont"
}) {
  return (
    <div className="flex-1 rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] p-[var(--p-space-300)]">
      <p
        className={cn(
          "pb-[var(--p-space-150)] text-[length:var(--t-font-heading-xxsmall-size)] font-[number:var(--t-font-heading-xxsmall-weight)] leading-[var(--t-font-heading-xxsmall-line-height)]",
          tone === "do" ? "text-[var(--s-color-text-success)]" : "text-[var(--s-color-text-warning)]",
        )}
      >
        {title}
      </p>
      <ul className="flex flex-col gap-[var(--p-space-150)]">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-[var(--p-space-100)] text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-subtle)]"
          >
            {/* Real 16px asset names: `tick` and `cancel`. There is no
                16px "success" icon — that name only exists in the filled
                status set, which is for banners and toasts, not list marks. */}
            <PrismIcon
              name={tone === "do" ? "tick" : "cancel"}
              size={16}
              decorative
              className={cn(
                "mt-[2px] shrink-0",
                tone === "do"
                  ? "text-[var(--s-color-text-success)]"
                  : "text-[var(--s-color-text-warning)]",
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const [tab, setTab] = React.useState("examples")
  const tocEntries = React.useMemo(() => flattenSections(doc.sections), [doc.sections])

  return (
    <div className="flex flex-1 gap-[var(--p-space-500)] overflow-y-auto px-[var(--p-space-500)] py-[var(--p-space-400)]">
      <div className="min-w-0 flex-1">
        {/* Header ------------------------------------------------------- */}
        <header className="flex flex-col gap-[var(--p-space-150)] pb-[var(--p-space-300)]">
          <h1 className="text-[length:var(--t-font-heading-large-size)] font-[number:var(--t-font-heading-large-weight)] leading-[var(--t-font-heading-large-line-height)] text-[var(--s-color-text-default)]">
            {doc.name}
          </h1>
          <p className="max-w-[70ch] text-[length:var(--t-font-body-large-size)] leading-[var(--t-font-body-large-line-height)] text-[var(--s-color-text-subtle)]">
            {doc.description}
          </p>
          <p className="flex flex-wrap items-center gap-[var(--p-space-200)] text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtlest)]">
            <span className="font-mono">{doc.sourcePath}</span>
            {doc.figmaNodeId ? (
              <span>
                Figma node <span className="font-mono">{doc.figmaNodeId}</span>
              </span>
            ) : null}
          </p>
        </header>

        <Tabs value={tab} onValueChange={setTab}>
          <div className="border-b border-[var(--s-color-line-default)]">
            <TabsList variant="primary" size="large">
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="props">Props</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="examples" className="flex flex-col gap-[var(--p-space-500)] pt-[var(--p-space-400)]">
            {doc.sections.map((section) => (
              <Section key={section.id} section={section} level={2} />
            ))}
          </TabsContent>

          <TabsContent value="props" className="flex flex-col gap-[var(--p-space-200)] pt-[var(--p-space-400)]">
            <p className="max-w-[70ch] text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-subtle)]">
              Only these props are approved. Anything not listed here — including
              visual overrides via <span className="font-mono">className</span> — should be raised
              as an API change rather than worked around locally.
            </p>
            <PropsTable props={doc.props} />
          </TabsContent>

          <TabsContent value="usage" className="pt-[var(--p-space-400)]">
            {doc.guidelines ? (
              <div className="flex flex-col gap-[var(--p-space-300)] lg:flex-row">
                <GuidelineList title="Do" items={doc.guidelines.dos} tone="do" />
                <GuidelineList title="Don't" items={doc.guidelines.donts} tone="dont" />
              </div>
            ) : (
              <p className="text-[length:var(--t-font-body-medium-size)] text-[var(--s-color-text-subtle)]">
                No usage guidance recorded yet.
              </p>
            )}
          </TabsContent>

          <TabsContent value="tokens" className="flex flex-col gap-[var(--p-space-200)] pt-[var(--p-space-400)]">
            <p className="max-w-[70ch] text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-subtle)]">
              Every visual value this component renders comes from these tokens. A
              token from another component's namespace appearing here is a defect.
            </p>
            {doc.tokens?.length ? (
              <ul className="grid gap-[var(--p-space-050)] sm:grid-cols-2">
                {doc.tokens.map((token) => (
                  <li
                    key={token}
                    className="flex items-center gap-[var(--p-space-100)] rounded-[var(--p-radius-050)] bg-[var(--s-color-surface-sunken)] px-[var(--p-space-150)] py-[var(--p-space-050)]"
                  >
                    {isColourToken(token) ? (
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 rounded-[var(--p-radius-025)] border border-[var(--s-color-line-default)]"
                        style={{ background: `var(${token})` }}
                      />
                    ) : null}
                    {/* title: the two-column grid truncates long token names
                        mid-word with no other way to read the full name. */}
                    <span
                      title={token}
                      className="truncate font-mono text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtle)]"
                    >
                      {token}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[length:var(--t-font-body-medium-size)] text-[var(--s-color-text-subtle)]">
                No tokens recorded yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {tab === "examples" ? <DocsToc entries={tocEntries} /> : null}
    </div>
  )
}

export { ComponentPage }
