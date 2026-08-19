import { SearchBar } from "@/components/ui/search-bar"

// inline=true removes the border/background until hover/focus — for table
// cells and dense list/panel contexts only, never a standalone search field.
export default function SearchBarInline() {
  return (
    <div className="w-56 rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] p-[var(--p-space-200)]">
      <SearchBar inline placeholder="Filter column…" />
    </div>
  )
}
