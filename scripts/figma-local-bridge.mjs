import http from "node:http"
import crypto from "node:crypto"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"

// Step 5B: a minimal local HTTP bridge that lets the Figma plugin trigger
// the already-proven `figma:sync` pipeline with one click, instead of the
// current manual "export a file, then run a command by hand" handoff.
//
// Why this exists: a Figma plugin sandbox cannot execute shell commands or
// write to an arbitrary filesystem path (see figma-plugin/README.md,
// "Local sync bridge" section, for the investigation this is based on).
// The only Figma-supported way for a plugin to reach a local process is an
// HTTP request to an origin explicitly whitelisted in manifest.json's
// networkAccess.devAllowedDomains — this process is that origin. It never
// talks to Figma or GitHub itself; it only accepts an already-built
// snapshot over HTTP and hands it, unmodified, to the existing
// figma-sync.mjs orchestrator (which itself calls the existing importer,
// validator, and generator — nothing here reimplements any of that).
//
// Security posture (see figma-plugin README / final report for the full
// reasoning): binds to loopback addresses only — 127.0.0.1 and ::1, never
// 0.0.0.0 or "::" — requires a random per-session bearer token printed to
// this terminal (never persisted, never logged to a file), rejects
// anything that isn't exactly POST /sync or GET /health, enforces a
// body-size cap, validates snapshot shape before touching the filesystem,
// and never shells out — the sync script is invoked via spawnSync with an
// argument array, never a concatenated shell string.

const PORT = 3847
const MAX_BODY_BYTES = 20 * 1024 * 1024 // ~20MB — generous vs. the observed ~1.4MB snapshot
const EXPECTED_FIGMA_FILE_NAME = "Prism V1 - ShadCN"
const SUPPORTED_SCHEMA_VERSION = "1.0.0"

const root = process.cwd()
const sessionToken = crypto.randomBytes(16).toString("hex")

// Figma's plugin UI iframe is sandboxed with "allow-scripts" but not
// "allow-same-origin", which per the HTML spec gives it an opaque origin —
// browsers send this as the literal header `Origin: null`. Confirmed by
// reproducing the exact symptom (a same-shaped sandboxed iframe fetching
// this bridge fails with "Failed to fetch", with no CORS headers on the
// response) — this is a standard, spec-defined behavior, not specific to
// this bridge's code. Only that exact literal is allowed here — never
// "*", and no other Origin value is ever echoed back, since nothing else
// is expected to call this bridge.
function buildCorsHeaders(req) {
  if (req.headers.origin !== "null") return {}
  return {
    "Access-Control-Allow-Origin": "null",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

function sendJson(res, status, body, corsHeaders = {}) {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
    ...corsHeaders,
  })
  res.end(json)
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on("data", (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error("Request body too large"))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => resolve(Buffer.concat(chunks)))
    req.on("error", reject)
  })
}

// Checked before anything touches the filesystem or git. Mirrors (but does
// not replace) the deeper checks figma-sync.mjs and the importer already
// do — this is a fast, cheap reject for the bridge's own endpoint, not a
// substitute for their validation.
function validateSnapshotShape(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return "Snapshot is not a JSON object"
  if (snapshot.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    return `Unsupported schemaVersion "${snapshot.schemaVersion}" (expected "${SUPPORTED_SCHEMA_VERSION}")`
  }
  if (snapshot.figmaFileName !== EXPECTED_FIGMA_FILE_NAME) {
    return `Unexpected figmaFileName "${snapshot.figmaFileName}" (expected "${EXPECTED_FIGMA_FILE_NAME}")`
  }
  if (!Array.isArray(snapshot.collections) || !Array.isArray(snapshot.variables)) {
    return "Snapshot is missing 'collections'/'variables' arrays"
  }
  if (typeof snapshot.totalCollections !== "number" || typeof snapshot.totalVariables !== "number") {
    return "Snapshot is missing numeric totalCollections/totalVariables"
  }
  return null
}

