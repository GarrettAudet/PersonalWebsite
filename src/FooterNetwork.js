import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motionPreferences";

const CYAN = [0, 224, 255];
const AMBER = [255, 138, 0];
const RESTING_ALPHA = 0.52;
const RESTING_PULSE = 0.06;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (start, end, amount) => start + (end - start) * amount;
const smoothstep = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

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

function deckY(x, height) {
  return height * (0.64 - Math.sin(x * Math.PI) * 0.035);
}

function cableY(x, height) {
  const leftTower = 0.31;
  const rightTower = 0.69;
  const towerTop = height * 0.24;

  if (x < leftTower) {
    const progress = smoothstep((x - 0.06) / (leftTower - 0.06));
    return mix(height * 0.57, towerTop, progress);
  }
  if (x > rightTower) {
    const progress = smoothstep((x - rightTower) / (0.94 - rightTower));
    return mix(towerTop, height * 0.57, progress);
  }

  const progress = (x - leftTower) / (rightTower - leftTower);
  return towerTop + Math.sin(progress * Math.PI) * height * 0.19;
}

function createBridgeTargets(width, height, count) {
  const random = seededRandom(Math.round(width * 19 + height * 31));
  const targets = [];

  for (let index = 0; index < count; index += 1) {
    const selector = index / count;
    let normalizedX;
    let x;
    let y;

    if (selector < 0.28) {
      normalizedX = 0.06 + random() * 0.88;
      x = normalizedX * width;
      y = deckY(normalizedX, height) + (random() - 0.5) * 3;
    } else if (selector < 0.5) {
      normalizedX = 0.06 + random() * 0.88;
      x = normalizedX * width;
      y = cableY(normalizedX, height) + (random() - 0.5) * 3;
    } else if (selector < 0.64) {
      const towerX = random() < 0.5 ? 0.31 : 0.69;
      normalizedX = towerX;
      x = towerX * width + (random() - 0.5) * 3;
      y = mix(height * 0.23, height * 0.74, random());
    } else if (selector < 0.84) {
      const cableIndex = Math.floor(random() * 13);
      normalizedX = 0.12 + (cableIndex / 12) * 0.76;
      x = normalizedX * width + (random() - 0.5) * 2;
      y = mix(cableY(normalizedX, height), deckY(normalizedX, height), random());
    } else {
      normalizedX = 0.08 + random() * 0.84;
      x = normalizedX * width;
      const triangle = Math.abs(((normalizedX * 12) % 2) - 1);
      y = height * (0.69 + triangle * 0.09) + (random() - 0.5) * 2;
    }

    const ambientX = random() * width;
    const ambientY = mix(height * 0.16, height * 0.88, random());
    targets.push({
      x,
      y,
      normalizedX,
      ambientX,
      ambientY,
      driftX: mix(6, 22, random()),
      driftY: mix(4, 14, random()),
      phase: random() * Math.PI * 2,
      size: mix(0.95, 2.15, random()),
      alpha: mix(0.76, 1, random()),
    });
  }

  return targets;
}

function formationAt(time) {
  const cycle = (time % 12000) / 12000;
  if (cycle < 0.16) return 0;
  if (cycle < 0.44) return smoothstep((cycle - 0.16) / 0.28);
  if (cycle < 0.76) return 1;
  return 1 - smoothstep((cycle - 0.76) / 0.24);
}

function drawBridgeLines(context, width, height, formation) {
  if (formation < 0.14) return;

  context.save();
  const gradient = context.createLinearGradient(width * 0.06, 0, width * 0.94, 0);
  gradient.addColorStop(0, "rgba(0,224,255,0.96)");
  gradient.addColorStop(0.5, "rgba(102,247,255,0.9)");
  gradient.addColorStop(0.54, "rgba(255,184,77,0.92)");
  gradient.addColorStop(1, "rgba(255,138,0,0.98)");
  context.strokeStyle = gradient;
  context.lineWidth = mix(1, 1.2, formation);
  context.globalAlpha = formation * 0.76;

  const drawCurve = (resolver) => {
    context.beginPath();
    for (let step = 0; step <= 64; step += 1) {
      const x = 0.06 + (step / 64) * 0.88;
      const pointX = x * width;
      const pointY = resolver(x, height);
      if (step === 0) context.moveTo(pointX, pointY);
      else context.lineTo(pointX, pointY);
    }
    context.stroke();
  };

  drawCurve(deckY);
  drawCurve(cableY);

  [0.31, 0.69].forEach((towerX) => {
    context.beginPath();
    context.moveTo(towerX * width, height * 0.22);
    context.lineTo(towerX * width, height * 0.76);
    context.stroke();
  });

  for (let index = 0; index < 11; index += 1) {
    const x = 0.14 + (index / 10) * 0.72;
    context.beginPath();
    context.moveTo(x * width, cableY(x, height));
    context.lineTo(x * width, deckY(x, height));
    context.stroke();
  }
  context.restore();
}

