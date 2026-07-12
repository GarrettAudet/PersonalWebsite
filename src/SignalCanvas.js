import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "./motionPreferences";

const FOCAL_X = 0.72;
const FOCAL_Y = 0.38;

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

const flowVertex = [
  "uniform float uTime;",
  "uniform vec2 uPointer;",
  "uniform float uPointerStrength;",
  "uniform float uPixelRatio;",
  "uniform float uTextShield;",
  "attribute vec3 aSeed;",
  "varying float vAmber;",
  "varying float vAlpha;",
  "varying float vPattern;",
  "vec2 flowPosition(float progress, vec3 seed) {",
  "  float x = fract(progress + uTime * (0.014 + seed.z * 0.012));",
  "  float chaoticWave = sin(x * 9.8 + seed.x * 6.283 + uTime * (0.38 + seed.z * 0.14));",
  "  chaoticWave += sin(x * 21.0 + seed.y * 4.8 - uTime * 0.24) * 0.28;",
  "  float distributedY = 0.38 + chaoticWave * (0.12 + seed.z * 0.045) + (seed.y - 0.5) * 0.42;",
  "  float lane = floor(seed.y * 5.0);",
  "  float laneOffset = (lane - 2.0) * 0.055;",
  "  float orderedWave = sin(x * 14.0 + lane * 1.37 + uTime * (0.16 + seed.z * 0.04));",
  "  float orderedY = 0.38 + laneOffset + orderedWave * (0.016 + seed.z * 0.009);",
  "  float emerging = smoothstep(0.24, 0.50, x) * (1.0 - smoothstep(0.56, 0.72, x));",
  "  float structuredY = mix(distributedY, orderedY, emerging * 0.82);",
  "  float convergence = smoothstep(0.50, 0.72, x);",
  "  float release = smoothstep(0.72, 1.0, x);",
  "  float y = mix(structuredY, 0.38, convergence * 0.94);",
  "  float outcomeLane = (floor(seed.y * 3.0) - 1.0) * 0.13;",
  "  float outcomeY = 0.38 + outcomeLane + sin(x * 12.0 + lane * 1.8 + uTime * 0.2) * (0.03 + seed.z * 0.015);",
  "  y = mix(y, outcomeY, release);",
  "  vec2 p = vec2(x, y);",
  "  vec2 delta = uPointer - p;",
  "  float influence = (1.0 - smoothstep(0.0, 0.24, length(delta))) * uPointerStrength;",
  "  return p + delta * influence * (0.035 + seed.z * 0.025);",
  "}",
  "void main() {",
  "  vec2 p = flowPosition(position.x, aSeed);",
  "  float emerging = smoothstep(0.24, 0.50, p.x) * (1.0 - smoothstep(0.56, 0.72, p.x));",
  "  gl_Position = vec4(p.x * 2.0 - 1.0, (1.0 - p.y) * 2.0 - 1.0, 0.0, 1.0);",
  "  gl_PointSize = mix(1.0, 2.55, aSeed.z) * mix(1.0, 1.28, emerging) * uPixelRatio;",
  "  float nearNode = 1.0 - smoothstep(0.0, 0.22, abs(p.x - 0.72));",
  "  vPattern = emerging;",
  "  vAmber = clamp(smoothstep(0.60, 0.80, p.x) + nearNode * 0.55 + step(0.84, p.x) * aSeed.x * 0.28, 0.0, 1.0);",
  "  vAlpha = mix(0.18, 0.86, aSeed.z) * mix(0.42, 1.0, nearNode) * mix(0.84, 1.42, emerging);",
  "  vAlpha *= mix(0.08, 1.0, smoothstep(uTextShield, uTextShield + 0.08, p.x));",
  "}",
].join("\n");
const pointFragment = [
  "varying float vAmber;",
  "varying float vAlpha;",
  "varying float vPattern;",
  "void main() {",
  "  float radius = length(gl_PointCoord - 0.5);",
  "  float core = 1.0 - smoothstep(0.18, 0.5, radius);",
  "  vec3 cyan = vec3(0.012, 0.785, 0.953);",
  "  vec3 cyanSignal = vec3(0.28, 0.91, 1.0);",
  "  vec3 amber = vec3(1.0, 0.624, 0.11);",
  "  vec3 color = mix(cyan, amber, vAmber);",
  "  color = mix(color, cyanSignal, vPattern * (1.0 - vAmber) * 0.34);",
  "  gl_FragColor = vec4(color, core * vAlpha);",
  "}",
].join("\n");
const lineVertex = [
  "uniform float uTime;",
  "uniform vec2 uPointer;",
  "uniform float uPointerStrength;",
  "uniform float uTextShield;",
  "attribute vec3 aSeed;",
  "varying float vAmber;",
  "varying float vAlpha;",
  "varying float vPattern;",
  "vec2 flowPosition(float x, vec3 seed) {",
  "  float chaoticWave = sin(x * 9.8 + seed.x * 6.283 + uTime * (0.24 + seed.z * 0.08));",
  "  chaoticWave += sin(x * 20.0 + seed.y * 4.2 - uTime * 0.15) * 0.22;",
  "  float distributedY = 0.38 + chaoticWave * (0.105 + seed.z * 0.035) + (seed.y - 0.5) * 0.34;",
  "  float lane = floor(seed.y * 5.0);",
  "  float laneOffset = (lane - 2.0) * 0.055;",
  "  float orderedY = 0.38 + laneOffset + sin(x * 14.0 + lane * 1.37 + uTime * 0.13) * (0.014 + seed.z * 0.008);",
  "  float emerging = smoothstep(0.24, 0.50, x) * (1.0 - smoothstep(0.56, 0.72, x));",
  "  float structuredY = mix(distributedY, orderedY, emerging * 0.88);",
  "  float convergence = smoothstep(0.50, 0.72, x);",
  "  float release = smoothstep(0.72, 1.0, x);",
  "  float y = mix(structuredY, 0.38, convergence * 0.95);",
  "  float outcomeLane = (floor(seed.y * 3.0) - 1.0) * 0.13;",
  "  y = mix(y, 0.38 + outcomeLane + sin(x * 12.0 + lane * 1.8 + uTime * 0.16) * 0.028, release);",
  "  vec2 p = vec2(x, y);",
  "  vec2 delta = uPointer - p;",
  "  float influence = (1.0 - smoothstep(0.0, 0.24, length(delta))) * uPointerStrength;",
  "  return p + delta * influence * (0.025 + seed.z * 0.018);",
  "}",
  "void main() {",
  "  vec2 p = flowPosition(position.x, aSeed);",
  "  float emerging = smoothstep(0.24, 0.50, p.x) * (1.0 - smoothstep(0.56, 0.72, p.x));",
  "  gl_Position = vec4(p.x * 2.0 - 1.0, (1.0 - p.y) * 2.0 - 1.0, 0.0, 1.0);",
  "  float nearNode = 1.0 - smoothstep(0.0, 0.2, abs(p.x - 0.72));",
  "  vPattern = emerging;",
  "  vAmber = clamp(smoothstep(0.62, 0.84, p.x) + nearNode * 0.45, 0.0, 1.0);",
  "  float textShield = mix(0.05, 1.0, smoothstep(uTextShield, uTextShield + 0.08, p.x));",
  "  vAlpha = mix(0.055, 0.26, aSeed.z) * mix(0.8, 1.65, emerging) * textShield;",
  "}",
].join("\n");
const lineFragment = [
  "varying float vAmber;",
  "varying float vAlpha;",
  "varying float vPattern;",
  "void main() {",
  "  vec3 cyan = vec3(0.012, 0.785, 0.953);",
  "  vec3 cyanSignal = vec3(0.28, 0.91, 1.0);",
  "  vec3 amber = vec3(1.0, 0.624, 0.11);",
  "  vec3 color = mix(cyan, amber, vAmber);",
  "  color = mix(color, cyanSignal, vPattern * (1.0 - vAmber) * 0.38);",
  "  gl_FragColor = vec4(color, vAlpha);",
  "}",
].join("\n");
const focalVertex = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const focalFragment = [
  "uniform float uTime;",
  "uniform float uReduced;",
  "varying vec2 vUv;",
  "void main() {",
  "  float d = length(vUv - 0.5);",
  "  float pulse = mix(1.0, 0.92 + sin(uTime * 1.3) * 0.08, 1.0 - uReduced);",
  "  float core = 1.0 - smoothstep(0.0, 0.045 * pulse, d);",
  "  float whiteCore = 1.0 - smoothstep(0.0, 0.014, d);",
  "  float glow = (1.0 - smoothstep(0.02, 0.47, d)) * 0.68;",
  "  float ringOne = (1.0 - smoothstep(0.006, 0.012, abs(d - fract(uTime * 0.045) * 0.38))) * 0.16 * (1.0 - uReduced);",
  "  float ringTwo = (1.0 - smoothstep(0.006, 0.012, abs(d - fract(uTime * 0.045 + 0.5) * 0.38))) * 0.11 * (1.0 - uReduced);",
  "  vec3 amber = vec3(1.0, 0.624, 0.11);",
  "  vec3 cyan = vec3(0.16, 0.85, 1.0);",
  "  vec3 color = mix(cyan, amber, smoothstep(0.42, 0.05, d));",
  "  color = mix(color, vec3(1.0), whiteCore);",
  "  gl_FragColor = vec4(color, max(max(glow, core), ringOne + ringTwo));",
  "}",
].join("\n");

