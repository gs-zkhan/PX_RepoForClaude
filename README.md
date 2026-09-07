# PX AI-Ready Design System

This is the code-first PX design-system repository intended to support AI-driven PX interface generation. It is **not** a Figma-to-React export — Figma is a migration, evidence, and validation source, not the thing an AI consults to generate a routine screen.

## Architecture

```
ShadCN / Radix behavior & accessibility
  → Prism tokens + icons
    → typed Prism/PX components
      → reusable patterns + page shells
        → PX screens generated through prompting
```

ShadCN/Radix supply reusable interaction behavior and accessibility. Prism tokens, icons, typed components, and PX-specific patterns supply Gainsight PX's own visual identity and interaction rules on top of that foundation. The goal is for this repository to become the authoritative source an AI (or a new contributor) can generate correct, on-brand PX interfaces from — through prompting alone — without needing to open Figma for routine work.

## Current supported page archetypes

| Shell/pattern | Use for |
| --- | --- |
| `PxListShell` | List/table/filterable pages |
| `PxCreateEditShell` (Modal / Accordion / Wizard) | Record create/edit forms |
| `PxAnalyticsSecondaryNav` | Analytics pages |
| `PxDetailDrilldownShell` | Single-record detail/drilldown pages |

Shell selection is **anatomy-based, never name-based** — see [`ai/shell-registry.md`](./ai/shell-registry.md) for the full anatomy, Figma sources, and approval status of each, and [`CLAUDE.md`](./CLAUDE.md) for the mandatory composition rules.

## AI usage path

1. Read [`CLAUDE.md`](./CLAUDE.md) — the mandatory composition rules, Stop-and-Ask rule, and Component Eligibility Policy.
2. Determine the screen's actual anatomy (list/table? create/edit? analytics? single-record detail?).
3. Choose the shell from [`ai/shell-registry.md`](./ai/shell-registry.md) based on that anatomy.
4. Look up each candidate component's exact registry id and status in [`ai/figma-coverage.json`](./ai/figma-coverage.json) (human-readable summary: [`ai/figma-coverage.md`](./ai/figma-coverage.md)) — never assume a status from source existence or visual similarity.
5. Reuse existing `Approved`/`Approved-with-documented-exception` components where available; `Mapped-review-pending` components may be used provisionally, with disclosure, per `CLAUDE.md`'s Component Eligibility Policy.
6. Run validation (see below) before considering the work done.
7. If a required capability genuinely doesn't exist, **stop and escalate** rather than inventing a component, token, icon, or API.

## Figma relationship

- Figma is the migration/evidence/validation source for this repository — not something routine cold generation needs to open.
- The repository is progressively becoming authoritative for AI consumption in its own right; Figma remains the record of design intent and the source extractions were verified against.
- A green marker or an "in scope" designation on a Figma page is **not** design-owner approval — approval is tracked explicitly per component/shell in `ai/figma-coverage.json`'s `designOwnerApproval` field, never inferred from Figma page state alone.
- The canonical node mappings recorded in the registry (not any duplicate or reference frame elsewhere in the file) determine which Figma evidence is authoritative for a given component or shell.

## Setup / validation

```bash
# Install
npm install

# Local dev server
npm run dev

# TypeScript + production build
npm run build

# Lint
npm run lint

# Figma coverage registry validation
npm run figma-coverage:validate

# Registry coherence / recent hardening regression suites
npm run test:figma-coverage
npm run test:registry-coherence
npm run test:radio-group
npm run test:dropdown-field
npm run test:dropdown-menu

# Other component-specific test suites
npm run test:token-guardrails
npm run test:color
npm run test:notification
npm run test:rte-field
```

See [`.github/workflows/prism-token-ci.yml`](./.github/workflows/prism-token-ci.yml) for the exact set CI enforces on every pull request.

## v1 scope / limitations

- Not all 99 `ai/figma-coverage.json` entries are individually design-owner `Approved` — most are `Mapped-review-pending` (implemented and mapped to real Figma evidence, but not yet visually signed off). These may be used only under the documented provisional policy in `CLAUDE.md`, never treated as `Approved`.
- Some capabilities remain future work: dual-axis chart support, and a formalized `Shell/Modal` (destructive-confirmation-over-a-mounted-shell) pattern doc/registry entry.
- Cold-generation test screens (evaluation benchmarks proving the repository's AI-readiness) are experimental evaluation evidence preserved in separate, unmerged worktrees/branches — they are not production screens and are not part of this repository's shipped code.
