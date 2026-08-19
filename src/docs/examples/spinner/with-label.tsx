import { Spinner } from "@/components/ui/spinner"

// `label` is visually hidden but read by screen readers — set it to describe
// what is loading rather than leaving the generic default.
export default function SpinnerWithLabel() {
  return <Spinner label="Loading engagement results" />
}
