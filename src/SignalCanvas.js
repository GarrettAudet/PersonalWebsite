import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "./motionPreferences";

const TAU = Math.PI * 2;
const ROUTE_NODES = [0, 0.14, 0.27, 0.41, 0.55, 0.69, 0.82, 0.92, 1];

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const smoothstep = (start, end, value) => {
  const progress = clamp((value - start) / Math.max(0.0001, end - start));
  return progress * progress * (3 - 2 * progress);
};

const easings = {
  easeInOutSine: (value) => -(Math.cos(Math.PI * value) - 1) / 2,
  easeOutCubic: (value) => 1 - (1 - value) ** 3,
  easeInOutCubic: (value) =>
    value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2,
  easeOutQuad: (value) => 1 - (1 - value) * (1 - value),
  easeOutExpo: (value) => (value === 1 ? 1 : 1 - 2 ** (-10 * value)),
  easeInQuad: (value) => value * value,
};

export const MOTION_PHASES = Object.freeze([
  Object.freeze({
    name: "terrain-idle",
    duration: 4000,
    easing: "easeInOutSine",
  }),
  Object.freeze({
    name: "path-emergence",
    duration: 1200,
    easing: "easeOutCubic",
  }),
  Object.freeze({
    name: "path-extension",
    duration: 3000,
    easing: "easeInOutCubic",
  }),
  Object.freeze({ name: "arrival", duration: 600, easing: "easeOutQuad" }),
  Object.freeze({
    name: "impact-pulse",
    duration: 1600,
    easing: "easeOutExpo",
  }),
  Object.freeze({ name: "fade-reset", duration: 2600, easing: "easeInQuad" }),
]);

export const MOTION_LOOP_MS = MOTION_PHASES.reduce(
  (total, phase) => total + phase.duration,
  0,
);

export function getMotionState(elapsedMilliseconds) {
  const safeElapsed = Math.max(0, elapsedMilliseconds);
  const cycleIndex = Math.floor(safeElapsed / MOTION_LOOP_MS);
  const cycleTime = safeElapsed % MOTION_LOOP_MS;
  let phaseStart = 0;
  let phase = MOTION_PHASES[0];

  for (let index = 0; index < MOTION_PHASES.length; index += 1) {
    const candidate = MOTION_PHASES[index];
    if (
      cycleTime < phaseStart + candidate.duration ||
      index === MOTION_PHASES.length - 1
    ) {
      phase = candidate;
      break;
    }
    phaseStart += candidate.duration;
  }

  const phaseProgress = clamp((cycleTime - phaseStart) / phase.duration);
  const easedProgress = easings[phase.easing](phaseProgress);
  const state = {
    phase: phase.name,
    cycleIndex,
    cycleTime,
    phaseProgress,
    easedProgress,
    routeProgress: 0,
    routeOpacity: 0,
    arrivalProgress: 0,
    impactProgress: 0,
    fadeProgress: 0,
  };

  if (phase.name === "path-emergence") {
    state.routeProgress = easedProgress * 0.14;
    state.routeOpacity = easedProgress;
  } else if (phase.name === "path-extension") {
    state.routeProgress = 0.14 + easedProgress * 0.86;
    state.routeOpacity = 1;
  } else if (phase.name === "arrival") {
    state.routeProgress = 1;
    state.routeOpacity = 1;
    state.arrivalProgress = easedProgress;
  } else if (phase.name === "impact-pulse") {
    state.routeProgress = 1;
    state.routeOpacity = 1;
    state.arrivalProgress = 1;
    state.impactProgress = phaseProgress;
  } else if (phase.name === "fade-reset") {
    state.routeProgress = 1;
    state.routeOpacity = 1 - easedProgress;
    state.arrivalProgress = 1;
    state.fadeProgress = easedProgress;
  }

  return state;
}

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

const TERRAIN_MIN_X = -5.8;
const TERRAIN_MAX_X = 5.8;
const TERRAIN_MIN_Z = -3.5;
const TERRAIN_MAX_Z = 3.2;
const GRID_COLUMNS = 65;
const GRID_ROWS = 33;

export const FIXED_DESTINATION = Object.freeze({
  x: 5.05,
  y: 0.18,
  z: -0.72,
});

function gaussianPeak(x, z, centerX, centerZ, amplitude, spreadX, spreadZ) {
  const offsetX = (x - centerX) / spreadX;
  const offsetZ = (z - centerZ) / spreadZ;
  return amplitude * Math.exp(-(offsetX * offsetX + offsetZ * offsetZ));
}