export default function FooterNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    const reduced = prefersReducedMotion();
    let width = 1;
    let height = 1;
    let pixelRatio = 0;
    let resizeFrame = 0;
    let particles = [];
    let frame = 0;
    let visible = false;
    let activeSince = performance.now();

    const resizeTarget = canvas.parentElement || canvas;

    const resize = () => {
      const rect = resizeTarget.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio && particles.length) return false;
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextPixelRatio;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const particleCount = width < 340 ? 260 : width < 460 ? 430 : 520;
      particles = createBridgeTargets(width, height, particleCount);
      return true;
    };

    const draw = (time, staticFormation) => {
      const elapsed = time - activeSince;
      const formation = staticFormation ?? formationAt(elapsed);
      const breathe = Math.sin(elapsed * 0.0014) * formation;
      context.clearRect(0, 0, width, height);
      drawBridgeLines(context, width, height, formation);

      particles.forEach((particle, index) => {
        const ambientX = particle.ambientX + Math.sin(elapsed * 0.00023 + particle.phase) * particle.driftX;
        const ambientY = particle.ambientY + Math.cos(elapsed * 0.00019 + particle.phase) * particle.driftY;
        const distanceFromCenter = Math.abs(particle.normalizedX - 0.5) * 2;
        const buildBias = clamp(formation * 1.24 - distanceFromCenter * 0.24);
        const localFormation = formation >= 0.98 ? 1 : smoothstep(buildBias);
        const formedX = particle.x;
        const formedY = particle.y + Math.sin(particle.phase + elapsed * 0.001) * (0.7 + breathe * 0.45);
        const x = mix(ambientX, formedX, localFormation);
        const y = mix(ambientY, formedY, localFormation);
        const colorMix = smoothstep((particle.normalizedX - 0.44) / 0.16);
        const red = Math.round(mix(CYAN[0], AMBER[0], colorMix));
        const green = Math.round(mix(CYAN[1], AMBER[1], colorMix));
        const blue = Math.round(mix(CYAN[2], AMBER[2], colorMix));
        const idlePulse = Math.sin(elapsed * 0.0011 + particle.phase) * RESTING_PULSE;
        const alpha = mix(RESTING_ALPHA + idlePulse, particle.alpha, localFormation);
        const size = particle.size * mix(0.94, 1.24, localFormation);

        if (index % 17 === 0) {
          context.beginPath();
          context.fillStyle = `rgba(${red},${green},${blue},${0.055 + 0.13 * localFormation})`;
          context.arc(x, y, size * mix(2.8, 5.2, localFormation), 0, Math.PI * 2);
          context.fill();
        }

        context.fillStyle = `rgba(${red},${green},${blue},${alpha})`;
        context.fillRect(x - size / 2, y - size / 2, size, size);
      });

      context.globalAlpha = 1;
      canvas.dataset.formation = formation > 0.9 ? "formed" : formation > 0.1 ? "forming" : "drifting";
    };

    const render = (time) => {
      frame = 0;
      if (!visible) return;
      draw(time);
      frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (!reduced && !frame && visible) frame = requestAnimationFrame(render);
    };

    const requestResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        if (resize() && reduced) draw(performance.now(), 1);
      });
    };
    const resizeObserver = new ResizeObserver(requestResize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting;
      if (nextVisible && !visible) activeSince = performance.now();
      visible = nextVisible;
      canvas.dataset.renderState = visible ? "active" : "paused";
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (visible) {
        if (reduced) draw(performance.now(), 1);
        else start();
      }
    }, { rootMargin: "80px" });

    canvas.dataset.motionMode = reduced ? "reduced" : "full";
    resizeObserver.observe(resizeTarget);
    visibilityObserver.observe(canvas);
    resize();
    if (reduced) draw(performance.now(), 1);
    else start();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="footer-network" aria-hidden="true" />;
}
