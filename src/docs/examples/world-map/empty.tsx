import { WorldMap } from "@/components/ui/world-map"

// With no active codes, every country renders in the neutral inactive
// colour — useful for showing the base map before data loads.
export default function WorldMapEmpty() {
  return <WorldMap />
}
