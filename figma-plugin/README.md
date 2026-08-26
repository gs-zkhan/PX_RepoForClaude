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
example", and "Export Prism snapshot". Clicking any of them prints
structured JSON in the panel.

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

## Syncing a snapshot into the repo

The full current flow, end to end:

1. Open **Prism V1** in Figma.
2. Run **Prism Pipeline POC** (this plugin).
3. Click **Export Prism snapshot**.
4. From the repo root, run:
   ```bash
   npm run figma:sync -- --snapshot="/path/to/prism-figma-snapshot.json"
   ```
5. The automation (`scripts/figma-sync.mjs`) validates the snapshot, dry-runs
   the importer, applies only deterministic literal changes, re-validates,
   regenerates CSS, builds, and — only if every one of those steps
   succeeds — creates a `figma-sync/<timestamp>` branch, commits, and
   pushes it.
6. A branch is prepared for a pull request into `main` (created
   automatically via `gh` if available and authenticated; otherwise the
   command prints the exact compare URL/next command).
7. The existing **Prism Token CI** workflow runs against that PR, exactly
   as it does for any other PR — this automation does not replace or
   duplicate that gate.
8. A human reviews the PR.
9. A human merges it.

**There is no auto-merge anywhere in this flow.** If the snapshot contains
no new safe changes (for example, because it was already synced), the
command reports that and exits without creating a branch, commit, PR, or
push. See [`scripts/figma-sync.mjs`](../scripts/figma-sync.mjs) and
[`scripts/figma-snapshot-import.mjs`](../scripts/figma-snapshot-import.mjs)
for exactly what is and isn't applied automatically (only deterministic
literal value changes — alias-target changes and the known pre-existing
literal/alias structural differences always require manual review).

## Read-only / network safety

- `manifest.json` declares `"networkAccess": { "allowedDomains": ["none"] }`
  — Figma itself blocks any network request this plugin might attempt,
  regardless of the code.
- `code.js` never calls `fetch`, `XMLHttpRequest`, or any Figma API that
  creates/renames/deletes/sets a value on a node, variable, or collection.
  Every Figma API call it makes is a read (`getLocalVariableCollectionsAsync`,
  `getLocalVariablesAsync`, `getVariableByIdAsync`,
  `getVariableCollectionByIdAsync`).
- Nothing in this plugin writes to this repository, calls GitHub, or talks
  to any other service.
- The Export Prism snapshot action downloads a file *from the plugin UI
  iframe* using standard `Blob`/`URL.createObjectURL` browser APIs — this
  is not a Figma-specific write capability, and it never touches the Figma
  document, this repository, or any network endpoint.

## Known limitation

Everything above describes intended behavior. The actual variable/alias
data, exact counts, whether `color/royalBlue/700` exists, and the real
contents of an exported snapshot can only be confirmed by running this
inside Figma Desktop against the real Prism V1 file — this README does not
claim any of those numbers or values in advance.
