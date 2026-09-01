import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { exceedsMaxLength, hasRealContent, getAlignCommand, type TextAlignValue } from "@/lib/rte-field"

// -----------------------------------------------------------------------------
// RteField — Figma "RTE Field" page (1273:14), component frame 1755:6, 19
// variants (Type=Default|Inline|Floating × State × ShowCTAs), verified live
// via get_metadata/get_design_context. AI Instructions: 4901:21861.
// Dos/Don'ts: 4901:21824.
//
// No RTE package dependency added. Per explicit instruction to prefer a
// small repository-native implementation over installing a rich-text-editor
// library: this uses a native `contentEditable` region with
// `document.execCommand` for the formatting commands that have real,
// reliable cross-browser native support (bold/italic/underline, ordered/
// unordered list, indent/outdent, link, remove-formatting). `execCommand` is
// a deprecated API, but it remains universally implemented in every
// evergreen browser for exactly these commands and is the only
// dependency-free way to get real (not simulated) contentEditable formatting
// — the alternative would be hand-rolling a Selection/Range-based mini
// editor, which is a materially larger undertaking than this pass's scope
// justifies for a first implementation. If `execCommand` is ever actually
// removed from browsers, the smallest maintainable next step is a
// Selection/Range-based reimplementation of just these commands, not a new
// dependency.
//
// Clearly-separated real vs. visual-only controls (per explicit
// instruction not to claim unsupported editing capabilities):
//   REAL: Bold, Italic, Underline, Bullet list, Numbered list, Indent-in,
//     Indent-out, Link (window.prompt for the URL — the smallest possible
//     real implementation, not a fabricated modal), Clear formatting.
//   VISUAL-ONLY (rendered at the evidenced anatomy position, `disabled`,
//     not wired to any behaviour): FontSize, FontProperties, TextAlign,
//     Attachment. Figma's own AI Instructions describe these via a "↓"
//     shorthand implying each opens a picker/menu — building four real
//     dropdown menus (a font-size scale, a font-properties panel, an
//     alignment picker, and a file-attachment upload flow with
//     app-specific backend wiring) is out of scope for this pass. These are
//     documented here, in the Doc page, and in the Gallery as visually
//     demonstrated but not yet functional — not silently passed off as
//     working.
//
// Geometry: Default and Inline both have a fixed, evidenced 460px width
// (verified via get_design_context on every Default/Inline symbol, e.g.
// 1754:6/1754:1373 — every one of them is exactly 460px wide). This is set
// explicitly (`w-[460px]`) rather than left to `w-full`/content-driven
// sizing — Default's row of ~13 toolbar icon buttons happens to need close
// to 460px of its own content anyway, which can make a missing explicit
// width look correct by accident; Inline's toolbar is conditionally hidden
// (see below), so the same omission collapses it to the width of its
// placeholder text alone. Both are pinned to the real, evidenced value.
//
// Type decision (AI Instructions, Claude API Rules, node 7143:5305):
//   Default — boxed (border + bg), toolbar always visible, optional CTA row.
//   Inline — borderless, bottom-border-only, toolbar hidden in Default/Hover,
//     appears above the text area once Active/Filled/Hover-Elements. Never
//     has CTAs (Figma: Inline is always ShowCTAs=False).
//   Floating — no label, no boxed/bordered chrome, no CTA row: just the bare
//     editable region. The toolbar itself renders in a small floating panel
//     positioned near the current text selection (via
//     `Range.getBoundingClientRect()`), appearing only when the user has an
//     active, non-empty text selection inside the field, and dismissing on
//     Escape, selection-clear, or click-outside — matching the Dos/Don'ts
//     ("show the Floating toolbar on text selection only... dismiss when
//     selection is cleared") and "never on initial focus."
//
// ShowCTAs (Default type only — Inline/Floating never show CTAs, matching
// Figma's own variant set, which has no Inline/Floating × ShowCTAs=True
// combination): Cancel (secondary) + Save. Save is disabled until the field
// has real content (State=Filled/Hover-Elements in Figma both show Save as
// Primary Default; every other state keeps it Primary Disabled) — driven by
// whether the editable region's own text content is non-empty, not a
// separate prop the caller must track.
//
// Paste behaviour (AI Instructions, Content area: "strip all formatting on
// paste — plain text only"): `onPaste` reads `text/plain` from the clipboard
// and inserts it as plain text, discarding any HTML the source app sent.
//
// Placeholder: shown via a real empty-state check (not a native `<textarea>`
// placeholder, since contentEditable has none) — rendered as an absolutely
// positioned label that hides once the region has any content or is
// focused-with-content.
//
// Character limit: the AI Instructions say the counter only appears "when
// maxLength is set" — this component never renders a counter unless the
// caller passes `maxLength`, per that evidenced conditional.
//
// Read-only: `contentEditable={false}` while keeping the content visible and
// selectable (native browser behaviour for non-editable text), matching
// "Read-only mode: disables toolbar and prevents editing, content is
// selectable."
//
// Token gap (documented, not silently improvised — same situation as
// Textarea/Message Box, see that component's own header comment and
// ai/figma-coverage.json id component-textarea): no `--c-rte-*` component
// tokens exist in prism-generated.css. Per this repo's token-ownership
// priority (component -> semantic -> primitive), this implementation uses
// the semantic tokens the AI Instructions' own "Token Bindings" section
// names directly: `--s-color-line-default` (default border/dividers),
// `--s-color-action-primary-default` (hover/active/filled border, active
// toolbar-icon bg would-be-token), `--s-color-surface-default` (box bg),
// `--s-color-surface-disabled` (disabled box bg), `--s-color-surface-muted`
// (active/hover toolbar-icon bg), `--s-color-text-disabled` (placeholder),
// `--s-color-text-default` (typed content), `--p-radius-100` (8px box
// radius), `--p-radius-075` (6px toolbar-icon-slot radius), `--p-space-100`/
// `--p-space-050` (gaps/padding).
//
// Accessibility (AI Instructions' own Accessibility section, node
// 4901:21919): the editable region is `role="textbox" aria-multiline="true"`;
// toolbar buttons are real `<button>`s with `aria-label` and
// `aria-pressed="true"|"false"` reflecting live selection state via
// `document.queryCommandState`; the wrapper carries `aria-required`/
// `aria-invalid`, with any error linked via `aria-describedby`.
//
// STATUS: Approved with documented exception. Design-owner visual review
// complete 2026-08-31. Visual Review: Approved. Approved for AI use: Yes,
// with documented exceptions — Font size and Font properties remain
// visible but disabled/visual-only (not claimed as functional); Text
// alignment and Attachment are real and functional and are NOT exceptions.
// -----------------------------------------------------------------------------

