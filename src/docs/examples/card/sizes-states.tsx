import { Card } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { Link } from "@/components/ui/link"
import { PrismIcon } from "@/components/ui/prism-icon"

const icon = (size: 24 | 16) => (
  <span
    className={
      size === 24
        ? "flex size-10 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]"
        : "flex size-8 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]"
    }
  >
    <PrismIcon name="feature-px" size={size} sourceSize={24} decorative />
  </span>
)

// All 8 legal Figma variants (frame 7613:57), in the frame's own order.
export default function CardSizesStates() {
  return (
    <div className="flex w-[380px] flex-col gap-4">
      {/* 1. Large / Default / with tags — 7623:3891 */}
      <Card
        size="large"
        icon={icon(24)}
        title="Card Title"
        description="Card description text"
        tags={
          <>
            <Chip color="gray">Getting Started</Chip>
            <Chip color="gray">Recommended</Chip>
          </>
        }
        onSelect={() => console.log("select")}
      />
      {/* 2. Large / Selected / with tags — 7623:3906 */}
      <Card
        size="large"
        state="selected"
        icon={icon(24)}
        title="Card Title"
        description="Card description text"
        tags={
          <>
            <Chip color="gray">Getting Started</Chip>
            <Chip color="gray">Recommended</Chip>
          </>
        }
        onSelect={() => console.log("select")}
      />
      {/* 3. Large / Default / without tags — 7623:3921 */}
      <Card
        size="large"
        icon={icon(24)}
        title="Card Title"
        description="Card description text"
        onSelect={() => console.log("select")}
      />
      {/* 4. Large / Selected / without tags — 7623:3929 */}
      <Card
        size="large"
        state="selected"
        icon={icon(24)}
        title="Card Title"
        description="Card description text"
        onSelect={() => console.log("select")}
      />
      {/* 5. Small / Default — 7614:231 */}
      <Card
        size="small"
        icon={icon(16)}
        title="Card Title"
        description="Card description text"
        trailing={
          <>
            <Chip color="yellow">Setup Pending</Chip>
            <PrismIcon name="chevron-right" size={16} decorative />
          </>
        }
        onSelect={() => console.log("select")}
      />
      {/* 6. Small / Selected — 7614:284 */}
      <Card
        size="small"
        state="selected"
        icon={icon(16)}
        title="Card Title"
        description="Card description text"
        trailing={
          <>
            <Chip color="yellow">Setup Pending</Chip>
            <PrismIcon name="chevron-right" size={16} decorative />
          </>
        }
        onSelect={() => console.log("select")}
      />
      {/* 7. Small / Compact (mapped from Figma "SelectedMin") — 7621:3622 */}
      <Card
        size="small"
        state="compact"
        icon={icon(16)}
        title="Card Title"
        trailing={
          <>
            <Chip color="yellow">Setup Pending</Chip>
            <PrismIcon name="chevron-right" size={16} decorative />
          </>
        }
        onSelect={() => console.log("select")}
      />
      {/* 8. Small / Empty — 7620:315 */}
      <Card
        size="small"
        state="empty"
        icon={icon(16)}
        title="Card Title"
        description="Card description text"
        trailing={<Link href="#">Add</Link>}
      />
    </div>
  )
}
