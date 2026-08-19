import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDisabled() {
  return (
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">Available</TabsTrigger>
        <TabsTrigger value="two" disabled>
          Unavailable
        </TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel one.</TabsContent>
      <TabsContent value="two">Panel two.</TabsContent>
    </Tabs>
  )
}
