import { SplitButton } from "@/components/ui/split-button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function ButtonSplit() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <SplitButton
        size="large"
        onAction={() => console.log("save")}
        menuLabel="More save options"
        menuContent={
          <>
            <DropdownMenuItem>Save as draft</DropdownMenuItem>
            <DropdownMenuItem>Save and duplicate</DropdownMenuItem>
          </>
        }
      >
        Save
      </SplitButton>
      <SplitButton
        size="large"
        disabled
        onAction={() => console.log("save")}
        menuLabel="More save options"
        menuContent={<DropdownMenuItem>Save as draft</DropdownMenuItem>}
      >
        Save
      </SplitButton>
    </div>
  )
}
