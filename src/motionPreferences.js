export function prefersReducedMotion() {
  const forcedFullMotion =
    process.env.NODE_ENV !== "production" &&
    new URLSearchParams(window.location.search).get("motionTest") === "full";
  document.documentElement.classList.toggle("motion-full-test", forcedFullMotion);
  return !forcedFullMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