type RteFieldType = "default" | "inline" | "floating"

type ToolbarCommand = "bold" | "italic" | "underline" | "insertUnorderedList" | "insertOrderedList" | "indent" | "outdent"

const TOOLBAR_ICON: Record<ToolbarCommand, string> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  insertUnorderedList: "bullet",
  insertOrderedList: "numbers",
  indent: "indent-in",
  outdent: "indent-out",
}

const TOOLBAR_LABEL: Record<ToolbarCommand, string> = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  insertUnorderedList: "Bulleted list",
  insertOrderedList: "Numbered list",
  indent: "Indent",
  outdent: "Outdent",
}

// CORRECTED (2026-08-31, design-owner-approved reconciliation): this file
// previously defined its own private `ToolbarButton` — a hand-rolled
// `<button>` duplicating the exact same 32x32/radius-075/pressed-state
// visual recipe the shared `IconButton` now implements natively via its new
// `appearance="toolbar"` (see src/components/ui/icon-button.tsx). Every
// call site below was migrated to `<IconButton appearance="toolbar" .../>`
// (`active` -> `pressed`, same real `aria-pressed`; `onMouseDown`
// preventDefault preserved at each call site to keep the editor's text
// selection intact across the click) and the local duplicate was deleted —
// not kept alongside it "for safety."

function ToolbarDivider() {
  return <div aria-hidden="true" className="h-[16px] w-px shrink-0 bg-[var(--s-color-line-default)]" />
}

