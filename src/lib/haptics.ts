// Lightweight haptics. The Web Vibration API works on Android; on iOS it is
// a no-op, where visual press feedback (CSS :active) is the primary cue.

type Pattern = "light" | "medium" | "heavy" | "success" | "error";

const PATTERNS: Record<Pattern, number[]> = {
  light: [5],
  medium: [10],
  heavy: [20],
  success: [5, 40, 5],
  error: [20, 40, 20],
};

export function haptic(pattern: Pattern = "light") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try { navigator.vibrate(PATTERNS[pattern]); } catch { /* ignore */ }
}

// Elements that should feel a light tap when pressed.
const TAP_SELECTOR = [
  ".btn",
  ".row--tappable",
  ".item-row--tappable",
  ".bottom-nav-tab",
  ".bottom-nav-more-item",
  ".pill",
  ".chip",
  ".section-header--interactive",
  ".sheet-close",
  ".fab",
  ".fab-above-nav",
  ".item-checkbox",
  "[role=button]",
].join(",");

let installed = false;

// Delegated listener: fires a light haptic on pressing any interactive element.
export function initHaptics() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener(
    "pointerdown",
    (e) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(TAP_SELECTOR)) haptic("light");
    },
    { passive: true }
  );
}
