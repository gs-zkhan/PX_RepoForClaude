import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function SelectStates() {
  return (
    <div className="flex items-center gap-[var(--p-space-300)]">
      <Select defaultValue="open">
        <SelectTrigger success className="w-40">
          <SelectValue placeholder="Success" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="open">
        <SelectTrigger aria-invalid className="w-40">
          <SelectValue placeholder="Error" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
        </SelectContent>
      </Select>
      <Select disabled defaultValue="open">
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
