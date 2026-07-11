import React, { useEffect, useRef } from "react";

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
    const amber = random() > 0.7;
    return {
      x: random(),
      offset: (random() - 0.5) * (amber ? 0.31 : 0.38),
      phase: random() * Math.PI * 2,
      size: 0.45 + random() * (index % 13 === 0 ? 2.2 : 1.15),
      alpha: 0.18 + random() * 0.72,
      speed: 0.000007 + random() * 0.000014,
      amber,
    };
  });
}

function waveY(x, time, amber, phase = 0) {
  if (amber) {
    return 0.53 + Math.sin(x * Math.PI * 2.35 + 2.65 - time * 0.00022 + phase) * 0.105 + Math.sin(x * Math.PI * 5.1 + time * 0.00013) * 0.026;
  }
  return 0.48 + Math.sin(x * Math.PI * 2.15 + 0.45 + time * 0.00024 + phase) * 0.145 + Math.sin(x * Math.PI * 5.8 - time * 0.0001) * 0.032;
}

function drawRibbon(canvas, context, particles, time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = "lighter";

  const cyanGlow = context.createRadialGradient(width * 0.54, height * 0.49, 0, width * 0.54, height * 0.49, width * 0.42);
  cyanGlow.addColorStop(0, "rgba(30,195,255,0.08)");
  cyanGlow.addColorStop(1, "rgba(30,195,255,0)");
  context.fillStyle = cyanGlow;
  context.fillRect(0, 0, width, height);

  for (let line = 0; line < 32; line += 1) {
    const amber = line >= 22;
    const local = amber ? line - 22 : line;
    context.beginPath();
    for (let px = -10; px <= width + 10; px += 8) {
      const x = px / width;
      const envelope = 0.34 + Math.sin(Math.max(0, Math.min(1, x)) * Math.PI) * 0.66;
      const offset = (local - (amber ? 4.5 : 10.5)) * (amber ? 2.45 : 1.75) * envelope;
      const y = waveY(x, time, amber, local * 0.028) * height + offset;
      if (px === -10) context.moveTo(px, y);
      else context.lineTo(px, y);
    }
    context.strokeStyle = amber ? `rgba(255,178,63,${0.1 + local * 0.018})` : `rgba(30,195,255,${0.075 + local * 0.006})`;
    context.lineWidth = amber ? 0.85 : 0.7;
    context.stroke();
  }

  const coreLines = [
    { amber: false, color: "rgba(34,228,255,0.8)", width: 1.35 },
    { amber: true, color: "rgba(255,178,63,0.78)", width: 1.4 },
  ];
  coreLines.forEach((line) => {
    context.beginPath();
    for (let px = -10; px <= width + 10; px += 6) {
      const x = px / width;
      const y = waveY(x, time, line.amber) * height;
      if (px === -10) context.moveTo(px, y);
      else context.lineTo(px, y);
    }
    context.strokeStyle = line.color;
    context.lineWidth = line.width;
    context.shadowColor = line.amber ? "rgba(255,178,63,0.45)" : "rgba(34,228,255,0.42)";
    context.shadowBlur = 8;
    context.stroke();
  });
  context.shadowBlur = 0;
  particles.forEach((particle, index) => {
    const xNorm = (particle.x + time * particle.speed) % 1;
    const envelope = 0.22 + Math.sin(xNorm * Math.PI) * 0.78;
    const yNorm = waveY(xNorm, time, particle.amber, particle.phase * 0.018) + particle.offset * envelope;
    const x = xNorm * width;
    const y = yNorm * height;
    const color = particle.amber ? "255,178,63" : "30,195,255";

    if (index % 17 === 0) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, waveY(xNorm, time, particle.amber) * height);
      context.strokeStyle = `rgba(${color},0.09)`;
      context.lineWidth = 0.55;
      context.stroke();
    }

    context.beginPath();
    context.arc(x, y, particle.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(${color},${particle.alpha})`;
    context.fill();
  });

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
    const context = canvas.getContext("2d", { alpha: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = reduced ? 0.35 : 1;
    let frame;
    let visible = true;
    let particles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = buildParticles(rect.width < 640 ? 720 : 1900);
      if (reduced) drawRibbon(canvas, context, particles, 0);
    };

    const render = (time) => {
      if (visible) drawRibbon(canvas, context, particles, time * motionScale);
      frame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "100px" });
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    resize();
    if (process.env.NODE_ENV !== "test") frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}
