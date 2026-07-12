export function prefersReducedMotion() {
  const motionMode = new URLSearchParams(window.location.search).get("motion");
  const reduced = motionMode === "reduce";
  document.documentElement.classList.toggle("motion-reduced", reduced);
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  return reduced;
}
