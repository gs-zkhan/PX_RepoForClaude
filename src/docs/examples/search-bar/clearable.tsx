import * as React from "react"

import { SearchBar } from "@/components/ui/search-bar"

// The clear button only appears when onClear is provided AND value is
// non-empty — it occupies the same trailing slot as the search icon, so the
// two never show together.
export default function SearchBarClearable() {
  const [value, setValue] = React.useState("renewals")

  return (
    <SearchBar
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
      placeholder="Search…"
    />
  )
}