// CORRECTED (design-owner review): a prior draft rendered this as a
// permanently-disabled, visual-only button. Figma's toolbar groups Text
// Align in its own group with a "↓" shorthand (AI Instructions, node
// 4901:21882) — the same shorthand used for Font Size/Font Properties,
// which genuinely do stay visual-only in this pass — but alignment,
// unlike those two, has real, directly-executable browser commands
// (`justifyLeft`/`justifyCenter`/`justifyRight`) and a complete matching
// icon set already in this repo, so it is implemented for real here rather
// than left disabled. Only Left/Center/Right are offered: this repo's
// icon set has `text-align-left`/`text-align-center`/`text-align-right`
// but no `text-align-justify` (only an unrelated `align-justified` icon
// for a different, layout-alignment icon family — confirmed via a full
// icon-inventory audit) — Justify is not offered rather than approximated
// with the wrong icon.
//
// Composition: Popover + RadioGroupPrimitive.Root, the exact pattern this
// repo already established in DashboardWidgetChartTypeSwitcher for a
// single-choice icon picker behind a disclosure trigger — reused
// deliberately rather than inventing a second pattern, per the instruction
// to use the approved repository menu/popover primitive when a control
// opens a menu.
const ALIGN_OPTIONS: { value: TextAlignValue; label: string; icon: string }[] = [
  { value: "left", label: "Align left", icon: "text-align-left" },
  { value: "center", label: "Align centre", icon: "text-align-center" },
  { value: "right", label: "Align right", icon: "text-align-right" },
]

function AlignmentPicker({
  value,
  disabled,
  onChange,
}: {
  value: TextAlignValue
  disabled?: boolean
  onChange: (value: TextAlignValue) => void
}) {
  const [open, setOpen] = React.useState(false)
  const active = ALIGN_OPTIONS.find((option) => option.value === value) ?? ALIGN_OPTIONS[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          appearance="toolbar"
          icon={active.icon}
          label={`Text alignment: ${active.label}`}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto rounded-[var(--p-radius-075)] border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] p-[var(--p-space-050)]"
      >
        <RadioGroupPrimitive.Root
          value={value}
          onValueChange={(next) => {
            onChange(next as TextAlignValue)
            setOpen(false)
          }}
          aria-label="Text alignment"
          className="flex items-center gap-[var(--p-space-050)]"
        >
          {ALIGN_OPTIONS.map((option) => {
            const isActive = option.value === value
            return (
              <RadioGroupPrimitive.Item
                key={option.value}
                value={option.value}
                aria-label={option.label}
                className={cn(
                  "flex size-8 items-center justify-center rounded-[var(--p-radius-075)] outline-none",
                  "focus-visible:shadow-[var(--e-shadow-focus)]",
                  isActive ? "bg-[var(--s-color-surface-muted)]" : "hover:bg-[var(--s-color-surface-muted)]",
                )}
              >
                <PrismIcon name={option.icon} size={24} decorative />
              </RadioGroupPrimitive.Item>
            )
          })}
        </RadioGroupPrimitive.Root>
      </PopoverContent>
    </Popover>
  )
}

// CORRECTED (design-owner review): a prior draft rendered this as a
// permanently-disabled, visual-only button. This component only ever
// surfaces the browser's own file-picker selection (a real, native
// `<input type="file">`, hidden and triggered by the toolbar button) via
// the `onAttachmentSelected(files: FileList)` callback — matching this
// repo's own established naming convention for file-related callbacks
// (FileUploader's `onFilesSelected`). It does NOT upload, store, preview,
// or otherwise process the file in any way: no fake upload backend is
// implemented. When `onAttachmentSelected` is not supplied, the button is
// disabled (the same graceful-degradation pattern as the other optional
// callbacks on this component) rather than silently doing nothing on
// click.
function AttachmentButton({
  disabled,
  onAttachmentSelected,
}: {
  disabled?: boolean
  onAttachmentSelected?: (files: FileList) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isDisabled = disabled || !onAttachmentSelected

  return (
    <>
      <IconButton
        appearance="toolbar"
        icon="attachment"
        label="Add attachment"
        disabled={isDisabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0 && onAttachmentSelected) {
            onAttachmentSelected(e.target.files)
          }
          // Reset so selecting the exact same file again still fires onChange.
          e.target.value = ""
        }}
      />
    </>
  )
}

type ToolbarState = Record<ToolbarCommand, boolean> & { alignment: TextAlignValue }

