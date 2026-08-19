import { ViewSelector } from "@/components/ui/view-selector"

// `open` swaps the chevron to point up and applies the click background —
// pair it with whatever Dropdown List is actually showing the view options.
export default function ViewSelectorOpen() {
  return <ViewSelector label="Q3 renewal risk" open />
}
