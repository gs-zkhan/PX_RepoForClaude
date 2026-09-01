import type { ComponentDoc } from "@/docs/types"

// STATUS: Approved. Design-owner visual review complete 2026-08-31.
// Visual Review: Approved. Approved for AI use: Yes.
// See ai/figma-coverage.json (id component-notification) and
// src/components/ui/notification.tsx for the full evidence trail,
// including the design-owner's 2026-08-31 override of Figma's own
// "Out of scope for current release" note (preserved as historical
// evidence, separate from and prior to this later visual approval).
export const notificationDoc: ComponentDoc = {
  slug: "notification",
  name: "Notification",
  status: "stable",
  description:
    "APPROVED (2026-08-31). The recommended, anchored NotificationBell (bell trigger + unread badge + popover panel of dismissible items) — never a standalone panel.",
  figmaNodeId: "1273:7",
  sourcePath: "src/components/ui/notification.tsx",

  sections: [
    {
      id: "status",
      title: "Review status (read first)",
      body:
        "Implemented against Figma page 1273:7, AI Instructions (7195:378) and Dos/Don'ts (7195:422). Design-owner visual review complete: Approved 2026-08-31, after two rounds of design-owner-requested corrections (see the sections below). Approved for AI use: Yes.",
    },
    {
      id: "scope-override",
      title: "Scope override — design owner requested implementation",
      body:
        "The Notification AI Instructions node's own \"Purpose\" section literally states \"Out of scope for current release.\" That is preserved verbatim in ai/figma-coverage.json as historical evidence — it is not a mistake or an oversight. The design owner explicitly requested implementation anyway on 2026-08-31, overriding that release-scope note. That override authorized implementation only — it was a separate, earlier event from the design owner's later same-day visual approval recorded above; approval does not erase or rewrite the historical scope note, it records that the design owner chose to proceed and then signed off on the result.",
    },
    {
      id: "anchoring",
      title: "NotificationBell is the recommended component — always anchored",
      body:
        "Use `NotificationBell` for all production usage — it is the only recommended, consumer-facing entry point. `NotificationBadge`/`NotificationItem`/`NotificationPanel` are internal/compositional implementation modules, exported only for building `NotificationBell` itself and for clearly-labelled review/anatomy inspection (as shown separately in the Validation Gallery). Figma's own component descriptions are explicit: Badge \"sits inside PX Shell Navigation Bar — do not use standalone\"; Item's Dos/Don'ts says \"Don't use Notification/Item outside of a Notification/Panel\"; Panel is \"Opened from the bell icon in the Navigation Bar.\"",
      exampleId: "notification/bell",
    },
    {
      id: "dismiss-always-visible",
      title: "Dismiss (×) is always visible — resolved evidence conflict",
      body:
        "Notification/Item's own component description says \"The Dismiss icon (×) appears on hover,\" implying hover-only visibility. The Dos/Don'ts explicitly overrides this: \"Always show the Dismiss (×) button on every Item... Never hide it — even on Danger/Unread items.\" The Dos/Don'ts is treated as the stronger, more explicit rule, and matches the actual rendered Populated-panel screenshot (every item's × is visible regardless of hover) — Dismiss is rendered unconditionally, not hover-gated.",
      exampleId: "notification/panel-populated",
    },
    {
      id: "mark-all-read",
      title: "\"Mark all as read\" — resolved evidence conflict, opt-in prop",
      body:
        "Both the Panel's own component description (\"Mark-all-read action sits in the panel header\") and the Dos/Don'ts (\"'Mark all as read' is a panel-level action on the header\") assert this control exists. The actual extracted Populated-panel anatomy renders only a bell icon, title, unread-count badge, and a single \"×\" — which is the panel's own close control (closes the popover, matching the AI Instructions' \"Escape closes panel\"), not mark-all-read. No fabricated button is added to match the literal anatomy exactly. Because the prose is repeated in two independent places, `NotificationPanel`/`NotificationBell` accept an optional `onMarkAllRead` callback — supplying it renders a \"Mark all as read\" tertiary button in the header (matching the Footer's own evidenced tertiary-button treatment); omitting it renders nothing extra.",
    },
    {
      id: "badge",
      title: "Badge — 4 size variants (internal module)",
      body:
        "Small (6px dot), Medium (8px dot), Large (12px dot), Large With Number (pill, count capped at \"99+\" past 99, per Figma). Use Large With Number when unread count > 0; remove the badge (or use Small) when count = 0 — the Dos/Don'ts is explicit that a badge showing \"0\" is noise; the absence of a badge IS the signal.",
      exampleId: "notification/badge-sizes",
    },
    {
      id: "item",
      title: "Item — panel row (internal module)",
      body:
        "16 variants: Type (Info/Success/Warning/Danger) × Read (Unread/Read) × Hover (real CSS :hover, not a prop). CORRECTED (design-owner review): unread items previously also carried a tinted background (`--c-notification-item-bg-unread`) matching the raw Figma symbol render; the design owner reviewed this live and asked for the tint to be removed — the small left-edge unread dot (`--c-notification-item-unread-dot`) is sufficient on its own as the unread signal. Read and unread rows now share the same `--c-notification-item-bg-default` background (with `--c-notification-item-bg-hover` still applying on real hover); only the dot's presence/absence — and the accessible name's \"Unread — \" prefix — communicates read state now. Icon per type uses the same filled icon set Toast/Banner already use (`information-filled`/`success-filled`/`warning-filled`/`danger-filled`, iconStyle=\"filled\"), matching severity — the Dos/Don'ts warns explicitly never to use Info for a failure.",
    },
    {
      id: "panel",
      title: "Panel — Empty / Populated (internal module)",
      body:
        "Fixed 440px width. Populated shows the header (bell + title + unread badge), then up to 20 items, then a \"View all notifications\" link. CORRECTED (design-owner review): a prior draft gated the link on `items.length > 20`, inferred solely from the Dos/Don'ts prose (\"Add a 'View all' link when unread count exceeds 20\"). Re-checked directly against the actual rendered Populated-panel anatomy (get_design_context, node 7197:157): the link is present in that example with only 4 items — it is not conditionally hidden below any threshold in the real anatomy. The link now shows whenever the panel is Populated AND the caller supplied a destination (`viewAllHref` or `onViewAll`) — never gated on item count. It is a real `Button` (tertiary, small — a Prism component instance in Figma's own anatomy, not a raw anchor), so it is a genuine Tab stop with native Enter/Space activation. This component never hard-codes where it navigates to; the consumer owns the destination.",
      exampleId: "notification/panel-populated",
    },
    {
      id: "panel-empty",
      title: "Panel — Empty state",
      body:
        "\"You're all caught up!\" / \"No new notifications\", verified character-for-character (including punctuation and capitalisation) against the actual rendered Empty-state anatomy (get_design_context, node 7197:157). Uses a `success-filled` `PrismIcon`, matching the real rendered symbol exactly — NOT an `EmptyState`/illustration composition. Explicitly checked and reporting rather than guessing: no Prism illustration asset for this exact \"caught up\" artwork exists anywhere in this repository (the only extracted illustration asset in the whole repo is `src/assets/illustrations/no-data-found.svg`, used exclusively by the unrelated `EmptyState` component's own doc/gallery examples). If a matching illustration is added to the repo's illustration set in the future, this icon-based rendering should be revisited against it — until then, the icon-based approach is the only one this repo can actually reuse, and no artwork was recreated or approximated to fill the gap.",
      exampleId: "notification/panel-empty",
    },
    {
      id: "popover-alignment",
      title: "Popover alignment — automatic, not a manual choice",
      body:
        "CORRECTED (design-owner review): a first pass exposed a manual `align?: \"start\" | \"end\"` prop and hardcoded a default — that still required the consumer (or the Gallery) to decide the direction, which does not satisfy \"location-aware.\" `NotificationBell` now measures the trigger's real `getBoundingClientRect()` every time the panel opens (and again on window resize while it stays open) and picks whichever side actually has more usable room via the pure `computeAutoAlign` helper (src/lib/notification.ts): a bell near the left edge gets `\"start\"` (grows rightward), a bell near the right edge gets `\"end\"` (grows leftward) — automatically, with no prop required. `align` remains available as an explicit override for the rare case a consumer must force one direction; supplying it disables the automatic measurement entirely. Radix's own collision detection (`avoidCollisions`, on by default, left untouched) still adjusts further from whichever alignment is in effect if it would overflow the viewport.",
      exampleId: "notification/bell",
    },
    {
      id: "badge-overlap",
      title: "Trigger badge overlap — reduced to a small, corner-centred amount",
      body:
        "CORRECTED (design-owner review): the unread badge overlaid on the bell trigger previously used a 4px outward offset (`-right-1 -top-1`) which, because the Large-With-Number badge (26×20px, matching Figma's own component set 3176:38 exactly) is nearly as wide as the 24px bell icon itself, still covered most of the glyph. It is now centred exactly on the icon's top-right corner (`right-0 top-0` with a 50%/-50% translate), so only the half of the badge nearer the icon overlaps it — the small, standard corner-badge amount — while the other half hangs clear. No Figma frame composites the Badge onto an actual bell instance to measure an exact evidenced pixel offset against; this corner-centring convention (the same one Material/Ant Design badges use) is a reasoned, documented default under that specific evidence gap, not a re-guess.",
    },
  ],

  props: [
    { name: "items (NotificationBell/Panel)", type: "NotificationItemData[]", required: true, description: "Controlled. { id, type, title, body, timestamp, read }." },
    { name: "onDismissItem", type: "(id: string) => void", required: true, description: "Called when an item's Dismiss (×) is clicked." },
    { name: "onMarkAllRead", type: "() => void", description: "Optional. When supplied, renders a 'Mark all as read' header button — see the resolved evidence-conflict note above." },
    { name: "viewAllHref / onViewAll", type: "string / () => void", description: "Renders 'View all notifications' in the Populated state whenever either is supplied — never gated on item count; never invented if omitted." },
    { name: "align (NotificationBell)", type: '"start" | "end"', description: "Optional explicit override. Omit it (the normal case) and the panel's side is computed automatically from the trigger's real position on open/resize — see the popover-alignment section above." },
    { name: "type (Item)", type: '"info" | "success" | "warning" | "danger"', required: true, description: "Matches the event's real severity — never Info for a failure." },
    { name: "size (Badge)", type: '"small" | "medium" | "large" | "largeWithNumber"', required: true, description: "Large With Number requires `count`." },
  ],

  tokens: [
    "--c-notification-badge-background",
    "--c-notification-badge-radius",
    "--c-notification-badge-text",
    "--c-notification-icon-danger",
    "--c-notification-icon-info",
    "--c-notification-icon-success",
    "--c-notification-icon-warning",
    "--c-notification-item-bg-default",
    "--c-notification-item-bg-hover",
    "--c-notification-item-body",
    "--c-notification-item-border",
    "--c-notification-item-content-gap",
    "--c-notification-item-gap",
    "--c-notification-item-padding-h",
    "--c-notification-item-padding-v",
    "--c-notification-item-timestamp",
    "--c-notification-item-title",
    "--c-notification-item-unread-dot",
    "--c-notification-panel-bg",
    "--c-notification-panel-border",
    "--c-notification-panel-empty-text",
    "--c-notification-panel-header-bg",
    "--c-notification-panel-header-text",
    "--c-notification-panel-padding-h",
    "--c-notification-panel-padding-v",
    "--c-notification-panel-radius",
  ],

  guidelines: {
    dos: [
      "Use `NotificationBell` for all production usage — it composes the anchored trigger and panel for you.",
      "Leave `align` unset — the panel automatically opens toward whichever side of the trigger has more room, recalculated on open and on resize.",
      "Match the icon Type to the real severity of the event — never Info for a failure.",
      "Always show Dismiss on every item, regardless of type or read state.",
      "Mark items Read as soon as the user opens the panel or dismisses the item.",
      "Supply `viewAllHref`/`onViewAll` if you have a real destination — the link will render automatically in the Populated state.",
    ],
    donts: [
      "Don't use `NotificationItem` outside a `NotificationPanel`.",
      "Don't render `NotificationBadge`/`NotificationPanel` standalone in a product screen.",
      "Don't show the badge when unread count is 0 — its absence is the signal.",
      "Don't rely on a tinted row background to signal unread — the unread dot alone is the signal, by design-owner direction.",
      "Don't use Notification for full-page system alerts (use Banner) or immediate action feedback (use Toast).",
    ],
  },
}
