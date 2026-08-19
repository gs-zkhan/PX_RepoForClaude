import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Large uses --t-tab-font-* (14px/24lh); Medium and Small both use
// --t-font-heading-xxsmall-* (12px/16lh) — not a linear scale across sizes.
export default function TabsSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      {(["large", "medium", "small"] as const).map((size) => (
        <Tabs key={size} defaultValue="one">
          <TabsList size={size}>
            <TabsTrigger value="one">{size}</TabsTrigger>
            <TabsTrigger value="two">Tab two</TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  )
}