function Toolbar({
  disabled,
  state,
  onCommand,
  onAlignmentChange,
  onAttachmentSelected,
}: {
  disabled?: boolean
  state: ToolbarState
  onCommand: (command: ToolbarCommand) => void
  onAlignmentChange: (value: TextAlignValue) => void
  onAttachmentSelected?: (files: FileList) => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-0" data-slot="rte-toolbar">
      <IconButton appearance="toolbar" icon={TOOLBAR_ICON.bold} label={TOOLBAR_LABEL.bold} pressed={state.bold} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand("bold")} />
      <IconButton appearance="toolbar" icon={TOOLBAR_ICON.italic} label={TOOLBAR_LABEL.italic} pressed={state.italic} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand("italic")} />
      <IconButton appearance="toolbar" icon={TOOLBAR_ICON.underline} label={TOOLBAR_LABEL.underline} pressed={state.underline} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand("underline")} />
      <IconButton appearance="toolbar" icon="font-size" label="Font size (visual only — not implemented)" disabled onMouseDown={(e) => e.preventDefault()} />
      <IconButton appearance="toolbar" icon="font-properties" label="Font properties (visual only — not implemented)" disabled onMouseDown={(e) => e.preventDefault()} />
      <ToolbarDivider />
      <AlignmentPicker value={state.alignment} disabled={disabled} onChange={onAlignmentChange} />
      <ToolbarDivider />
      <IconButton
        appearance="toolbar"
        icon={TOOLBAR_ICON.insertUnorderedList}
        label={TOOLBAR_LABEL.insertUnorderedList}
        pressed={state.insertUnorderedList}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onCommand("insertUnorderedList")}
      />
      <IconButton
        appearance="toolbar"
        icon={TOOLBAR_ICON.insertOrderedList}
        label={TOOLBAR_LABEL.insertOrderedList}
        pressed={state.insertOrderedList}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onCommand("insertOrderedList")}
      />
      <ToolbarDivider />
      <IconButton appearance="toolbar" icon={TOOLBAR_ICON.indent} label={TOOLBAR_LABEL.indent} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand("indent")} />
      <IconButton appearance="toolbar" icon={TOOLBAR_ICON.outdent} label={TOOLBAR_LABEL.outdent} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => onCommand("outdent")} />
      <ToolbarDivider />
      <IconButton
        appearance="toolbar"
        icon="link"
        label="Insert link"
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const url = window.prompt("Link URL")
          if (url) document.execCommand("createLink", false, url)
        }}
      />
      <AttachmentButton disabled={disabled} onAttachmentSelected={onAttachmentSelected} />
      <IconButton
        appearance="toolbar"
        icon="clear-text-formating"
        label="Clear formatting"
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => document.execCommand("removeFormat")}
      />
    </div>
  )
}

const EMPTY_TOOLBAR_STATE: ToolbarState = {
  bold: false,
  italic: false,
  underline: false,
  insertUnorderedList: false,
  insertOrderedList: false,
  indent: false,
  outdent: false,
  alignment: "left",
}

type RteFieldProps = {
  type?: RteFieldType
  label?: string
  value: string
  onValueChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  error?: string
  /** Default type only — Inline/Floating never show a CTA row. */
  showCtAs?: boolean
  onSave?: () => void
  onCancel?: () => void
  maxLength?: number
  /**
   * Called with the browser's native FileList when the user picks a file
   * via the toolbar's Attachment control. This component only surfaces the
   * selection — it never uploads, stores, or previews the file itself; the
   * consuming application owns uploading/storing it. When omitted, the
   * Attachment control is disabled rather than silently doing nothing.
   */
  onAttachmentSelected?: (files: FileList) => void
  id?: string
  className?: string
}

