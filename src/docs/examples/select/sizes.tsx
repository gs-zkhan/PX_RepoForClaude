import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// Large (32px) is the default; Small (28px) is for compact toolbar filters
// and side-panel rows only.
export default function SelectSizes() {
  return (
    <div className="flex items-center gap-[var(--p-space-300)]">
      <Select defaultValue="open">
        <SelectTrigger size="large" className="w-40">
          <SelectValue placeholder="Large" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="open">
        <SelectTrigger size="small" className="w-40">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
