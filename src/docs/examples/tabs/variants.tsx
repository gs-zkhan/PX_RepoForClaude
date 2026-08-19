import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Primary: underline indicator, no background. Secondary: pill/segmented
// background, no indicator, and no icon support.
export default function TabsVariants() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <Tabs defaultValue="one">
        <TabsList variant="primary">
          <TabsTrigger value="one">Primary one</TabsTrigger>
          <TabsTrigger value="two">Primary two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one.</TabsContent>
        <TabsContent value="two">Panel two.</TabsContent>
      </Tabs>

      <Tabs defaultValue="one">
        <TabsList variant="secondary">
          <TabsTrigger value="one">Secondary one</TabsTrigger>
          <TabsTrigger value="two">Secondary two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one.</TabsContent>
        <TabsContent value="two">Panel two.</TabsContent>
      </Tabs>
    </div>
  )
}
