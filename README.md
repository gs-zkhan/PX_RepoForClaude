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

## PX AI-Ready Design System v1

**Proven supported archetypes:**

| Archetype | Shell |
| --- | --- |
| List/table/filterable pages | `PxListShell` |
| Create/edit flows | `PxCreateEditShell` |
| Analytics | `PxAnalyticsSecondaryNav` |
| Single-record detail/drilldown | `PxDetailDrilldownShell` |

**What has been demonstrated:** across six independent cold-generation benchmarks (see [`ai/cold-generation/`](./ai/cold-generation/)), a fresh, blind AI session has successfully selected and composed the correct shell/component architecture for each archetype above from this repository's own documentation alone — no Figma access, no naming hints. The before/after pair (Test #5 → Test #6, see `ai/cold-generation/README.md`) is direct evidence that hardening the repository, not the prompt, is what fixes a generation gap. This does **not** mean every individual registry component is design-owner `Approved` — see the boundary below.

**v1 boundary:**

- `Mapped-review-pending` components remain provisional, not `Approved` — usable only under `CLAUDE.md`'s Component Eligibility Policy, with disclosure.
- No dual-axis chart capability is currently guaranteed.
- The `Shell/Modal` (destructive-confirmation-over-a-mounted-shell) overlay pattern is not yet formally registered or documented.
- Cold-generation test screens are benchmark evidence, preserved in separate, unmerged worktrees/branches — not production product pages, and not part of this repository's shipped code.
- Figma remains migration/validation evidence; routine generation should use this repository first, per the Figma relationship section above.
