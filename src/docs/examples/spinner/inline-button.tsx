import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

// xs is reserved for inline, micro-interaction loading such as a submitting
// button — never as a standalone section or page loader.
export default function SpinnerInlineButton() {
  return (
    <Button disabled>
      <Spinner size="xs" label="Saving" />
      Saving
    </Button>
  )
}
