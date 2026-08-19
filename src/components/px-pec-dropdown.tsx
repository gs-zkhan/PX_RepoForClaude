import * as React from "react"

import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { SearchBar } from "@/components/ui/search-bar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// PECDropdown — Figma "Shell/PEC Dropdown 🟢" (node 1747:29175, Prism V1 -
// ShadCN). Global Product–Environment–Channel context switcher, always
// centered in the Page Header's Primary bar.
//
// Anatomy confirmed via Figma metadata + screenshot (nodes 3099:14614 PEC
// Trigger, 3100:13458 PEC Panel, 3103:15334 assembled):
// - Trigger: 380×32px pill, 3 segments (Product/Environment/Channel) split
//   by 1px dividers, chevron flips up when open.
// - Panel: 936×284px, left-aligned to trigger, 3 equal columns split by 1px
//   dividers. Each column: borderless search input + uppercase column label
//   + scrollable list. Product/Environment are single-select (row
//   highlight). Channel is multi-select (checkbox + icon).
// - Footer: Cancel (reset) + Apply (commit), right-aligned.
// - State=Active and Panel=Open always change together (Figma rule) — this
//   is naturally satisfied since `open` drives both here.
// - Escape closes and resets to the last-applied values (not the in-progress
//   draft) — matches the Figma a11y note "Escape closes panel and resets
//   State to Default".
// -----------------------------------------------------------------------------

export type PECOption = {
  id: string
  label: string
  icon?: PrismIconName
}

type PECDropdownProps = {
  productOptions: PECOption[]
  environmentOptions: PECOption[]
  channelOptions: PECOption[]
  product: string
  environment: string
  channels: string[]
  onApply: (next: { product: string; environment: string; channels: string[] }) => void
  disabled?: boolean
  className?: string
}

function filterOptions(options: PECOption[], query: string) {
  if (!query.trim()) return options
  const q = query.trim().toLowerCase()
  return options.filter((o) => o.label.toLowerCase().includes(q))
}

function PECDropdown({
  productOptions,
  environmentOptions,
  channelOptions,
  product,
  environment,
  channels,
  onApply,
  disabled = false,
  className,
}: PECDropdownProps) {
  const [open, setOpen] = React.useState(false)

  // Draft state — only committed to the parent on Apply.
  const [draftProduct, setDraftProduct] = React.useState(product)
  const [draftEnvironment, setDraftEnvironment] = React.useState(environment)
  const [draftChannels, setDraftChannels] = React.useState<string[]>(channels)
  const [productQuery, setProductQuery] = React.useState("")
  const [environmentQuery, setEnvironmentQuery] = React.useState("")
  const [channelQuery, setChannelQuery] = React.useState("")

  function resetDraft() {
    setDraftProduct(product)
    setDraftEnvironment(environment)
    setDraftChannels(channels)
    setProductQuery("")
    setEnvironmentQuery("")
    setChannelQuery("")
  }

  function handleOpenChange(next: boolean) {
    if (next) resetDraft() // always start the draft from the last-applied values
    setOpen(next)
  }

  function handleCancel() {
    resetDraft()
    setOpen(false)
  }

  function handleApply() {
    onApply({ product: draftProduct, environment: draftEnvironment, channels: draftChannels })
    setOpen(false)
  }

  function toggleChannel(id: string) {
    setDraftChannels((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const productLabel = productOptions.find((o) => o.id === product)?.label ?? product
  const environmentLabel = environmentOptions.find((o) => o.id === environment)?.label ?? environment
  const channelOption = channelOptions.find((o) => o.id === channels[0])
  const channelLabel =
    channels.length > 1 ? `${channels.length} Channels` : channelOption?.label ?? "Channel"

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "group flex h-8 w-[380px] items-center overflow-hidden border outline-none transition-colors",
            "rounded-[var(--p-radius-100)]",
            "bg-[var(--s-color-surface-default)] border-[var(--s-color-line-default)]",
            "hover:bg-[var(--s-color-surface-muted)]",
            open && "border-[var(--s-color-line-brand)]",
            "focus-visible:shadow-[var(--e-shadow-focus)]",
            "disabled:cursor-not-allowed disabled:bg-[var(--s-color-surface-disabled)] disabled:border-[var(--s-color-line-disabled)]",
            className,
          )}
        >
          <PECSegment label={productLabel} />
          <PECSegmentDivider />
          <PECSegment label={environmentLabel} />
          <PECSegmentDivider />
          <PECSegment label={channelLabel} icon={channelOption?.icon} />
          <span className="flex w-8 shrink-0 items-center justify-center text-[var(--s-icon-color-default)] group-disabled:text-[var(--s-icon-color-disabled)]">
            <PrismIcon name={open ? "chevron-up" : "chevron-down"} size={24} />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        role="dialog"
        aria-label="Select Product, Environment and Channel"
        className="w-[936px] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex h-[240px]">
          <PECColumn
            label="Product Name"
            query={productQuery}
            onQueryChange={setProductQuery}
            options={filterOptions(productOptions, productQuery)}
            renderOption={(option) => (
              <PECSelectableRow
                key={option.id}
                option={option}
                selected={option.id === draftProduct}
                onClick={() => setDraftProduct(option.id)}
              />
            )}
          />
          <PECColumnDivider />
          <PECColumn
            label="Environment"
            query={environmentQuery}
            onQueryChange={setEnvironmentQuery}
            options={filterOptions(environmentOptions, environmentQuery)}
            renderOption={(option) => (
              <PECSelectableRow
                key={option.id}
                option={option}
                selected={option.id === draftEnvironment}
                onClick={() => setDraftEnvironment(option.id)}
              />
            )}
          />
          <PECColumnDivider />
          <PECColumn
            label="Channel"
            query={channelQuery}
            onQueryChange={setChannelQuery}
            options={filterOptions(channelOptions, channelQuery)}
            renderOption={(option) => (
              <PECCheckableRow
                key={option.id}
                option={option}
                checked={draftChannels.includes(option.id)}
                onToggle={() => toggleChannel(option.id)}
              />
            )}
          />
        </div>

        <div className="flex h-14 shrink-0 items-center justify-end gap-[var(--p-space-100)] border-t border-[var(--s-color-line-default)] px-[var(--p-space-300)]">
          <Button variant="secondary" size="large" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="large" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PECSegment({ label, icon }: { label: string; icon?: PrismIconName }) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden px-3",
        "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] font-[number:var(--t-font-body-medium-weight)] text-[var(--s-color-text-default)]",
        "whitespace-nowrap text-ellipsis",
        "group-disabled:text-[var(--s-color-text-disabled)]",
      )}
    >
      {icon && (
        <PrismIcon
          name={icon}
          size={24}
          className="shrink-0 text-[var(--s-icon-color-default)] group-disabled:text-[var(--s-icon-color-disabled)]"
        />
      )}
      <span className="overflow-hidden text-ellipsis">{label}</span>
    </span>
  )
}