function mountainHeight(x, z, time) {
  const morph = time * 0.17;
  const firstPeak = gaussianPeak(
    x,
    z,
    -2.15 + Math.sin(morph * 0.72) * 0.42,
    -0.62 + Math.cos(morph * 0.54) * 0.38,
    1.32 + Math.sin(morph * 0.63) * 0.28,
    1.34,
    1.06,
  );
  const secondPeak = gaussianPeak(
    x,
    z,
    0.05 + Math.cos(morph * 0.48) * 0.5,
    0.58 + Math.sin(morph * 0.69) * 0.42,
    1.72 + Math.cos(morph * 0.57) * 0.34,
    1.18,
    1.28,
  );
  const thirdPeak = gaussianPeak(
    x,
    z,
    2.12 + Math.sin(morph * 0.59) * 0.45,
    -1.47 + Math.cos(morph * 0.45) * 0.42,
    1.48 + Math.sin(morph * 0.51 + 1.2) * 0.3,
    1.05,
    0.92,
  );
  const fourthPeak = gaussianPeak(
    x,
    z,
    3.35 + Math.cos(morph * 0.4) * 0.32,
    1.04 + Math.sin(morph * 0.56) * 0.4,
    1.02 + Math.cos(morph * 0.66 + 0.8) * 0.22,
    0.92,
    1.16,
  );
  const ridges =
    Math.sin(x * 1.26 + morph * 0.82) *
      Math.cos(z * 1.18 - morph * 0.57) *
      0.105 +
    Math.sin(x * 2.35 - z * 1.42 + morph * 0.43) * 0.055;
  const rawHeight =
    -0.3 + firstPeak + secondPeak + thirdPeak + fourthPeak + ridges;
  const goalDistance = Math.hypot(
    x - FIXED_DESTINATION.x,
    z - FIXED_DESTINATION.z,
  );
  const goalBlend = smoothstep(0.18, 1.28, goalDistance);
  return lerp(FIXED_DESTINATION.y - 0.11, rawHeight, goalBlend);
}

function particleCount(width) {
  if (width < 560) return 1200;
  if (width < 1000) return 2200;
  if (width < 1280) return 3000;
  if (width < 1920) return 3600;
  if (width < 2560) return 4200;
  return 4800;
}

