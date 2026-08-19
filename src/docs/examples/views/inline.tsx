import { Views } from "@/components/ui/views"

// `inline` drops the bordered label cell — only the value + chevron render,
// with no border chrome, for placement inline within denser text/toolbars.
export default function ViewsInline() {
  return <Views inline label="Sort by" value="Last updated" />
}