const requestHandler = async (req, res) => {
  const cors = buildCorsHeaders(req)

  // The browser's own preflight for POST /sync — triggered by the
  // Authorization header and the application/json Content-Type, neither
  // of which qualifies as a CORS "simple request". Answered before any
  // routing, auth, or body handling: OPTIONS never requires the session
  // token (a preflight can't carry it) and never touches the filesystem
  // or figma-sync.mjs.
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors)
    res.end()
    return
  }

  if (req.method === "GET" && req.url === "/health") {
    // Deliberately no token required: reveals only "a bridge is running",
    // nothing sensitive, and the plugin needs to check this before it has
    // anywhere to get a token from the user yet.
    sendJson(res, 200, { status: "ok" }, cors)
    return
  }

  if (req.method !== "POST" || req.url !== "/sync") {
    sendJson(res, 404, { error: "Not found" }, cors)
    return
  }

  const authHeader = req.headers["authorization"] ?? ""
  const providedToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null
  if (providedToken !== sessionToken) {
    sendJson(res, 401, { error: "Missing or incorrect bridge token" }, cors)
    return
  }

  let bodyBuffer
  try {
    bodyBuffer = await readBody(req, MAX_BODY_BYTES)
  } catch {
    sendJson(res, 413, { error: "Request body too large" }, cors)
    return
  }

  let snapshot
  try {
    snapshot = JSON.parse(bodyBuffer.toString("utf8"))
  } catch (error) {
    sendJson(res, 400, { error: `Invalid JSON: ${error.message}` }, cors)
    return
  }

  const shapeError = validateSnapshotShape(snapshot)
  if (shapeError) {
    sendJson(res, 400, { error: shapeError }, cors)
    return
  }

  // OS temp directory, never a repo-relative path chosen by the request —
  // the client only ever supplies JSON content, never a path or command.
  const tempPath = path.join(os.tmpdir(), `prism-figma-snapshot-bridge-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.json`)

  try {
    fs.writeFileSync(tempPath, bodyBuffer)

    console.log(`\n[bridge] Received snapshot (${snapshot.totalVariables} variables). Running figma:sync...`)

    // Argument array, not a shell string — the snapshot's own content is
    // never interpolated into a command line.
    const syncResult = spawnSync(
      process.execPath,
      [path.join(root, "scripts", "figma-sync.mjs"), `--snapshot=${tempPath}`],
      { cwd: root, encoding: "utf8" },
    )

    const output = `${syncResult.stdout ?? ""}\n${syncResult.stderr ?? ""}`.trim()
    console.log(output)

    sendJson(
      res,
      syncResult.status === 0 ? 200 : 500,
      {
        success: syncResult.status === 0,
        exitCode: syncResult.status,
        output,
      },
      cors,
    )
  } catch (error) {
    sendJson(res, 500, { error: `Bridge failed: ${error.message}` }, cors)
  } finally {
    try {
      fs.unlinkSync(tempPath)
    } catch {
      // Already gone, or never created — fine either way.
    }
  }
}

// The Figma manifest's devAllowedDomains entry is "http://localhost:3847",
// and "localhost" can resolve to the IPv6 loopback (::1) before falling
// back to IPv4 (127.0.0.1) — confirmed on this Mac (curl tries [::1] first,
// gets ECONNREFUSED, then falls back to 127.0.0.1). Not every HTTP client
// falls back as forgivingly, so a second server, bound to the IPv6
// loopback address, removes the failed first attempt entirely. Both
// addresses are loopback-only — never 0.0.0.0 and never the IPv6
// all-interfaces "::".
const HOST_V4 = "127.0.0.1"
const HOST_V6 = "::1"

const serverV4 = http.createServer(requestHandler)
const serverV6 = http.createServer(requestHandler)

serverV4.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`\nPort ${PORT} is already in use on ${HOST_V4}.`)
    console.error(`Either another "npm run figma:bridge" is already running, or something else is using this port.`)
    process.exit(1)
  }
  console.error(`\nBridge server error (${HOST_V4}): ${error.message}`)
  process.exit(1)
})

// Non-fatal: some environments have IPv6 disabled entirely. The IPv4
// loopback listener above is the one the bridge actually depends on; this
// one only exists to make "localhost" resolve on the first try.
serverV6.on("error", (error) => {
  console.error(`\nNote: could not also listen on ${HOST_V6}:${PORT} (${error.message}).`)
  console.error(`The bridge is still reachable via 127.0.0.1 and via localhost (with an IPv6-then-IPv4 fallback, if your HTTP client supports it).`)
})

serverV4.listen(PORT, HOST_V4, () => {
  console.log(`Prism Figma local bridge listening on http://${HOST_V4}:${PORT} (and http://${HOST_V6}:${PORT})`)
  console.log(`  Health check: GET  http://localhost:${PORT}/health`)
  console.log(`  Sync:         POST http://localhost:${PORT}/sync`)
  console.log("")
  console.log(`Session token (paste into the plugin's "Sync to Git" token field):`)
  console.log(`  ${sessionToken}`)
  console.log("")
  console.log("This token is only valid for this bridge session — it is never written to disk.")
  console.log("Press Ctrl+C to stop.")
})

serverV6.listen(PORT, HOST_V6)