function buildMountainGeometry() {
  const vertexCount = GRID_COLUMNS * GRID_ROWS;
  const positions = new Float32Array(vertexCount * 3);
  const baseCoordinates = new Float32Array(vertexCount * 2);
  const surfaceIndices = [];
  const contourIndices = [];
  const crossIndices = [];

  for (let row = 0; row < GRID_ROWS; row += 1) {
    const z = lerp(TERRAIN_MIN_Z, TERRAIN_MAX_Z, row / (GRID_ROWS - 1));
    for (let column = 0; column < GRID_COLUMNS; column += 1) {
      const x = lerp(TERRAIN_MIN_X, TERRAIN_MAX_X, column / (GRID_COLUMNS - 1));
      const vertex = row * GRID_COLUMNS + column;
      positions[vertex * 3] = x;
      positions[vertex * 3 + 2] = z;
      baseCoordinates[vertex * 2] = x;
      baseCoordinates[vertex * 2 + 1] = z;

      if (column < GRID_COLUMNS - 1) {
        contourIndices.push(vertex, vertex + 1);
      }
      if (row < GRID_ROWS - 1 && column % 2 === 0) {
        crossIndices.push(vertex, vertex + GRID_COLUMNS);
      }
      if (column < GRID_COLUMNS - 1 && row < GRID_ROWS - 1) {
        const nextRow = vertex + GRID_COLUMNS;
        surfaceIndices.push(
          vertex,
          nextRow,
          vertex + 1,
          nextRow,
          nextRow + 1,
          vertex + 1,
        );
      }
    }
  }

  const positionAttribute = new THREE.BufferAttribute(positions, 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  const surfaceGeometry = new THREE.BufferGeometry();
  surfaceGeometry.setAttribute("position", positionAttribute);
  surfaceGeometry.setIndex(surfaceIndices);
  const contourGeometry = new THREE.BufferGeometry();
  contourGeometry.setAttribute("position", positionAttribute);
  contourGeometry.setIndex(contourIndices);
  const crossGeometry = new THREE.BufferGeometry();
  crossGeometry.setAttribute("position", positionAttribute);
  crossGeometry.setIndex(crossIndices);

  return {
    baseCoordinates,
    positionAttribute,
    surfaceGeometry,
    contourGeometry,
    crossGeometry,
  };
}

function updateMountainGeometry(mountain, time, frameIndex) {
  const positions = mountain.positionAttribute.array;
  for (
    let vertex = 0;
    vertex < mountain.baseCoordinates.length / 2;
    vertex += 1
  ) {
    const x = mountain.baseCoordinates[vertex * 2];
    const z = mountain.baseCoordinates[vertex * 2 + 1];
    positions[vertex * 3 + 1] = mountainHeight(x, z, time);
  }
  mountain.positionAttribute.needsUpdate = true;
  if (frameIndex % 2 === 0) {
    mountain.surfaceGeometry.computeVertexNormals();
  }
}

function buildParticleField(count) {
  const random = seededRandom(7621 + count);
  const positions = new Float32Array(count * 3);
  const baseCoordinates = new Float32Array(count * 2);
  const lifts = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const x = lerp(TERRAIN_MIN_X, TERRAIN_MAX_X, random());
    const z = lerp(TERRAIN_MIN_Z, TERRAIN_MAX_Z, random());
    baseCoordinates[index * 2] = x;
    baseCoordinates[index * 2 + 1] = z;
    lifts[index] = 0.035 + random() * random() * 0.19;
    phases[index] = random() * TAU;
    positions[index * 3] = x;
    positions[index * 3 + 2] = z;
  }

  const positionAttribute = new THREE.BufferAttribute(positions, 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", positionAttribute);
  return { baseCoordinates, lifts, phases, geometry, positionAttribute };
}

function updateParticleField(field, time) {
  const positions = field.positionAttribute.array;
  for (let index = 0; index < field.lifts.length; index += 1) {
    const phase = field.phases[index];
    const x =
      field.baseCoordinates[index * 2] + Math.sin(time * 0.13 + phase) * 0.035;
    const z =
      field.baseCoordinates[index * 2 + 1] +
      Math.cos(time * 0.11 + phase) * 0.03;
    positions[index * 3] = x;
    positions[index * 3 + 1] = mountainHeight(x, z, time) + field.lifts[index];
    positions[index * 3 + 2] = z;
  }
  field.positionAttribute.needsUpdate = true;
}

function lanePosition(lane, laneCount) {
  return lerp(
    TERRAIN_MIN_Z + 0.22,
    TERRAIN_MAX_Z - 0.22,
    lane / (laneCount - 1),
  );
}

export function buildNavigationRoute(cycleIndex) {
  const random = seededRandom(41047 + cycleIndex * 6151);
  const planningTime = cycleIndex * (MOTION_LOOP_MS * 0.001) + 4.8;
  const start = {
    x: -4.95 + random() * 0.42,
    z: 0.2 + random() * 0.9,
  };
  const stepCount = 58;
  const laneCount = 37;
  const costs = Array.from({ length: stepCount }, () =>
    Array(laneCount).fill(Number.POSITIVE_INFINITY),
  );
  const parents = Array.from({ length: stepCount }, () =>
    Array(laneCount).fill(-1),
  );
  const startLane = Math.round(
    ((start.z - (TERRAIN_MIN_Z + 0.22)) /
      (TERRAIN_MAX_Z - TERRAIN_MIN_Z - 0.44)) *
      (laneCount - 1),
  );
  const goalLane = Math.round(
    ((FIXED_DESTINATION.z - (TERRAIN_MIN_Z + 0.22)) /
      (TERRAIN_MAX_Z - TERRAIN_MIN_Z - 0.44)) *
      (laneCount - 1),
  );

  for (let lane = 0; lane < laneCount; lane += 1) {
    costs[0][lane] = (lane - startLane) ** 2 * 7;
  }

  for (let step = 1; step < stepCount; step += 1) {
    const progress = step / (stepCount - 1);
    const x = lerp(start.x, FIXED_DESTINATION.x, progress);
    const previousX = lerp(
      start.x,
      FIXED_DESTINATION.x,
      (step - 1) / (stepCount - 1),
    );
    const guideZ = lerp(start.z, FIXED_DESTINATION.z, progress);
    for (let lane = 0; lane < laneCount; lane += 1) {
      const z = lanePosition(lane, laneCount);
      const height = mountainHeight(x, z, planningTime);
      const elevationCost = Math.max(0, height + 0.18) ** 2 * 8.8;
      const destinationPull = Math.abs(z - guideZ) * (0.35 + progress * 2.5);
      const finalPenalty =
        step === stepCount - 1 && lane !== goalLane ? 10000 : 0;
      const firstPreviousLane = Math.max(0, lane - 4);
      const lastPreviousLane = Math.min(laneCount - 1, lane + 4);

      for (
        let previousLane = firstPreviousLane;
        previousLane <= lastPreviousLane;
        previousLane += 1
      ) {
        const previousZ = lanePosition(previousLane, laneCount);
        const previousHeight = mountainHeight(
          previousX,
          previousZ,
          planningTime,
        );
        const directionCost = (lane - previousLane) ** 2 * 0.32;
        const slopeCost = Math.abs(height - previousHeight) * 0.92;
        const candidate =
          costs[step - 1][previousLane] +
          elevationCost +
          destinationPull +
          directionCost +
          slopeCost +
          finalPenalty;
        if (candidate < costs[step][lane]) {
          costs[step][lane] = candidate;
          parents[step][lane] = previousLane;
        }
      }
    }
  }

  const route = Array(stepCount);
  let lane = goalLane;
  for (let step = stepCount - 1; step >= 0; step -= 1) {
    const progress = step / (stepCount - 1);
    route[step] = {
      x: lerp(start.x, FIXED_DESTINATION.x, progress),
      z: lanePosition(lane, laneCount),
    };
    lane = step > 0 ? parents[step][lane] : lane;
  }

  for (let pass = 0; pass < 6; pass += 1) {
    const smoothed = route.map((point) => ({ ...point }));
    for (let index = 1; index < route.length - 1; index += 1) {
      smoothed[index].z =
        (route[index - 1].z + route[index].z * 2 + route[index + 1].z) / 4;
    }
    for (let index = 1; index < route.length - 1; index += 1) {
      route[index].z = smoothed[index].z;
    }
  }

  route[0] = start;
  route[route.length - 1] = { x: FIXED_DESTINATION.x, z: FIXED_DESTINATION.z };
  return route;
}

function createRouteConfig(cycleIndex, width) {
  const random = seededRandom(24017 + cycleIndex * 7919);
  const compact = width < 560;
  const dust = Array.from({ length: compact ? 42 : 68 }, () => ({
    t: random(),
    offset: (random() - 0.5) * 2,
    size: 0.55 + random() * 1.35,
    reveal: random(),
    phase: random() * TAU,
    alpha: 0.35 + random() * 0.65,
  })).sort((left, right) => left.t - right.t);

  return {
    id: "route-" + cycleIndex,
    worldPath: buildNavigationRoute(cycleIndex),
    dust,
  };
}

function buildRoutePoints(config, time, camera) {
  const projection = new THREE.Vector3();
  return config.worldPath.map((point, index) => {
    const progress = index / (config.worldPath.length - 1);
    let y = mountainHeight(point.x, point.z, time) + 0.13;
    if (progress > 0.9) {
      y = lerp(y, FIXED_DESTINATION.y, smoothstep(0.9, 1, progress));
    }
    projection.set(point.x, y, point.z).project(camera);
    return {
      x: (projection.x + 1) * 0.5,
      y: (1 - projection.y) * 0.5,
    };
  });
}

function pointAlongRoute(points, progress) {
  const scaledIndex = clamp(progress) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(scaledIndex));
  const remainder = scaledIndex - index;
  return {
    x: lerp(points[index].x, points[index + 1].x, remainder),
    y: lerp(points[index].y, points[index + 1].y, remainder),
  };
}

