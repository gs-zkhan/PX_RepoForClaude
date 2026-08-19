import { Tree, TreeItem } from "@/components/ui/tree"

export default function TreeStates() {
  return (
    <Tree>
      <TreeItem level={1} label="Default row" />
      <TreeItem level={1} label="Selected row" selected />
      <TreeItem level={1} label="Disabled row" disabled />
      <TreeItem level={1} label="Row with a menu" onMoreActions={() => console.log("more")} />
    </Tree>
  )
}
