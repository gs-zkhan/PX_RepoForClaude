# Prism Pipeline POC (Figma plugin)

A local, development-only Figma plugin that proves we can reliably read
Prism V1's variables and variable collections directly from Figma, using
only the Figma **Plugin API** (not the Variables REST API, which requires
an Enterprise organization we don't have).

This is extraction-only: the plugin never creates, renames, or modifies
anything in the Figma file, and never makes a network request. See
[`code.js`](./code.js) for the implementation and the "Read-only /
network safety" notes below.

## What it does

- Reads every **local** variable collection and every **local** variable in
  whichever Figma file it's run in.
- Reports the file name, collection count, variable count, and a
  per-collection variable count.
- For any variable, can report its id, key (if the Plugin API exposes one),
  name, resolved type, collection, description, and its value in every mode.
- When a mode's value is a `VARIABLE_ALIAS`, the alias pointer is always
  preserved as-is (never silently replaced by the value it resolves to),
  **and** the plugin additionally resolves and reports the target
  variable's name and collection — so you can see both "this token is an
  alias to variable X" and "variable X currently resolves to Y" at the same
  time.
- Includes two lookups built for this POC specifically:
  - **Inspect test variable** — looks for a Primitive color variable named
    exactly `color/royalBlue/700`. If it exists, shows its full data
    (including every mode's value). If it does **not** exist in the file
    you're running this in, it reports real candidate Primitive color
    variable names from that file instead of guessing.
  - **Inspect component alias example** — finds one variable in a
    Component-named collection whose value is an alias, and shows the full
    chain: component token → target variable → target's own collection.
- **Export Prism snapshot** (added in Step 4A) — re-reads every local
  collection and variable at click time (never a cached/startup snapshot)
  and downloads a complete, deterministically-ordered JSON file covering
  the whole file. See "Exporting a full snapshot" below.
- **Sync to Git** (added in Step 5B) — re-reads every local collection and
  variable at click time (the same deterministic snapshot "Export Prism
  snapshot" produces) and sends it directly to a local companion process
  (`npm run figma:bridge`) over `http://localhost:3847`, which runs the
  same `figma:sync` pipeline a manual snapshot would. This removes the
  "download a file, then run a terminal command yourself" steps — see
  "One-click sync via the local bridge" below. "Export Prism snapshot"
  is unchanged and remains the fallback if you'd rather run the sync
  command yourself, or the bridge isn't running.

## How to load this into Figma Desktop

1. Open Figma Desktop (this plugin cannot be loaded in the browser version
   of Figma — development plugin import is desktop-only).
2. Open the **Prism V1 — ShadCN** file (file key `U3D8WMBVFl9LvAZyLHhm24`) —
   this must be the currently open file when you run the plugin.
3. From the top menu: **Plugins → Development → Import plugin from
   manifest…**
4. Select [`figma-plugin/manifest.json`](./manifest.json) from this repo
   checkout.
5. The plugin will now appear under **Plugins → Development → Prism
   Pipeline POC**.
6. With the Prism V1 file open and focused, run it from that same menu.

There is nothing to build or install first — `code.js` and `ui.html` are
already plain, ready-to-run files with no dependencies.

## What you should see on first run

A small panel titled "Prism Pipeline POC" showing:

```
File: <the actual open file's name>
Collections: <count>
Variables: <count>
```

followed by a list of each collection's name and how many variables it
holds, and buttons: "Inspect test variable", "Inspect component alias
example", "Export Prism snapshot", and "Sync to Git" (plus a text field
for the bridge token, used only by "Sync to Git"). Clicking any of them
prints structured JSON in the panel.

## Exporting a full snapshot

**How to run:** Plugins → Development → Prism Pipeline POC (with the Prism
V1 file open and focused).

**How to export:** click **"Export Prism snapshot"**. The panel shows
`Exporting…`, then re-reads every local collection and variable directly
from Figma (not a cached copy from when the plugin opened) and triggers a
download.

**Expected file:** `prism-figma-snapshot.json`, saved wherever your browser/
OS sends downloads by default. The panel updates to show how many
variables were exported once the file is ready.

**This snapshot is read-only export data — nothing in this plugin writes to
the repository, opens a branch, or calls GitHub.** The JSON file it
produces is the *input* to the separate repo-side tooling described below
("Syncing a snapshot into the repo").

The snapshot's top-level shape:

```json
{
  "schemaVersion": "1.0.0",
  "exportedAt": "<ISO 8601 timestamp — the only field expected to change between runs>",
  "figmaFileName": "...",
  "totalCollections": 0,
  "totalVariables": 0,
  "collections": [
    {
      "id": "...",
      "key": null,
      "name": "...",
      "defaultModeId": "...",
      "modes": [{ "modeId": "...", "modeName": "..." }],
      "variableCount": 0
    }
  ],
  "variables": [
    {
      "id": "...",
      "key": null,
      "name": "...",
      "resolvedType": "COLOR",
      "description": null,
      "collectionId": "...",
      "collectionName": "...",
      "scopes": null,
      "hiddenFromPublishing": null,
      "valuesByMode": [
        {
          "modeId": "...",
          "modeName": "...",
          "isAlias": false,
          "rawValue": { "raw": { "r": 0, "g": 0, "b": 0, "a": 1 }, "normalized": { "hex": "#000000", "alpha": 1 } }
        }
      ]
    }
  ]
}
```

Collections are sorted by name, then key, then id. Variables are sorted by
collection name, then collection id, then variable name, then key, then id.
Each variable's `modes` follow the order Figma defines on the collection —
never re-sorted. This keeps the export byte-stable between runs when
nothing in Figma has changed, aside from `exportedAt`.

## One-click sync via the local bridge

This is the primary flow (Step 5B). It removes the "download a file, then
run a terminal command" handoff — but it still requires one terminal
command to be running locally first, since a Figma plugin cannot execute
shell commands or write into this repo's working tree itself (see
"Why a local bridge, not a direct Figma → GitHub integration" below).

1. **Once**, from the repo root, in a terminal you leave running:
   ```bash
   npm run figma:bridge
   ```
   This starts a small local-only server, reachable at
   `http://localhost:3847`, and prints a session token. Copy that token —
   it's generated fresh each time the bridge starts and is never written
   to disk. If a plain `gh` doesn't work on your machine (see "GitHub PR
   creation" below), start it with `GH_BIN` instead so PR creation still
   works — the bridge passes its own environment straight through to the
   `figma-sync.mjs` subprocess it runs, so no other change is needed:
   ```bash
   GH_BIN="/path/to/your/gh" npm run figma:bridge
   ```
   Plain `npm run figma:bridge` (no `GH_BIN`) still works — it just skips
   automatic PR creation if no working `gh` can be found any other way,
   falling back to a printed compare URL as before.
2. Open **Prism V1** in Figma and run **Prism Pipeline POC**.
3. Paste the token into the "Bridge token" field.
4. Click **Sync to Git**. The panel walks through: "Checking local
   bridge…" → "Sending snapshot…" → "Sync running… (validating,
   generating, building, then branch/commit/push — this can take a
   bit)" → a final result (see below) — failures are always shown, never
   hidden.
5. Behind the scenes, the bridge hands the snapshot to the *same*
   `scripts/figma-sync.mjs` pipeline described below (validate → dry-run
   the importer → apply only deterministic literal changes → re-validate
   → regenerate CSS → build → convergence check → create a
   `figma-sync/<timestamp>` branch from the stable base branch → commit →
   push → **create a GitHub PR, if possible (Step 5C)**). The bridge does
   not reimplement any of this logic.
6. **PR creation (Step 5C):** if the GitHub CLI (`gh`) is installed and
   authenticated on this machine, `figma-sync.mjs` opens the PR itself
   (checking first whether an open PR for that branch already exists, so
   re-running a sync never creates a duplicate) and the panel shows:
   ```
   Sync complete
   Branch: figma-sync/2026-...
   PR: https://github.com/<owner>/<repo>/pull/<number>
   ```
   **If `gh` isn't installed/authenticated** (the case in this repo's own
   dev environment as of Step 5C — see "GitHub PR creation" below), the
   branch and commit are still pushed exactly the same way, and the panel
   shows:
   ```
   Sync complete
   Branch pushed: figma-sync/2026-...
   PR creation unavailable
   Open: https://github.com/<owner>/<repo>/compare/main...figma-sync/2026-...?expand=1
   ```
   Open that URL and create the PR yourself. Either way, the existing
   **Prism Token CI** workflow runs against the PR exactly as it does for
   any other PR.