function traceRoute(context, points, progress, width, height) {
  const finalIndex = clamp(progress) * (points.length - 1);
  const wholeIndex = Math.floor(finalIndex);
  context.beginPath();
  context.moveTo(points[0].x * width, points[0].y * height);
  for (let index = 1; index <= wholeIndex; index += 1) {
    context.lineTo(points[index].x * width, points[index].y * height);
  }
  if (wholeIndex < points.length - 1) {
    const remainder = finalIndex - wholeIndex;
    context.lineTo(
      lerp(points[wholeIndex].x, points[wholeIndex + 1].x, remainder) * width,
      lerp(points[wholeIndex].y, points[wholeIndex + 1].y, remainder) * height,
    );
  }
}

function drawGlow(context, x, y, radius, opacity) {
  if (opacity <= 0 || radius <= 0) return;
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, "rgba(255, 250, 218, " + 0.92 * opacity + ")");
  gradient.addColorStop(0.12, "rgba(255, 176, 32, " + 0.68 * opacity + ")");
  gradient.addColorStop(0.48, "rgba(255, 138, 0, " + 0.22 * opacity + ")");
  gradient.addColorStop(1, "rgba(255, 138, 0, 0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  context.fill();
}

function drawRouteOverlay(context, width, height, points, config, state, time) {
  context.clearRect(0, 0, width, height);
  if (state.routeOpacity <= 0 && state.phase !== "path-emergence") {
    return { activeNodes: 0, pulseRings: 0 };
  }

  const opacity = clamp(state.routeOpacity);
  const fade = state.fadeProgress;
  context.save();
  context.globalCompositeOperation = "lighter";

  for (let index = 0; index < config.dust.length; index += 1) {
    const dust = config.dust[index];
    const emergence =
      state.phase === "path-emergence"
        ? smoothstep(dust.reveal - 0.2, dust.reveal + 0.12, state.easedProgress)
        : smoothstep(dust.t - 0.08, dust.t + 0.02, state.routeProgress);
    const dustFade =
      1 -
      smoothstep(0.08 + (1 - dust.t) * 0.62, 0.3 + (1 - dust.t) * 0.62, fade);
    const shimmer = 0.68 + Math.sin(time * 2.2 + dust.phase) * 0.22;
    const dustOpacity = opacity * emergence * dustFade * dust.alpha * shimmer;
    if (dustOpacity <= 0.01) continue;
    const point = pointAlongRoute(points, dust.t);
    const ahead = pointAlongRoute(points, Math.min(1, dust.t + 0.01));
    const tangentX = (ahead.x - point.x) * width;
    const tangentY = (ahead.y - point.y) * height;
    const tangentLength = Math.max(0.001, Math.hypot(tangentX, tangentY));
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;
    const offset = dust.offset * Math.min(width, height) * 0.028;
    context.fillStyle = "rgba(255, 176, 32, " + dustOpacity * 0.72 + ")";
    context.beginPath();
    context.arc(
      point.x * width + normalX * offset,
      point.y * height + normalY * offset,
      dust.size,
      0,
      TAU,
    );
    context.fill();
  }

  if (state.routeProgress > 0.001) {
    const dashOffset = -fade * 58;
    context.setLineDash(
      fade > 0 ? [Math.max(1, 8 - fade * 6), 3 + fade * 11] : [],
    );
    context.lineDashOffset = dashOffset;
    context.lineCap = "round";
    context.lineJoin = "round";

    traceRoute(context, points, state.routeProgress, width, height);
    context.strokeStyle = "rgba(255, 126, 0, " + opacity * 0.13 + ")";
    context.lineWidth = 10;
    context.shadowColor = "rgba(255, 138, 0, 0.82)";
    context.shadowBlur = 20;
    context.stroke();

    traceRoute(context, points, state.routeProgress, width, height);
    context.strokeStyle = "rgba(255, 159, 28, " + opacity * 0.48 + ")";
    context.lineWidth = 3.2;
    context.shadowBlur = 8;
    context.stroke();

    traceRoute(context, points, state.routeProgress, width, height);
    context.strokeStyle = "rgba(255, 208, 102, " + opacity * 0.96 + ")";
    context.lineWidth = 1.15;
    context.shadowBlur = 3;
    context.stroke();
    context.setLineDash([]);
  }

  let activeNodes = 0;
  ROUTE_NODES.forEach((nodeProgress, nodeIndex) => {
    const activation = smoothstep(
      nodeProgress - 0.07,
      nodeProgress + 0.015,
      state.routeProgress,
    );
    const reverseFadeStart = (1 - nodeProgress) * 0.66;
    const reverseFade =
      1 - smoothstep(reverseFadeStart, reverseFadeStart + 0.24, fade);
    const nodeOpacity = opacity * activation * reverseFade;
    if (nodeOpacity <= 0.025) return;
    activeNodes += 1;
    const point = pointAlongRoute(points, nodeProgress);
    const x = point.x * width;
    const y = point.y * height;
    const endpointNode = nodeIndex === ROUTE_NODES.length - 1;
    const radius = endpointNode ? 3.4 : 2.2;
    context.shadowColor = "rgba(255, 159, 28, 0.95)";
    context.shadowBlur = endpointNode ? 15 : 8;
    context.fillStyle = "rgba(255, 185, 55, " + nodeOpacity + ")";
    context.beginPath();
    context.arc(x, y, radius, 0, TAU);
    context.fill();
    context.shadowBlur = 0;
    context.fillStyle = "rgba(255, 255, 238, " + nodeOpacity * 0.9 + ")";
    context.beginPath();
    context.arc(x, y, endpointNode ? 1.45 : 0.9, 0, TAU);
    context.fill();
  });

  if (state.phase === "path-emergence" || state.phase === "path-extension") {
    const leadingPoint = pointAlongRoute(points, state.routeProgress);
    drawGlow(
      context,
      leadingPoint.x * width,
      leadingPoint.y * height,
      18,
      opacity * 0.7,
    );
  }

  const endpointPoint = points[points.length - 1];
  const endpointX = endpointPoint.x * width;
  const endpointY = endpointPoint.y * height;
  const endpointVisible = opacity * smoothstep(0.82, 1, state.routeProgress);
  const impactEnvelope =
    state.phase === "impact-pulse"
      ? Math.sin(Math.PI * state.impactProgress) ** 0.65
      : 0;
  const arrivalScale = 1 + state.arrivalProgress * 0.6;
  drawGlow(
    context,
    endpointX,
    endpointY,
    24 * arrivalScale + impactEnvelope * 23,
    endpointVisible * (0.48 + impactEnvelope * 0.52),
  );

  if (state.phase === "arrival") {
    const compressionRadius = lerp(13, 6, state.easedProgress);
    context.strokeStyle =
      "rgba(255, 194, 74, " + state.easedProgress * 0.58 + ")";
    context.lineWidth = 1.2;
    context.shadowColor = "rgba(255, 159, 28, 0.8)";
    context.shadowBlur = 10;
    context.beginPath();
    context.arc(endpointX, endpointY, compressionRadius, 0, TAU);
    context.stroke();
  }

  let pulseRings = 0;
  if (state.phase === "impact-pulse") {
    const maximumRadius = Math.min(width, height) * (width < 560 ? 0.18 : 0.24);
    for (let ring = 0; ring < 6; ring += 1) {
      const ringStart = ring * 0.075;
      if (state.impactProgress <= ringStart) continue;
      const ringProgress = clamp(
        (state.impactProgress - ringStart) / (1 - ringStart),
      );
      const ringScale = 1 + easings.easeOutExpo(ringProgress) * 5;
      const ringRadius = (maximumRadius / 6) * ringScale;
      const ringOpacity = (1 - ringProgress) * 0.6;
      if (ringOpacity <= 0.005) continue;
      pulseRings += 1;
      context.strokeStyle = "rgba(255, 160, 28, " + ringOpacity + ")";
      context.lineWidth = ring % 2 === 0 ? 1.25 : 0.8;
      context.shadowColor = "rgba(255, 118, 0, 0.7)";
      context.shadowBlur = 9;
      context.beginPath();
      context.arc(endpointX, endpointY, ringRadius, 0, TAU);
      context.stroke();
    }
  }

  context.restore();
  return { activeNodes, pulseRings };
}

