import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsSidebar } from "@/docs/components/docs-sidebar"
import { ComponentPage } from "@/docs/components/component-page"
import { componentDocs, getDoc, navGroups } from "@/docs/registry"
import { navigate, useHashRoute } from "@/docs/use-hash-route"

// -----------------------------------------------------------------------------
// Docs site shell: persistent left nav + routed content area.
//
// Routes:
//   /                       -> index
//   /components/:slug       -> component page
//
// Lives alongside the Validation Gallery rather than replacing it: the gallery
// stays the dense side-by-side QA surface, this is the documentation surface.
// -----------------------------------------------------------------------------

const documentedCount = Object.keys(componentDocs).length

function DocsIndex() {
  return (
    <div className="flex-1 overflow-y-auto px-[var(--p-space-500)] py-[var(--p-space-400)]">
      <h1 className="text-[length:var(--t-font-heading-large-size)] font-[number:var(--t-font-heading-large-weight)] leading-[var(--t-font-heading-large-line-height)] text-[var(--s-color-text-default)]">
        Prism · PX design system
      </h1>
      <p className="mt-[var(--p-space-150)] max-w-[70ch] text-[length:var(--t-font-body-large-size)] leading-[var(--t-font-body-large-line-height)] text-[var(--s-color-text-subtle)]">
        Approved components built on ShadCN and Radix behaviour, with Prism tokens,
        icons and PX usage rules layered on top. Every example on these pages is a
        real file in the repo — the code shown is the code that rendered it.
      </p>

      <div className="mt-[var(--p-space-400)] flex flex-col gap-[var(--p-space-300)]">
        {navGroups.map((group) => (
          <section key={group.title}>
            <h2 className="pb-[var(--p-space-200)] text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)] text-[var(--s-color-text-default)]">
              {group.title}
            </h2>
            <ul className="grid gap-[var(--p-space-200)] sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const doc = getDoc(item.slug)
                return (
                  <li key={item.slug}>
                    <button
                      type="button"
                      onClick={() => navigate(`/components/${item.slug}`)}
                      className="flex h-full w-full flex-col gap-[var(--p-space-050)] rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] p-[var(--p-space-300)] text-left outline-none transition-colors hover:border-[var(--s-color-line-bold)] focus-visible:shadow-[var(--e-shadow-focus)]"
                    >
                      <span className="text-[length:var(--t-font-heading-xxsmall-size)] font-[number:var(--t-font-heading-xxsmall-weight)] leading-[var(--t-font-heading-xxsmall-line-height)] text-[var(--s-color-text-default)]">
                        {item.name}
                      </span>
                      <span className="text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-subtle)]">
                        {doc?.description}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-[var(--p-space-400)] text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtlest)]">
        {documentedCount} components documented — every typed component in{" "}
        <span className="font-mono">src/components/ui</span>. Composed Px* patterns are
        catalogued separately.
      </p>
    </div>
  )
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div className="flex-1 overflow-y-auto px-[var(--p-space-500)] py-[var(--p-space-400)]">
      <h1 className="text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)] text-[var(--s-color-text-default)]">
        No documentation for “{slug}” yet
      </h1>
      <p className="mt-[var(--p-space-150)] max-w-[70ch] text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-subtle)]">
        The component may exist in <span className="font-mono">src/components/ui</span> without a
        docs page. Add a <span className="font-mono">*.doc.ts</span> entry and register it to
        publish one.
      </p>
      <div className="mt-[var(--p-space-300)]">
        <Button variant="secondary" size="medium" onClick={() => navigate("/")}>
          Back to overview
        </Button>
      </div>
    </div>
  )
}

function DocsApp() {
  const path = useHashRoute()
  const match = /^\/components\/([^/]+)/.exec(path)
  const slug = match?.[1] ?? null
  const doc = slug ? getDoc(slug) : null

  return (
    <TooltipProvider delayDuration={300}>
      {/* h-full + flex-1, not h-screen: the PX shell rail owns the viewport and
          renders this beside it, so the docs shell must fill the remaining
          space rather than claim the whole screen. */}
      <div className="flex h-full min-w-0 flex-1 bg-[var(--s-color-surface-default)]">
        <DocsSidebar activeSlug={slug} />
        {slug === null ? (
          <DocsIndex />
        ) : doc ? (
          <ComponentPage key={doc.slug} doc={doc} />
        ) : (
          <NotFound slug={slug} />
        )}
      </div>
    </TooltipProvider>
  )
}

export { DocsApp }
