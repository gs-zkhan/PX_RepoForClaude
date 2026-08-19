import { Tree, TreeItem } from "@/components/ui/tree"

// Level 0/1 indent with space/200 (16px) and level 3 with the --c-tree-indent
// token (80px). Level 2 indents by a verified raw 48px constant — there is no
// dedicated token for it, so do not look for one.
export default function TreeLevels() {
  return (
    <Tree>
      <TreeItem level={0} label="Level 0" expandable expanded />
      <TreeItem level={1} label="Level 1" expandable expanded />
      <TreeItem level={2} label="Level 2" expandable expanded />
      <TreeItem level={3} label="Level 3 — leaf, never shows a chevron" />
    </Tree>
  )
}
