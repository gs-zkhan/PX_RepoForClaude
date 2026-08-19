import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// AvatarFallback is unstyled content — the caller decides initials vs. an
// icon. Keep initials to two characters so they don't wrap.
export default function AvatarFallbackExample() {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <Avatar>
        <AvatarFallback>MG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    </div>
  )
}
