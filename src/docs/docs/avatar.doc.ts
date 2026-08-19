import type { ComponentDoc } from "@/docs/types"

// No Figma node reference found in the component header comment (it only
// lists token bindings) — figmaNodeId omitted rather than guessed.
export const avatarDoc: ComponentDoc = {
  slug: "avatar",
  name: "Avatar",
  status: "stable",
  description:
    "A circular image or initials representing a person or account, built on Radix's Avatar primitive.",
  sourcePath: "src/components/ui/avatar.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Avatar composes AvatarImage and AvatarFallback, mirroring Radix: AvatarFallback renders while the image is loading or missing, and is replaced once AvatarImage successfully loads. With no image, always pair Avatar with an AvatarFallback.",
      exampleId: "avatar/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Three sizes, set with the `size` prop: small (16px), medium (24px, default) and large (32px). Size controls both the circle diameter and the fallback text size via the component's own tokens.",
      exampleId: "avatar/sizes",
    },
    {
      id: "with-image",
      title: "With an image",
      body:
        "Pass `src` and `alt` to AvatarImage. It fills the circle with `object-cover` so non-square source images crop rather than distort.",
      exampleId: "avatar/with-image",
    },
    {
      id: "fallback",
      title: "Fallback content",
      body:
        "AvatarFallback is unstyled content — the caller decides initials, a single character, or an icon. Keep initials to two characters so they don't wrap inside the circle.",
      exampleId: "avatar/fallback",
    },
  ],

  props: [
    {
      name: "size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"medium"',
      description: "Circle diameter. See Sizes.",
    },
    {
      name: "...props",
      type: "React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>",
      description: "All other props pass through to the underlying Radix Avatar.Root, e.g. className.",
    },
  ],

  tokens: [
    "--c-avatar-size-large",
    "--c-avatar-size-medium",
    "--c-avatar-size-small",
    "--p-font-line-height-h7",
    "--p-font-size-h7",
    "--p-font-weight-regular",
    "--p-radius-full",
    "--s-color-surface-sunken",
    "--s-color-text-subtle",
  ],

  guidelines: {
    dos: [
      "Always pair AvatarImage with an AvatarFallback for the loading/error case.",
      "Keep fallback initials to two characters.",
      "Use `alt` text that identifies the person or account, not just \"avatar\".",
    ],
    donts: [
      "Don't render AvatarImage without a AvatarFallback sibling — there's no image, no fallback.",
      "Don't resize the circle with className; use the `size` prop so the fallback font scales with it.",
      "Don't put non-initials content (e.g. a full name) in the fallback — it will overflow the circle.",
    ],
  },
}
