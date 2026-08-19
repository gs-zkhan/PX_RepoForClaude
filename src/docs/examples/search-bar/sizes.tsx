import { SearchBar } from "@/components/ui/search-bar"

// Public sizes are ascending-pixel-ordered (small=32, medium=36, large=40)
// and deliberately do not match Figma's own size names — Figma's "xlarge"
// token recipe is what this API calls "medium". Read the size by its pixel
// value, not by cross-referencing the Figma layer name.
export default function SearchBarSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <SearchBar size="small" placeholder="Small — 32px" />
      <SearchBar size="medium" placeholder="Medium — 36px (default)" />
      <SearchBar size="large" placeholder="Large — 40px" />
    </div>
  )
}
