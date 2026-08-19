import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

// Token reference (all in prism-generated.css):
// Sizes:    --c-avatar-size-small (16px), --c-avatar-size-medium (24px), --c-avatar-size-large (32px)
// Radius:   --p-radius-full (9999px)
// Fallback: --s-color-surface-sunken (#E6E9EC) bg, --s-color-text-subtle (#3C4A57) text
// Font:     --p-font-size-h7 (12px), --p-font-weight-regular (400), --p-font-line-height-h7 (16px)

type AvatarSize = "small" | "medium" | "large"

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize
}

const AvatarSizeContext = React.createContext<AvatarSize>("medium")

const sizeClasses: Record<AvatarSize, string> = {
  small:  "size-[var(--c-avatar-size-small)]",
  medium: "size-[var(--c-avatar-size-medium)]",
  large:  "size-[var(--c-avatar-size-large)]",
}

function Avatar({ size = "medium", className, ...props }: AvatarProps) {
  return (
    <AvatarSizeContext.Provider value={size}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full",
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    </AvatarSizeContext.Provider>
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
}

type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center select-none",
        "rounded-full",
        "bg-[var(--s-color-surface-sunken)]",
        "text-[var(--s-color-text-subtle)]",
        "text-[length:var(--p-font-size-h7)]",
        "leading-[var(--p-font-line-height-h7)]",
        "font-[number:var(--p-font-weight-regular)]",
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
export type { AvatarProps, AvatarFallbackProps, AvatarSize }
