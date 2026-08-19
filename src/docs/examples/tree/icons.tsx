import { Tree, TreeItem } from "@/components/ui/tree"

// `icons` accepts 0-3 leading PrismIcon names, rendered after the
// chevron/checkbox slot — Figma's Type=No Icon/1 Icon/2 Icons/3 Icons.
export default function TreeIcons() {
  return (
    <Tree>
      <TreeItem level={1} label="Reports" icons={["folder-open"]} expandable expanded />
      <TreeItem level={2} label="Quarterly review.pdf" icons={["document"]} />
      <TreeItem level={2} label="Archive" icons={["folder-closed"]} />
    </Tree>
  )
}