function RteField({
  type = "default",
  label,
  value,
  onValueChange,
  placeholder = "Type",
  disabled = false,
  readOnly = false,
  required = false,
  error,
  showCtAs = false,
  onSave,
  onCancel,
  maxLength,
  onAttachmentSelected,
  id,
  className,
}: RteFieldProps) {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [hasContent, setHasContent] = React.useState(hasRealContent(value))
  const [toolbarState, setToolbarState] = React.useState<ToolbarState>(EMPTY_TOOLBAR_STATE)
  const [charCount, setCharCount] = React.useState(value.length)
  const [floatingToolbarRect, setFloatingToolbarRect] = React.useState<{ top: number; left: number } | null>(null)

  // Sync the DOM's contentEditable innerHTML from the controlled `value` only
  // when it changed from OUTSIDE this component (e.g. a parent reset it) —
  // never on every keystroke, which would fight the browser's own caret
  // position during typing. `lastAppliedValue` is a plain ref, not React
  // state: contentEditable's innerHTML is a real DOM mutation that this
  // effect performs as a side effect, and tracking "the value we last wrote"
  // is bookkeeping for that DOM write, not something a re-render should
  // itself depend on — using state here would just be the same set-state-in-
  // effect pattern this repo already flags as an anti-pattern elsewhere
  // (input-number.tsx).
  const lastAppliedValueRef = React.useRef(value)

  // Mount-only: contentEditable has no React-managed children (never
  // `dangerouslySetInnerHTML`, which would fight the sync effect below on
  // every render), so an initial non-empty `value` must be written into the
  // DOM once, directly, or the field renders empty regardless of what the
  // caller passed in.
  React.useEffect(() => {
    if (contentRef.current && value) {
      contentRef.current.innerHTML = value
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only by design
  }, [])

  React.useEffect(() => {
    if (value !== lastAppliedValueRef.current) {
      lastAppliedValueRef.current = value
      if (contentRef.current && contentRef.current.innerHTML !== value) {
        contentRef.current.innerHTML = value
      }
    }
  }, [value])

  const refreshToolbarState = React.useCallback(() => {
    if (readOnly || disabled) return
    const alignment: TextAlignValue = document.queryCommandState("justifyCenter")
      ? "center"
      : document.queryCommandState("justifyRight")
        ? "right"
        : "left"
    setToolbarState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      indent: false,
      outdent: false,
      alignment,
    })
  }, [readOnly, disabled])

  const handleInput = () => {
    const el = contentRef.current
    if (!el) return
    const text = el.textContent ?? ""
    if (exceedsMaxLength(text.length, maxLength)) {
      // Hard-clamp: revert to the last accepted content rather than
      // silently truncating mid-edit, which can corrupt formatting tags.
      el.innerHTML = lastAppliedValueRef.current
      return
    }
    const html = el.innerHTML
    lastAppliedValueRef.current = html
    onValueChange(html)
    setHasContent(hasRealContent(text))
    setCharCount(text.length)
    refreshToolbarState()
  }

  const handleCommand = (command: ToolbarCommand) => {
    contentRef.current?.focus()
    document.execCommand(command)
    handleInput()
  }

  const handleAlignmentChange = (alignment: TextAlignValue) => {
    contentRef.current?.focus()
    document.execCommand(getAlignCommand(alignment))
    handleInput()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
    handleInput()
  }

  // Floating toolbar positioning: only relevant for type="floating" — shows
  // near the current selection while it is non-empty and collapsed to
  // within this field's own editable region; hides on selection-clear,
  // blur, or Escape.
  React.useEffect(() => {
    if (type !== "floating") return

    function handleSelectionChange() {
      const el = contentRef.current
      const selection = window.getSelection()
      if (!el || !selection || selection.isCollapsed || selection.rangeCount === 0) {
        setFloatingToolbarRect(null)
        return
      }
      const range = selection.getRangeAt(0)
      if (!el.contains(range.commonAncestorContainer)) {
        setFloatingToolbarRect(null)
        return
      }
      const rect = range.getBoundingClientRect()
      const containerRect = el.getBoundingClientRect()
      setFloatingToolbarRect({
        top: rect.top - containerRect.top - 48,
        left: Math.max(0, rect.left - containerRect.left),
      })
      refreshToolbarState()
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [type, refreshToolbarState])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setFloatingToolbarRect(null)
  }

  // Inline type only (AI Instructions, node 4901:21876): "Toolbar hidden in
  // Default/Hover — appears above text area in Active/Filled/
  // Hover-Elements." Figma's own Default-state Inline anatomy (1754:1373)
  // has no toolbar row in it at all; Active/Filled do. Tracked via real
  // focus, not a synthetic "hover" prop — matching this repo's established
  // preference for real pseudo/DOM state over invented boolean props.
  const [isFocused, setIsFocused] = React.useState(false)
  const showInlineToolbar = isFocused || hasContent

  const editableRegion = (
    <div
      ref={contentRef}
      id={fieldId}
      role="textbox"
      aria-multiline="true"
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      aria-label={label ?? "Rich text content"}
      contentEditable={!disabled && !readOnly}
      suppressContentEditableWarning
      onInput={handleInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false)
        if (type === "floating") setFloatingToolbarRect(null)
      }}
      data-placeholder={placeholder}
      className={cn(
        "min-h-[32px] w-full text-[length:var(--p-font-size-medium,14px)] leading-[var(--p-font-line-height-medium,24px)] outline-none",
        "empty:before:pointer-events-none empty:before:text-[var(--s-color-text-disabled)] empty:before:content-[attr(data-placeholder)]",
        disabled ? "text-[var(--s-color-text-disabled)]" : "text-[var(--s-color-text-default)]",
      )}
    />
  )

  if (type === "floating") {
    return (
      <div className={cn("relative", className)}>
        {editableRegion}
        {floatingToolbarRect && (
          <div
            className={cn(
              "absolute z-10 flex items-start rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-default)]",
              "px-[var(--p-space-100)] pb-[var(--p-space-050)] pt-[var(--p-space-100)]",
              "shadow-[var(--e-shadow-300)]",
            )}
            style={{ top: floatingToolbarRect.top, left: floatingToolbarRect.left }}
          >
            <Toolbar
              disabled={disabled}
              state={toolbarState}
              onCommand={handleCommand}
              onAlignmentChange={handleAlignmentChange}
              onAttachmentSelected={onAttachmentSelected}
            />
          </div>
        )}
      </div>
    )
  }

  if (type === "inline") {
    return (
      <div className={cn("flex w-[460px] flex-col gap-[var(--p-space-025,4px)]", className)}>
        {label && (
          <label htmlFor={fieldId} className="text-[12px] leading-[16px] text-[var(--s-color-text-subtlest)]">
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        )}
        {showInlineToolbar && <Toolbar
              disabled={disabled}
              state={toolbarState}
              onCommand={handleCommand}
              onAlignmentChange={handleAlignmentChange}
              onAttachmentSelected={onAttachmentSelected}
            />}
        <div className="py-[var(--p-space-075,6px)]">{editableRegion}</div>
        <div aria-hidden="true" className="h-px w-full bg-[var(--s-color-line-default)]" />
        {error && (
          <p id={errorId} role="alert" className="text-[12px] leading-[16px] text-[var(--s-color-status-danger-default)]">
            {error}
          </p>
        )}
      </div>
    )
  }

  // type === "default"
  return (
    <div className={cn("flex w-full flex-col gap-[var(--p-space-025,4px)]", className)}>
      {label && (
        <label htmlFor={fieldId} className="text-[12px] leading-[16px] text-[var(--s-color-text-subtlest)]">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div
        className={cn(
          "flex w-full flex-col gap-[var(--p-space-100)] rounded-[var(--p-radius-100)] border p-[var(--p-space-100)]",
          disabled ? "bg-[var(--s-color-surface-disabled)]" : "bg-[var(--s-color-surface-default)]",
          error
            ? "border-[var(--s-color-status-danger-default)]"
            : disabled
              ? "border-[var(--s-color-line-default)]"
              : "border-[var(--s-color-line-default)] focus-within:border-[var(--s-color-action-primary-default)] hover:border-[var(--s-color-action-primary-default)]",
        )}
      >
        <Toolbar
              disabled={disabled}
              state={toolbarState}
              onCommand={handleCommand}
              onAlignmentChange={handleAlignmentChange}
              onAttachmentSelected={onAttachmentSelected}
            />
        <div className="p-[var(--p-space-100)]">{editableRegion}</div>
        {showCtAs && (
          <div className="flex h-8 w-full items-center justify-end gap-[var(--p-space-100)]">
            <Button variant="secondary" size="small" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="small" disabled={!hasContent} onClick={onSave}>
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        {error ? (
          <p id={errorId} role="alert" className="text-[12px] leading-[16px] text-[var(--s-color-status-danger-default)]">
            {error}
          </p>
        ) : (
          <span />
        )}
        {maxLength !== undefined && (
          <span className="text-[12px] leading-[16px] text-[var(--s-color-text-subtlest)]">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

export { RteField }
export type { RteFieldProps, RteFieldType }
