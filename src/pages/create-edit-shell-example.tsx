/**
 * Create · Edit Form example — demonstrates all three PxCreateEditShell
 * tiers against one realistic flow: creating an Engagement.
 *
 * - "Add Weblink" button opens the Modal tier (mirrors Figma's own
 *   "Add Weblink" reference exactly — Title / Description / URL / radio).
 * - "New Engagement" opens the Accordion tier (independent sections:
 *   Audience, Steps, Date Range, Additional Settings — the same section
 *   names as Figma's assembled Accordion example).
 * - "New Engagement (step-by-step)" opens the Wizard tier (step-dependent:
 *   Audience → Editor → Schedule → Launch — the same step names as Figma's
 *   assembled Wizard example).
 */

import * as React from "react"

import { PxListShell } from "@/patterns/px-list-shell"
import {
  PxCreateEditShellModal,
  PxCreateEditShellAccordion,
  PxCreateEditShellWizard,
} from "@/patterns/px-create-edit-shell"
import { PX_NAV_LABELS, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DateField } from "@/components/ui/date-field"
import { DropdownField } from "@/components/ui/dropdown-field"
import { EmptyState } from "@/components/ui/empty-state"
import { Letter } from "@/components/ui/letter"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TextField } from "@/components/ui/text-field"
import { Textarea } from "@/components/ui/textarea"
import { SelectItem } from "@/components/ui/select"
import type { WizardStep } from "@/components/ui/wizard"

type View = "list" | "accordion" | "wizard"

const WIZARD_STEP_LABELS = ["Audience", "Editor", "Schedule", "Launch"] as const

type CreateEditShellExampleProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function CreateEditShellExample({ activeKey, onNavigate, mode, onModeChange }: CreateEditShellExampleProps) {
  const [view, setView] = React.useState<View>("list")

  // Modal tier — "Add Weblink" ------------------------------------------------
  const [weblinkOpen, setWeblinkOpen] = React.useState(false)
  const [weblinkTitle, setWeblinkTitle] = React.useState("")
  const [linkTarget, setLinkTarget] = React.useState("new-tab")
  const weblinkValid = weblinkTitle.trim().length > 0

  // Accordion tier — "New Engagement" -----------------------------------------
  const [openSection, setOpenSection] = React.useState<string | undefined>("audience")
  const [engagementName, setEngagementName] = React.useState("")
  const [audience, setAudience] = React.useState("all-users")
  const [priority, setPriority] = React.useState("medium")

  // Wizard tier — "New Engagement (step-by-step)" -----------------------------
  const [wizardStepIndex, setWizardStepIndex] = React.useState(0)
  const [wizardAudience, setWizardAudience] = React.useState("power-users")
  const [wizardTitle, setWizardTitle] = React.useState("")

  const wizardSteps: WizardStep[] = WIZARD_STEP_LABELS.map((label, index) => ({
    id: label.toLowerCase(),
    label,
    state: index < wizardStepIndex ? "completed" : index === wizardStepIndex ? "active" : "pending",
  }))

  const header = {
    moduleName: PX_NAV_LABELS[activeKey],
    avatar: (
      <Avatar size="medium">
        <AvatarFallback>ZK</AvatarFallback>
      </Avatar>
    ),
  }

  if (view === "accordion") {
    return (
      <PxCreateEditShellAccordion
        nav={{ activeKey, onNavigate, mode, onModeChange }}
        header={header}
        onBack={() => setView("list")}
        title={engagementName || "Untitled Engagement"}
        onEditTitle={setEngagementName}
        onCancel={() => setView("list")}
        primaryAction={{
          label: "Create",
          onClick: () => setView("list"),
          disabled: engagementName.trim().length === 0,
        }}
      >
        <Accordion value={openSection} onValueChange={setOpenSection}>
          <AccordionItem value="audience" title="Audience" leading={<Letter letter="1" />}>
            <DropdownField label="Target audience" value={audience} onValueChange={setAudience}>
              <SelectItem value="all-users">All users</SelectItem>
              <SelectItem value="power-users">Power users</SelectItem>
              <SelectItem value="new-signups">New signups</SelectItem>
            </DropdownField>
          </AccordionItem>
          <AccordionItem value="steps" title="Steps" leading={<Letter letter="2" />}>
            <div className="flex flex-col gap-[var(--p-space-300)]">
              <TextField label="Engagement name" required value={engagementName} onChange={(e) => setEngagementName(e.target.value)} />
              <Textarea label="Message" helperVisible helperText="Shown to matching users when the engagement fires." />
            </div>
          </AccordionItem>
          <AccordionItem value="date-range" title="Date Range" leading={<Letter letter="3" />}>
            <div className="flex gap-[var(--p-space-300)]">
              <DateField label="Start date" />
              <DateField label="End date" />
            </div>
          </AccordionItem>
          <AccordionItem value="additional-settings" title="Additional Settings" leading={<Letter letter="4" />}>
            <DropdownField label="Priority" value={priority} onValueChange={setPriority}>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </DropdownField>
          </AccordionItem>
        </Accordion>
      </PxCreateEditShellAccordion>
    )
  }

  if (view === "wizard") {
    const isLastStep = wizardStepIndex === wizardSteps.length - 1
    const goNext = () => setWizardStepIndex((i) => Math.min(i + 1, wizardSteps.length - 1))
    const goBack = () => setWizardStepIndex((i) => Math.max(i - 1, 0))

    return (
      <PxCreateEditShellWizard
        nav={{ activeKey, onNavigate, mode, onModeChange }}
        header={header}
        onBack={() => setView("list")}
        title={wizardTitle || "Untitled Engagement"}
        onEditTitle={setWizardTitle}
        onCancel={() => setView("list")}
        steps={wizardSteps}
        onStepClick={(id) => setWizardStepIndex(wizardSteps.findIndex((s) => s.id === id))}
        primaryAction={
          isLastStep
            ? { label: "Launch", onClick: () => setView("list") }
            : { label: "Next", onClick: goNext }
        }
      >
        <div className="flex flex-col gap-[var(--p-space-300)]">
          {wizardStepIndex > 0 && (
            <Button variant="tertiary" size="small" className="self-start" onClick={goBack}>
              ← Back
            </Button>
          )}

          {wizardSteps[wizardStepIndex].id === "audience" && (
            <DropdownField label="Target audience" value={wizardAudience} onValueChange={setWizardAudience}>
              <SelectItem value="all-users">All users</SelectItem>
              <SelectItem value="power-users">Power users</SelectItem>
              <SelectItem value="new-signups">New signups</SelectItem>
            </DropdownField>
          )}
          {wizardSteps[wizardStepIndex].id === "editor" && (
            <>
              <TextField label="Engagement name" required value={wizardTitle} onChange={(e) => setWizardTitle(e.target.value)} />
              <Textarea label="Message" />
            </>
          )}
          {wizardSteps[wizardStepIndex].id === "schedule" && <DateField label="Start date" />}
          {wizardSteps[wizardStepIndex].id === "launch" && (
            <p className="text-[length:var(--p-font-size-medium)] text-[var(--s-color-text-subtle)]">
              Review your engagement, then click Launch to publish it to {wizardAudience.replace("-", " ")}.
            </p>
          )}
        </div>
      </PxCreateEditShellWizard>
    )
  }

  return (
    <PxListShell
      nav={{ activeKey, onNavigate, mode, onModeChange }}
      header={{
        ...header,
        title: "All engagements",
        secondaryActions: [
          { id: "add-weblink", label: "Add Weblink", variant: "secondary", onClick: () => setWeblinkOpen(true) },
          { id: "new-wizard", label: "New Engagement (step-by-step)", variant: "secondary", onClick: () => setView("wizard") },
          { id: "new-accordion", label: "New Engagement", variant: "primary", onClick: () => setView("accordion") },
        ],
      }}
    >
      <section className="flex h-full flex-col items-center justify-center rounded-[var(--p-radius-150)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]">
        <EmptyState
          title="No engagements yet"
          description="Use the actions above to try each PxCreateEditShell tier."
        />
      </section>

      <PxCreateEditShellModal
        open={weblinkOpen}
        onOpenChange={setWeblinkOpen}
        title="Add Weblink"
        onCancel={() => setWeblinkOpen(false)}
        primaryAction={{ label: "Save", onClick: () => setWeblinkOpen(false), disabled: !weblinkValid }}
      >
        <div className="flex flex-col gap-[var(--p-space-300)]">
          <TextField label="Title" required value={weblinkTitle} onChange={(e) => setWeblinkTitle(e.target.value)} />
          <Textarea label="Description" />
          <Textarea label="URL" />
          <RadioGroup
            value={linkTarget}
            onValueChange={setLinkTarget}
            orientation="horizontal"
            className="flex flex-row items-center gap-[var(--p-space-200)]"
          >
            <label className="flex items-center gap-[var(--p-space-100)] text-[length:var(--p-font-size-small)] font-semibold">
              <RadioGroupItem value="new-tab" />
              New Tab
            </label>
            <label className="flex items-center gap-[var(--p-space-100)] text-[length:var(--p-font-size-small)] font-semibold">
              <RadioGroupItem value="current-tab" />
              Current Tab
            </label>
          </RadioGroup>
        </div>
      </PxCreateEditShellModal>
    </PxListShell>
  )
}

export { CreateEditShellExample }
