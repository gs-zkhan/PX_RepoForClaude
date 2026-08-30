import { Card } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"
import { PrismIcon } from "@/components/ui/prism-icon"

export default function CardSmallRow() {
  return (
    <div className="flex w-[380px] flex-col gap-4">
      <Card
        size="small"
        title="Card Title"
        description="Card description text"
        icon={
          <span className="flex size-8 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
            <PrismIcon name="feature-px" size={16} sourceSize={24} decorative />
          </span>
        }
        reorderHandle={<PrismIcon name="drag-and-drop" size={16} decorative />}
        trailing={
          <>
            <Chip color="yellow">Setup Pending</Chip>
            <IconButton icon="delete" label="Delete" />
            <PrismIcon name="chevron-right" size={16} decorative />
          </>
        }
        onSelect={() => console.log("select")}
      />
      <Card
        size="small"
        state="empty"
        title="Card Title"
        description="Card description text"
        icon={
          <span className="flex size-8 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-muted)]">
            <PrismIcon name="feature-px" size={16} decorative />
          </span>
        }
        trailing={<Link href="#">Add</Link>}
      />
    </div>
  )
}
