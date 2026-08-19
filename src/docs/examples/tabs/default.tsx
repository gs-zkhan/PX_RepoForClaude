import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDefault() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel content.</TabsContent>
      <TabsContent value="usage">Usage panel content.</TabsContent>
      <TabsContent value="settings">Settings panel content.</TabsContent>
    </Tabs>
  )
}
