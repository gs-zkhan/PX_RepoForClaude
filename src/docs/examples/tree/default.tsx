import { Tree, TreeItem } from "@/components/ui/tree"

export default function TreeDefault() {
  return (
    <Tree>
      <TreeItem level={1} label="Segments" expandable expanded />
      <TreeItem level={2} label="Active accounts" />
      <TreeItem level={2} label="At-risk accounts" selected />
    </Tree>
  )
}
