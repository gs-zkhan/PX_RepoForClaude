import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// AvatarImage renders only once it loads; AvatarFallback is the Radix
// fallback shown while loading or if the src fails — always pair the two.
export default function AvatarWithImage() {
  return (
    <Avatar size="large">
      <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Jamie Summers" />
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
  )
}
