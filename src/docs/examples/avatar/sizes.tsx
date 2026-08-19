import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <Avatar size="small">
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar size="medium">
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
    </div>
  )
}