7. A human reviews and merges the PR. **There is no auto-merge anywhere
   in this flow, and neither the bridge nor `figma-sync.mjs` ever pushes
   to `main` directly.**

If the bridge isn't running, "Sync to Git" reports exactly that ("Local
Prism bridge is not running. In Terminal, from the repo root, run:
`npm run figma:bridge`") instead of failing silently or hanging.

### GitHub PR creation (Step 5C)

Automatic PR creation uses the **GitHub CLI (`gh`)** exclusively, via its
own `gh auth login` session — never a raw PAT, never `GITHUB_TOKEN`/
`GH_TOKEN` (checked for existence only, never read/logged), and never the
`osxkeychain` credential `git push` itself already uses transparently for
HTTPS (that credential is never read or reused for API calls — this
bridge/script only ever shells out to `git` and, if present, `gh`, each
using their own existing auth).

**Finding `gh` itself:** resolution order, most to least explicit:

1. **`GH_BIN`** — an optional escape hatch: an explicit path you set
   yourself, for a machine where a plain `gh` on `PATH` doesn't work for
   some reason (for example, a managed Mac's security policy silently
   killing an unmanaged copy of the binary the moment it runs — this
   isn't this repo's situation once `gh` is installed through Homebrew,
   but the override costs nothing to keep):
   ```bash
   GH_BIN="/path/to/your/gh" npm run figma:bridge
   ```
