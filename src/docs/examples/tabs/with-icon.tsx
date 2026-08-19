import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// `icon` only renders on variant="primary" — Figma defines no Icon=True
// variant for Secondary, so it is silently ignored there (dev warning).
export default function TabsWithIcon() {
  return (
    <Tabs defaultValue="accounts">
      <TabsList variant="primary">
        <TabsTrigger value="accounts" icon="c360">
          Accounts
        </TabsTrigger>
        <TabsTrigger value="engagements" icon="analytics">
          Engagements
        </TabsTrigger>
      </TabsList>
      <TabsContent value="accounts">Accounts panel.</TabsContent>
      <TabsContent value="engagements">Engagements panel.</TabsContent>
    </Tabs>
  )
}
