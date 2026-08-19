import { WorldMap } from "@/components/ui/world-map"

// `width`/`height` size the SVG directly — use a smaller map for a dashboard
// tile versus a full-width report page.
export default function WorldMapSized() {
  return <WorldMap width={480} height={200} activeCountryCodes={["356", "702", "036"]} />
}
