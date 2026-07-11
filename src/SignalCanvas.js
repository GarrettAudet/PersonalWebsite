import React, { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

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

function buildParticles(count) {
  const random = seededRandom(74091);
  return Array.from({ length: count }, (_, index) => {
    const layerRoll = random();
    const layer = layerRoll < 0.18 ? 0 : layerRoll < 0.68 ? 1 : 2;
    const amber = random() > (layer === 0 ? 0.78 : 0.7);
    return {
      x: random(),
      offset: (random() - 0.5) * (amber ? 0.36 : 0.43),
      phase: random() * TAU,
      size: (0.35 + random() * (index % 17 === 0 ? 2.15 : 1.05)) * (0.78 + layer * 0.2),
      alpha: (0.14 + random() * 0.68) * (0.7 + layer * 0.15),
      speed: 0.000005 + random() * 0.000012 + layer * 0.000003,
      amber,
      layer,
    };
  });
}

function waveY(x, time, amber, phase = 0, depth = 1) {
  const drift = time * (0.00013 + depth * 0.000035);
  if (amber) {
    return 0.53 + Math.sin(x * Math.PI * 2.28 + 2.72 - drift + phase) * 0.115 + Math.sin(x * Math.PI * 5.2 + drift * 0.64) * 0.028;
  }
  return 0.49 + Math.sin(x * Math.PI * 2.12 + 0.36 + drift + phase) * 0.158 + Math.sin(x * Math.PI * 5.9 - drift * 0.52) * 0.034;
}

function traceWave(context, width, height, time, options) {
  const { amber, depth, phase = 0, offset = 0, alpha, lineWidth } = options;
  context.beginPath();
  for (let px = -12; px <= width + 12; px += depth === 0 ? 10 : 7) {
    const x = px / width;
    const y = waveY(x, time, amber, phase, depth) * height + offset;
    if (px === -12) context.moveTo(px, y);
    else context.lineTo(px, y);
  }
  context.strokeStyle = amber ? `rgba(255,178,63,${alpha})` : `rgba(30,195,255,${alpha})`;
  context.lineWidth = lineWidth;
  context.stroke();
}

function drawRibbon(canvas, context, particles, time, parallax) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = "lighter";

  const cyanGlow = context.createRadialGradient(width * 0.57, height * 0.49, 0, width * 0.57, height * 0.49, width * 0.44);
  cyanGlow.addColorStop(0, "rgba(30,195,255,0.1)");
  cyanGlow.addColorStop(0.46, "rgba(30,195,255,0.035)");
  cyanGlow.addColorStop(1, "rgba(30,195,255,0)");
  context.fillStyle = cyanGlow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(parallax.x * 0.18, parallax.y * 0.18);
  context.filter = "blur(5px)";
  for (let line = 0; line < 8; line += 1) {
    traceWave(context, width, height, time * 0.34, {
      amber: line >= 6,
      depth: 0,
      phase: line * 0.045,
      offset: (line - 3.5) * 6.5,
      alpha: line >= 6 ? 0.055 : 0.045,
      lineWidth: 5.2,
    });
  }
  context.restore();

  context.save();
  context.translate(parallax.x * 0.48, parallax.y * 0.48);
  context.filter = "none";
  for (let line = 0; line < 38; line += 1) {
    const amber = line >= 26;
    const local = amber ? line - 26 : line;
    const center = amber ? 5.5 : 12.5;
    traceWave(context, width, height, time * 0.68, {
      amber,
      depth: 1,
      phase: local * (amber ? 0.034 : 0.024),
      offset: (local - center) * (amber ? 2.45 : 1.7),
      alpha: amber ? 0.075 + local * 0.01 : 0.052 + local * 0.0035,
      lineWidth: amber ? 0.72 : 0.58,
    });
  }
  context.restore();

  context.save();
  context.translate(parallax.x, parallax.y);
  [false, true].forEach((amber) => {
    context.shadowColor = amber ? "rgba(255,178,63,0.52)" : "rgba(34,228,255,0.5)";
    context.shadowBlur = 9;
    traceWave(context, width, height, time, {
      amber,
      depth: 2,
      alpha: 0.88,
      lineWidth: amber ? 1.35 : 1.28,
    });
  });
  context.shadowBlur = 0;

  particles.forEach((particle, index) => {
    const depth = 0.45 + particle.layer * 0.34;
    const xNorm = (particle.x + time * particle.speed * depth) % 1;
    const envelope = 0.24 + Math.sin(xNorm * Math.PI) * 0.76;
    const yNorm = waveY(xNorm, time * depth, particle.amber, particle.phase * 0.02, particle.layer) + particle.offset * envelope;
    const x = xNorm * width + parallax.x * depth;
    const y = yNorm * height + parallax.y * depth;
    const color = particle.amber ? "255,178,63" : "30,195,255";

    if (index % 23 === 0 && particle.layer > 0) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, waveY(xNorm, time * depth, particle.amber, 0, particle.layer) * height + parallax.y * depth);
      context.strokeStyle = `rgba(${color},0.1)`;
      context.lineWidth = 0.5;
      context.stroke();
    }

    context.beginPath();
    context.arc(x, y, particle.size, 0, TAU);
    context.fillStyle = `rgba(${color},${particle.alpha})`;
    context.fill();
  });
  context.restore();
  context.globalCompositeOperation = "source-over";
}

export function AnimatedMetric({ value, label, className, delay = 0 }) {
  const valueRef = useRef(null);

  useEffect(() => {
    const element = valueRef.current;
    if (!element) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const numeric = Number.parseFloat(value);
    const suffix = value.replace(/[\d.]/g, "");
    const decimals = value.includes(".") ? 1 : 0;
    if (reduced) {
      element.textContent = value;
      return undefined;
    }

    let frame;
    const start = performance.now() + delay;
    const duration = 620;
    const tick = (now) => {
      if (now < start) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${(numeric * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [delay, value]);

  return <div className={`metric ${className}`}><strong ref={valueRef}>0</strong><span>{label}</span></div>;
}

export default function SignalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = reduced ? 0.34 : 1;
    let frame;
    let visible = true;
    let particles = [];
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = buildParticles(rect.width < 640 ? 520 : 1450);
      if (process.env.NODE_ENV !== "test") {
        drawRibbon(canvas, context, particles, 0, { x: 0, y: 0 });
      }
    };

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    };

    const render = (time) => {
      pointerX += (targetX - pointerX) * 0.045;
      pointerY += (targetY - pointerY) * 0.045;
      if (visible) drawRibbon(canvas, context, particles, time * motionScale, { x: pointerX, y: pointerY });
      frame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "100px" });
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    resize();
    if (process.env.NODE_ENV !== "test") frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}
