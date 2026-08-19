import { useState } from "react"
import { EngagementsListExample } from "@/pages/engagements-list-example"
import { AudienceExplorer } from "@/pages/audience-explorer"
import { UserExplorer } from "@/pages/user-explorer"
import { WorkInProgress } from "@/pages/work-in-progress"
import { ValidationGallery } from "@/ValidationGallery"
import { DocsApp } from "@/docs/docs-app"
import { PxShellRail, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"
import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  const [activeKey, setActiveKey] = useState<PxShellNavKey>("dashboard")

  // Pin state is lifted here (rather than left uncontrolled inside
  // <PxShellRail>) because each route below mounts its own shell instance —
  // an uncontrolled pin would reset to "collapsed" every time navigation
  // unmounts one page and mounts another.
  const [navMode, setNavMode] = useState<PxShellRailMode>("collapsed")

  // Engagements and Audience Explorer are the only routes with a real table
  // built out. Every other nav item renders the shared work-in-progress
  // placeholder rather than repeating the same table.
  if (activeKey === "engagements") {
    return (
      <AudienceExplorer
        activeKey={activeKey}
        onNavigate={setActiveKey}
        mode={navMode}
        onModeChange={setNavMode}
      />
    )
  }

  if (activeKey === "validation") {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="flex h-screen w-full bg-[var(--s-color-surface-page)]">
          <PxShellRail
            activeKey={activeKey}
            onNavigate={setActiveKey}
            mode={navMode}
            onModeChange={setNavMode}
          />
          <div className="flex-1 overflow-auto">
            <ValidationGallery />
          </div>
        </div>
      </TooltipProvider>
    )
  }

  if (activeKey === "docs") {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="flex h-screen w-full bg-[var(--s-color-surface-default)]">
          <PxShellRail
            activeKey={activeKey}
            onNavigate={setActiveKey}
            mode={navMode}
            onModeChange={setNavMode}
          />
          <DocsApp />
        </div>
      </TooltipProvider>
    )
  }

  if (activeKey === "audience") {
    return (
      <UserExplorer
        activeKey={activeKey}
        onNavigate={setActiveKey}
        mode={navMode}
        onModeChange={setNavMode}
      />
    )
  }

  return (
    <WorkInProgress
      activeKey={activeKey}
      onNavigate={setActiveKey}
      mode={navMode}
      onModeChange={setNavMode}
    />
  )
}

export default App
