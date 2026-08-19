import { Button } from "@/components/ui/button"

// `asChild` renders Button's styling onto the child element instead of a
// <button>. Use it when the action navigates — an anchor keeps the correct
// semantics and browser affordances (open in new tab, copy link).
export default function ButtonAsChild() {
  return (
    <Button asChild variant="tertiary">
      <a href="https://www.gainsight.com" target="_blank" rel="noreferrer">
        View documentation
      </a>
    </Button>
  )
}
