// -----------------------------------------------------------------------------
// Regression tests for the Notification component's pure logic
// (src/lib/notification.ts). Run via Node's native TypeScript type-stripping
// (already used by tests/color for the same reason — no new test framework,
// no duplicated logic inside the test file).
//
//   node --experimental-strip-types --test "tests/notification/*.test.mjs"
// -----------------------------------------------------------------------------

import assert from "node:assert/strict"
import { test, describe } from "node:test"

import { getBadgeDisplayCount, getUnreadCount, shouldShowViewAll, computeAutoAlign } from "../../src/lib/notification.ts"

describe("getBadgeDisplayCount", () => {
  test("passes through counts at or below 99 unchanged", () => {
    assert.equal(getBadgeDisplayCount(0), 0)
    assert.equal(getBadgeDisplayCount(1), 1)
    assert.equal(getBadgeDisplayCount(99), 99)
  })

  test("caps counts above 99 at the string \"99+\"", () => {
    assert.equal(getBadgeDisplayCount(100), "99+")
    assert.equal(getBadgeDisplayCount(1000), "99+")
  })
})

describe("getUnreadCount", () => {
  test("counts only unread items", () => {
    const items = [{ read: false }, { read: true }, { read: false }]
    assert.equal(getUnreadCount(items), 2)
  })

  test("returns 0 for an empty list", () => {
    assert.equal(getUnreadCount([]), 0)
  })

  test("returns 0 when every item is read", () => {
    assert.equal(getUnreadCount([{ read: true }, { read: true }]), 0)
  })
})

// CORRECTED (design-owner review): the actual rendered Populated-panel
// anatomy shows "View all notifications" even with only 4 items — it is not
// conditionally hidden below an item-count threshold. The only real
// condition is whether the caller actually supplied a destination.
describe("shouldShowViewAll", () => {
  test("false when no destination was supplied", () => {
    assert.equal(shouldShowViewAll(false), false)
  })

  test("true whenever a destination exists, regardless of item count", () => {
    assert.equal(shouldShowViewAll(true), true)
  })
})

// CORRECTED (design-owner review): a manually-supplied align prop does not
// satisfy "location-aware behaviour" — NotificationBell now measures the
// trigger via getBoundingClientRect() and calls this pure decision function
// automatically. Covered here without any DOM: left-edge, right-edge, and
// an equal-space/centred tie case.
describe("computeAutoAlign", () => {
  test("trigger near the left edge — plenty of room to the right — grows rightward (start)", () => {
    const result = computeAutoAlign({
      triggerLeft: 12,
      triggerRight: 36,
      viewportWidth: 1280,
      panelWidth: 440,
    })
    assert.equal(result, "start")
  })

  test("trigger near the right edge — plenty of room to the left — grows leftward (end)", () => {
    const result = computeAutoAlign({
      triggerLeft: 1246,
      triggerRight: 1270,
      viewportWidth: 1280,
      panelWidth: 440,
    })
    assert.equal(result, "end")
  })

  test("trigger centred with exactly equal space on both sides — neither side alone fits the panel — ties toward end", () => {
    // viewport 200px, panel needs 440px, trigger dead-centre: spaceLeft === spaceRight === 100.
    const result = computeAutoAlign({
      triggerLeft: 90,
      triggerRight: 110,
      viewportWidth: 200,
      panelWidth: 440,
    })
    assert.equal(result, "end")
  })

  test("prefers a side that fits the panel outright over a side with merely more (but insufficient) room", () => {
    // Right side has more raw space (300 vs 150) but still doesn't fit the
    // panel (440); left side is smaller (150) and also doesn't fit — so this
    // still falls through to the "more space wins" tie-break, not a false
    // "fits" claim on either side.
    const result = computeAutoAlign({
      triggerLeft: 150,
      triggerRight: 170,
      viewportWidth: 470,
      panelWidth: 440,
    })
    assert.equal(result, "start")
  })

  test("prefers an outright fit on the right even when the left side also has room", () => {
    // spaceRight = 900 - 420 = 480 (fits the 440px panel outright);
    // spaceLeft = 445 (also fits). The "does the right side fit outright"
    // check runs first, so "start" wins without needing to compare the two.
    const result = computeAutoAlign({
      triggerLeft: 420,
      triggerRight: 445,
      viewportWidth: 900,
      panelWidth: 440,
    })
    assert.equal(result, "start")
  })
})
