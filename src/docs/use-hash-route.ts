import * as React from "react"

// -----------------------------------------------------------------------------
// Minimal hash router.
//
// Deliberately not react-router: the docs site needs shareable deep links and a
// working back button, and hash routing gives both in ~20 lines with no new
// dependency. Routes look like `#/components/button`.
//
// If the docs ever need nested layouts, loaders or route-level code splitting,
// swap this for react-router — the surface here (`useHashRoute` + `navigate`)
// is small enough to replace without touching page components.
// -----------------------------------------------------------------------------

function readHash() {
  // strip the leading "#"; default to "/" so the index page renders
  return window.location.hash.replace(/^#/, "") || "/"
}

/** Current hash path, e.g. "/components/button". Re-renders on navigation. */
export function useHashRoute() {
  const [path, setPath] = React.useState(readHash)

  React.useEffect(() => {
    const onChange = () => setPath(readHash())
    window.addEventListener("hashchange", onChange)
    // Re-sync in case the hash changed between first render and effect setup.
    onChange()
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  return path
}

/** Navigate without a full page load. */
export function navigate(path: string) {
  window.location.hash = path
}

/**
 * Scroll an in-page anchor into view and reflect it in the URL, without
 * letting the hash router treat it as a route change (we keep the route in the
 * hash, so section anchors are handled manually rather than via `#id`).
 */
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}