function PECSegmentDivider() {
  return <span aria-hidden="true" className="h-4 w-px shrink-0 bg-[var(--s-color-line-subtle)]" />
}

function PECColumnDivider() {
  return <div aria-hidden="true" className="w-px shrink-0 bg-[var(--s-color-line-subtle)]" />
}

function PECColumn({
  label,
  query,
  onQueryChange,
  options,
  renderOption,
}: {
  label: string
  query: string
  onQueryChange: (value: string) => void
  options: PECOption[]
  renderOption: (option: PECOption) => React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="shrink-0 px-3 pt-2">
        <SearchBar
          size="small"
          inline
          placeholder="Search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <span
          className={cn(
            "block py-[var(--p-space-100)] text-[length:var(--p-font-size-xsmall)]",
            "font-[var(--p-font-weight-semi-bold)] uppercase tracking-wide",
            "text-[var(--s-color-text-subtlest)]",
          )}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pb-2">
        {options.map(renderOption)}
      </div>
    </div>
  )
}

function PECSelectableRow({
  option,
  selected,
  onClick,
}: {
  option: PECOption
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={selected}
      className={cn(
        "flex h-8 shrink-0 items-center px-3 text-left outline-none transition-colors",
        "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] font-[number:var(--t-font-body-medium-weight)] text-[var(--s-color-text-default)]",
        "hover:bg-[var(--s-color-surface-muted)]",
        "focus-visible:shadow-[var(--e-shadow-focus)]",
        selected && "bg-[var(--s-color-surface-selected)]",
      )}
    >
      {option.label}
    </button>
  )
}

function PECCheckableRow({
  option,
  checked,
  onToggle,
}: {
  option: PECOption
  checked: boolean
  onToggle: () => void
}) {
  const id = React.useId()
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex h-8 shrink-0 cursor-pointer items-center gap-2 px-3 outline-none transition-colors",
        "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] font-[number:var(--t-font-body-medium-weight)] text-[var(--s-color-text-default)]",
        "hover:bg-[var(--s-color-surface-muted)]",
      )}
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} />
      {option.icon && (
        <PrismIcon
          name={option.icon}
          size={24}
          className="text-[var(--s-icon-color-default)]"
        />
      )}
      {option.label}
    </label>
  )
}

export { PECDropdown }
export type { PECDropdownProps }