2. Plain `gh` on `PATH` — the normal case. `figma-sync.mjs` doesn't just
   check whether `gh` exists, it actually runs `gh --version` and only
   trusts a clean exit, so a present-but-non-functional binary is treated
   the same as a missing one rather than causing a confusing failure
   later.

Neither of these ever reads a token, inspects Keychain, or embeds a
credential — they only ever locate a *binary path*, then run
`<binary> auth status` / `pr list` / `pr create` using `gh`'s own already
-established `gh auth login` session (never a raw PAT, never
`GITHUB_TOKEN`/`GH_TOKEN` — checked for existence only, never read/logged
— and never the `osxkeychain` credential `git push` already uses for
HTTPS, which is a separate mechanism this script never touches).

**If no working `gh` is found**, this isn't a bug to work around —
`figma-sync.mjs` falls back to printing the branch name and a compare
URL, exactly as it always has. Nothing is invented to substitute for a
missing CLI (no embedded PAT, no Keychain read, no credentials handed to
the plugin).

**To enable automatic PR creation:** install the GitHub CLI yourself
(e.g. via [cli.github.com](https://cli.github.com) or `brew install gh`)
and run `gh auth login` once, interactively, in your own terminal — this
is a one-time, per-machine setup step you perform yourself; the
automation here deliberately never attempts to install or authenticate
`gh` on your behalf. Once `gh auth status` succeeds, the very next sync
automatically creates (or reuses) the PR — no code change is needed.

**Security notes:** the bridge only ever binds to loopback addresses —
`127.0.0.1` and `::1` (never `0.0.0.0` or the IPv6 all-interfaces `::`) —
only accepts `GET /health` and `POST /sync`, requires the session token as
a bearer header on `/sync`, rejects oversized/malformed/wrong-schema/
wrong-file payloads before touching the filesystem or git, and only ever
invokes `figma-sync.mjs` as an argument array (never through a shell
string), so nothing in the snapshot payload can be interpreted as a shell
command. `manifest.json`'s `networkAccess.devAllowedDomains` is scoped to
exactly this one loopback origin (`http://localhost:3847`) — not `*`, not
any GitHub domain — and `allowedDomains` (the production-facing field)
stays `["none"]`.

**Why `localhost` instead of `127.0.0.1` in the manifest, and why two
listeners:** Figma's manifest validator rejects a bare `127.0.0.1`
address in both `allowedDomains` and `devAllowedDomains` ("must be a
valid URL") — confirmed directly against Figma Desktop — so the plugin
must address the bridge as `http://localhost:3847`. On this Mac,
`localhost` resolves to the IPv6 loopback address (`::1`) before falling
back to the IPv4 one (`127.0.0.1`); since the bridge originally bound
only to `127.0.0.1`, the first connection attempt failed and only
succeeded on a client's automatic IPv4 fallback (confirmed with `curl -v`,
which shows `Trying [::1]:3847... Connection refused` before it retries
`127.0.0.1`). Rather than rely on every HTTP client (including the
plugin's iframe `fetch`) implementing that fallback, the bridge listens
on both loopback addresses directly, so a `localhost` request succeeds on
the first attempt regardless of which one the OS resolves first.

## Syncing a snapshot manually (fallback)

If you'd rather not run the bridge, or it isn't available, "Export Prism
snapshot" plus a manual command still works exactly as before:

1. Open **Prism V1** in Figma, run **Prism Pipeline POC**, click **Export
   Prism snapshot**.
2. From the repo root, run:
   ```bash
   npm run figma:sync -- --snapshot="/path/to/prism-figma-snapshot.json"
   ```
3. From here the flow is identical to steps 5–7 above (same
   `figma-sync.mjs` pipeline, same PR/CI/review/merge steps, no
   auto-merge).

If the snapshot contains no new safe changes (for example, because it was
already synced), the command reports that and exits without creating a
branch, commit, PR, or push — whether it was invoked manually or via the
bridge. See [`scripts/figma-sync.mjs`](../scripts/figma-sync.mjs) and
[`scripts/figma-snapshot-import.mjs`](../scripts/figma-snapshot-import.mjs)
for exactly what is and isn't applied automatically (only deterministic
literal value changes — alias-target changes and the known pre-existing
literal/alias structural differences always require manual review).

## Read-only / network safety

- `code.js` never calls `fetch`, `XMLHttpRequest`, or any Figma API that
  creates/renames/deletes/sets a value on a node, variable, or collection.
  Every Figma API call it makes is a read (`getLocalVariableCollectionsAsync`,
  `getLocalVariablesAsync`, `getVariableByIdAsync`,
  `getVariableCollectionByIdAsync`). The Figma document itself is never
  written to, regardless of which button is clicked.
- As of Step 5B, `manifest.json` declares
  `"networkAccess": { "allowedDomains": ["none"], "devAllowedDomains": ["http://localhost:3847"] }`
  — `allowedDomains` (the production-facing field) stays at the
  least-privilege `["none"]` it had before Step 5B, and the one addition
  this POC has ever needed — the local bridge's loopback origin — lives
  in `devAllowedDomains`, the field Figma provides specifically for local
  development servers (never `*`, never a GitHub domain, and not exposed
  on the Community page). Figma blocks any request to any other origin
  regardless of what the code attempts. It changed for exactly the same
  reason "Sync to Git" exists — a plugin has no OS/shell/filesystem
  access (see "Why a local bridge…" below), so a scoped loopback `fetch`
  is the only mechanism available for the plugin UI to hand a snapshot to
  anything running locally.
- The network call itself happens in `ui.html`'s iframe context (a normal
  browser context with ordinary `fetch`/CORS semantics), not in `code.js`
  (a separate, more restricted plugin-sandbox thread) — `code.js` only
  ever builds the snapshot object and posts it to the UI via
  `figma.ui.postMessage`.
- Nothing in this plugin ever calls GitHub or any service besides the
  local bridge described above.
- The Export Prism snapshot action downloads a file *from the plugin UI
  iframe* using standard `Blob`/`URL.createObjectURL` browser APIs — this
  is not a Figma-specific write capability, and it never touches the Figma
  document or any network endpoint.

## Why a local bridge, not a direct Figma → GitHub integration

Figma plugin code (`code.js`) runs in a custom sandboxed JS engine with no
Node/OS access: no shell execution, no arbitrary filesystem writes, and no
Git operations of any kind. It cannot write into this repository or run
`figma:sync` itself. The plugin's UI (`ui.html`) is a normal iframe and
*can* make an HTTP request to an explicitly whitelisted origin — so Step
5B uses that one capability to hand the snapshot to a small local
companion process (`scripts/figma-local-bridge.mjs`) that already has
normal Node/filesystem/git access on this machine, and which does nothing
but forward the snapshot into the existing, unmodified `figma-sync.mjs`
pipeline. A direct Figma → GitHub integration was considered and
deliberately not built for this POC — it would require handling GitHub
credentials from inside a Figma-hosted context, which is more attack
surface than a loopback-only local server for no real benefit at this
stage.

## Known limitation

Everything above describes intended behavior. The actual variable/alias
data, exact counts, whether `color/royalBlue/700` exists, and the real
contents of an exported snapshot can only be confirmed by running this
inside Figma Desktop against the real Prism V1 file — this README does not
claim any of those numbers or values in advance.