const reducedMotionState = Object.freeze({
  phase: "reduced-motion",
  cycleIndex: 0,
  cycleTime: 0,
  phaseProgress: 1,
  easedProgress: 1,
  routeProgress: 1,
  routeOpacity: 0.9,
  arrivalProgress: 0.72,
  impactProgress: 0,
  fadeProgress: 0,
});

export default function SignalCanvas() {
  const visualRef = useRef(null);
  const webglRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return undefined;
    const visual = visualRef.current;
    const webglCanvas = webglRef.current;
    const overlayCanvas = overlayRef.current;
    const hero = visual && visual.closest(".hero");
    if (!visual || !webglCanvas || !overlayCanvas || !hero) return undefined;

    const overlayContext = overlayCanvas.getContext("2d");
    if (!overlayContext) return undefined;
    const reduced = prefersReducedMotion();
    const renderer = new THREE.WebGLRenderer({
      canvas: webglCanvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a12, 0.065);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    const cameraTarget = new THREE.Vector3();
    const mountain = buildMountainGeometry();
    const surfaceMaterial = new THREE.MeshPhongMaterial({
      color: 0x073044,
      emissive: 0x02121b,
      specular: 0x1285a0,
      shininess: 38,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const contourMaterial = new THREE.LineBasicMaterial({
      color: 0x15d9f5,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const crossMaterial = new THREE.LineBasicMaterial({
      color: 0x087f9f,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x3de9ff,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const surface = new THREE.Mesh(mountain.surfaceGeometry, surfaceMaterial);
    const contours = new THREE.LineSegments(
      mountain.contourGeometry,
      contourMaterial,
    );
    const crossLines = new THREE.LineSegments(
      mountain.crossGeometry,
      crossMaterial,
    );
    surface.renderOrder = 0;
    contours.renderOrder = 1;
    crossLines.renderOrder = 1;
    scene.add(surface, contours, crossLines);
    scene.add(new THREE.AmbientLight(0x0b3a50, 2.1));
    const keyLight = new THREE.DirectionalLight(0x53e7ff, 2.4);
    keyLight.position.set(-3.5, 7, 5.5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x0b78a0, 1.4);
    rimLight.position.set(5, 3, -4);
    scene.add(rimLight);

    let particleField;
    let points;
    let width = 1;
    let height = 1;
    let pixelRatio = 0;
    let resizeFrame = 0;
    let animationFrame = 0;
    let visible = true;
    let pausedAt = 0;
    let pausedDuration = 0;
    let lastElapsed = 0;
    let frameIndex = 0;
    let activeCycle = 0;
    let routeConfig = createRouteConfig(0, width);
    const animationStart = performance.now();

    const rebuildParticles = () => {
      const nextCount = particleCount(width);
      if (particleField && particleField.lifts.length === nextCount) return;
      if (points) scene.remove(points);
      if (particleField) particleField.geometry.dispose();
      particleField = buildParticleField(nextCount);
      points = new THREE.Points(particleField.geometry, particleMaterial);
      points.renderOrder = 2;
      points.frustumCulled = false;
      scene.add(points);
      visual.dataset.particleCount = String(nextCount);
    };

    const configureCamera = () => {
      const aspect = width / Math.max(1, height);
      let destinationTargetX;
      camera.aspect = aspect;
      if (width < 560) {
        camera.fov = 47;
        destinationTargetX = 0.74;
        camera.position.set(-2.35, 7.2, 11.2);
        cameraTarget.set(0.95, 0.12, -0.72);
      } else if (width < 1000) {
        camera.fov = 45;
        destinationTargetX = 0.85;
        camera.position.set(-2.85, 7.35, 11.45);
        cameraTarget.set(0.72, 0.15, -0.74);
      } else {
        camera.fov = 32;
        const viewportWidth = window.innerWidth || width;
        destinationTargetX =
          viewportWidth >= 2560
            ? 0.73
            : viewportWidth >= 1920
              ? 0.78
              : viewportWidth >= 1600
                ? 0.82
                : 0.86;
        camera.position.set(-4.8, 6.8, 9);
        cameraTarget.set(0.1, 0.2, -0.72);
      }
      camera.lookAt(cameraTarget);
      camera.updateMatrixWorld();
      const destinationProjection = new THREE.Vector3(
        FIXED_DESTINATION.x,
        FIXED_DESTINATION.y,
        FIXED_DESTINATION.z,
      );
      camera.filmOffset = 0;
      camera.updateProjectionMatrix();
      const baseDestinationX =
        (destinationProjection.project(camera).x + 1) * 0.5;
      destinationProjection.set(
        FIXED_DESTINATION.x,
        FIXED_DESTINATION.y,
        FIXED_DESTINATION.z,
      );
      camera.filmOffset = 1;
      camera.updateProjectionMatrix();
      const unitDestinationX =
        (destinationProjection.project(camera).x + 1) * 0.5;
      camera.filmOffset =
        (destinationTargetX - baseDestinationX) /
        (unitDestinationX - baseDestinationX);
      camera.updateProjectionMatrix();
    };

    const elapsedAt = (time) =>
      Math.max(0, time - animationStart - pausedDuration);

    const renderVisual = (elapsed) => {
      lastElapsed = elapsed;
      const state = reduced ? reducedMotionState : getMotionState(elapsed);
      if (state.cycleIndex !== activeCycle) {
        activeCycle = state.cycleIndex;
        routeConfig = createRouteConfig(activeCycle, width);
      }

      const terrainTime = reduced ? 5.2 : elapsed * 0.001;
      updateMountainGeometry(mountain, terrainTime, frameIndex);
      updateParticleField(particleField, terrainTime);
      frameIndex += 1;
      surfaceMaterial.opacity = 0.27 + Math.sin(terrainTime * 0.34) * 0.035;
      renderer.render(scene, camera);

      const routePoints = buildRoutePoints(routeConfig, terrainTime, camera);
      const endpointPoint = routePoints[routePoints.length - 1];
      const overlayState = drawRouteOverlay(
        overlayContext,
        width,
        height,
        routePoints,
        routeConfig,
        state,
        terrainTime,
      );
      visual.dataset.phase = state.phase;
      visual.dataset.cycle = String(state.cycleIndex);
      visual.dataset.route = routeConfig.id;
      visual.dataset.routeProgress = state.routeProgress.toFixed(3);
      visual.dataset.phaseProgress = state.phaseProgress.toFixed(3);
      visual.dataset.activeNodes = String(overlayState.activeNodes);
      visual.dataset.pulseRings = String(overlayState.pulseRings);
      visual.dataset.destinationX = endpointPoint.x.toFixed(4);
      visual.dataset.destinationY = endpointPoint.y.toFixed(4);
      visual.dataset.routeStartX = routePoints[0].x.toFixed(4);
      visual.dataset.routeStartY = routePoints[0].y.toFixed(4);
      visual.dataset.routeMinX = Math.min(
        ...routePoints.map((point) => point.x),
      ).toFixed(4);
      visual.dataset.routeMaxX = Math.max(
        ...routePoints.map((point) => point.x),
      ).toFixed(4);
      visual.dataset.routeMinY = Math.min(
        ...routePoints.map((point) => point.y),
      ).toFixed(4);
      visual.dataset.routeMaxY = Math.max(
        ...routePoints.map((point) => point.y),
      ).toFixed(4);
      visual.dataset.terrainSignature = [
        mountainHeight(-3.2, -0.9, terrainTime),
        mountainHeight(0.1, 0.7, terrainTime),
        mountainHeight(2.8, -0.35, terrainTime),
      ]
        .map((value) => value.toFixed(3))
        .join(",");
    };

    const resize = () => {
      const rect = visual.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      if (
        nextWidth === width &&
        nextHeight === height &&
        nextPixelRatio === pixelRatio &&
        particleField
      )
        return;
      const breakpointChanged =
        particleCount(width) !== particleCount(nextWidth);
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextPixelRatio;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      overlayCanvas.width = Math.round(width * pixelRatio);
      overlayCanvas.height = Math.round(height * pixelRatio);
      overlayContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      configureCamera();
      if (!particleField || breakpointChanged) rebuildParticles();
      routeConfig = createRouteConfig(activeCycle, width);
      renderVisual(reduced ? 0 : lastElapsed);
    };

    const requestResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    };

    const tick = (time) => {
      animationFrame = 0;
      if (!visible) return;
      renderVisual(elapsedAt(time));
      animationFrame = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (reduced || animationFrame || !visible) return;
      animationFrame = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(requestResize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting;
        if (nextVisible === visible) return;
        visible = nextVisible;
        visual.dataset.renderState = visible ? "active" : "paused";
        if (visible) {
          if (pausedAt) {
            pausedDuration += performance.now() - pausedAt;
            pausedAt = 0;
          }
          if (reduced) renderVisual(0);
          else startAnimation();
        } else {
          pausedAt = performance.now();
          if (animationFrame) cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { rootMargin: "80px" },
    );

    visual.dataset.renderState = "active";
    visual.dataset.motionMode = reduced ? "reduced" : "full";
    visual.dataset.loopDuration = String(MOTION_LOOP_MS);
    visual.dataset.terrainMode = "dynamic-3d-heightfield";
    visual.dataset.destination = "fixed";
    visual.dataset.destinationWorld = [
      FIXED_DESTINATION.x,
      FIXED_DESTINATION.y,
      FIXED_DESTINATION.z,
    ].join(",");
    resize();
    resizeObserver.observe(visual);
    visibilityObserver.observe(visual);
    if (!reduced) startAnimation();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (particleField) particleField.geometry.dispose();
      mountain.surfaceGeometry.dispose();
      mountain.contourGeometry.dispose();
      mountain.crossGeometry.dispose();
      surfaceMaterial.dispose();
      contourMaterial.dispose();
      crossMaterial.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={visualRef} className="signal-canvas" aria-hidden="true">
      <canvas ref={webglRef} className="signal-webgl" />
      <canvas ref={overlayRef} className="signal-overlay" />
    </div>
  );
}
