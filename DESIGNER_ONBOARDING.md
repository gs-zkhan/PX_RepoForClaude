# Designer Onboarding — 5-Minute Guide

Talk to Claude like a product designer, not an engineer. It figures out the rest.

## Getting started

1. Clone/open this repo.
2. Open Claude Code in it.
3. Describe the screen you want, in plain product language.
4. Ask Claude to build it using the existing PX design system.
5. Review what it built, and refine visually by talking to it.

## What to say

Just describe the product, like you would to another designer:
- what the page is for
- what information it should show
- the key actions
- whether clicking a row opens a detail view
- whether a form needs multiple sections
- what analytics would be useful

## What you don't need to know

You never need to say any of this — Claude figures it out from the repo:
- shell names (`PxListShell`, `PxDetailDrilldownShell`, `PxCreateEditShellAccordion`, ...)
- token names
- component registry statuses
- Figma node IDs
- ShadCN/Radix internals

## What Claude does automatically

- picks the right shell from your screen's anatomy
- searches for an existing component before building anything new
- follows component eligibility rules (never invents a missing piece)
- applies the surface/elevation rule and standard table composition
- caps summary-stat rows at 4
- tells you when it's using a not-yet-fully-reviewed component
- stops and explains if something genuinely isn't supported yet

## What's still yours

- product intent
- content and copy
- information hierarchy
- whether the analytics it picked are actually useful
- final visual judgment call

## Starter prompts (copy/paste and adjust)

**List page**
> Create a Customers page. Show useful summary information at the top and a searchable/filterable table of customers. Customer name should open the customer detail view. Add the columns and controls you think are useful. Use the existing PX design system.

**Detail/Drilldown page**
> Create a detail page for a customer. I need a way back to the list, the customer name and status, some useful summary metrics, recent activity, and relevant analytics. Use the existing PX design system.

**Create/Edit form**
> Create an experience to add a new customer with name, website, industry, plan, owner, ARR, seats, health and notes. Organize it appropriately based on the complexity of the form. Use the existing PX design system.

**Analytics page**
> Create an analytics page showing feature adoption. Include useful summary metrics, trends, breakdowns and filters. Use the existing PX design system. Choose the analytics and layout you think make sense and I'll refine them visually.

## If the design system can't do something

Claude will:
- reuse an existing approved component if one fits
- use a not-yet-fully-reviewed component only when the rules allow it, and tell you
- never quietly invent a missing PX component
- stop and explain the gap if the capability genuinely doesn't exist yet

## Want more detail?

See [`ai/v1.1-release-checkpoint.md`](./ai/v1.1-release-checkpoint.md).