function particleCount(width) {
  if (width < 560) return 1600;
  if (width < 900) return 3800;
  if (width < 1280) return 6200;
  return 8200;
}

function buildPointCloud(count, random) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = random();
    seeds[index * 3] = random();
    seeds[index * 3 + 1] = random();
    seeds[index * 3 + 2] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
  return geometry;
}

function buildRibbonGeometry(random) {
  const positions = [];
  const seeds = [];
  for (let ribbon = 0; ribbon < 42; ribbon += 1) {
    const seed = [random(), random(), random()];
    for (let segment = 0; segment < 120; segment += 1) {
      positions.push(segment / 120, 0, 0, (segment + 1) / 120, 0, 0);
      seeds.push(seed[0], seed[1], seed[2], seed[0], seed[1], seed[2]);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 3));
  return geometry;
}

export default function SignalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return undefined;
    const canvas = canvasRef.current;
    const hero = canvas && canvas.closest(".hero");
    if (!canvas || !hero) return undefined;

    const reduced = prefersReducedMotion();
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    let pointGeometry;
    let points;
    let width = 1;
    let height = 1;
    let frame;
    let visible = true;
    let pointerStrength = 0;
    const pointerTarget = new THREE.Vector2(FOCAL_X, FOCAL_Y);
    const pointer = new THREE.Vector2(FOCAL_X, FOCAL_Y);
    const sharedUniforms = {
      uTime: { value: 0 },
      uPointer: { value: pointer },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: 1 },
      uTextShield: { value: 0.34 },
    };

    const pointMaterial = new THREE.ShaderMaterial({ uniforms: sharedUniforms, vertexShader: flowVertex, fragmentShader: pointFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const lineMaterial = new THREE.ShaderMaterial({ uniforms: sharedUniforms, vertexShader: lineVertex, fragmentShader: lineFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const lines = new THREE.LineSegments(buildRibbonGeometry(seededRandom(9174)), lineMaterial);
    scene.add(lines);

    const focalMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: sharedUniforms.uTime, uReduced: { value: reduced ? 1 : 0 } },
      vertexShader: focalVertex,
      fragmentShader: focalFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const focal = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.27), focalMaterial);
    focal.position.set(FOCAL_X * 2 - 1, (1 - FOCAL_Y) * 2 - 1, 0);
    scene.add(focal);

    const rebuildPoints = () => {
      if (pointGeometry) pointGeometry.dispose();
      if (points) scene.remove(points);
      pointGeometry = buildPointCloud(particleCount(width), seededRandom(Math.round(width * 31 + height)));
      points = new THREE.Points(pointGeometry, pointMaterial);
      scene.add(points);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const changedBreakpoint = particleCount(width) !== particleCount(nextWidth);
      width = nextWidth;
      height = nextHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      sharedUniforms.uPixelRatio.value = ratio;
      sharedUniforms.uTextShield.value = window.innerWidth < 768 ? -0.08 : 0.34;
      if (!points || changedBreakpoint) rebuildPoints();
      renderer.render(scene, camera);
    };

    const movePointer = (event) => {
      if (touch || reduced) return;
      const rect = hero.getBoundingClientRect();
      pointerTarget.set(
        THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1),
        THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height, 0, 1),
      );
      pointerStrength = 1;
    };

    const leavePointer = () => {
      pointerTarget.set(FOCAL_X, FOCAL_Y);
      pointerStrength = 0;
    };

    const render = (time) => {
      sharedUniforms.uTime.value = time * 0.001;
      pointer.lerp(pointerTarget, pointerStrength > 0 ? 0.1 : 0.025);
      sharedUniforms.uPointerStrength.value += (pointerStrength - sharedUniforms.uPointerStrength.value) * (pointerStrength > 0 ? 0.1 : 0.025);
      if (visible) renderer.render(scene, camera);
      if (!reduced) frame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      canvas.dataset.renderState = visible ? "active" : "paused";
      if (visible && reduced) renderer.render(scene, camera);
    }, { rootMargin: "80px" });

    canvas.dataset.renderState = "active";
    canvas.dataset.motionMode = reduced ? "reduced" : "full";
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    hero.addEventListener("pointermove", movePointer, { passive: true });
    hero.addEventListener("pointerleave", leavePointer);
    resize();
    if (!reduced) frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      hero.removeEventListener("pointermove", movePointer);
      hero.removeEventListener("pointerleave", leavePointer);
      if (pointGeometry) pointGeometry.dispose();
      lines.geometry.dispose();
      focal.geometry.dispose();
      pointMaterial.dispose();
      lineMaterial.dispose();
      focalMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}
