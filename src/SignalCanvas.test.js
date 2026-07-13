import {
  buildNavigationRoute,
  FIXED_DESTINATION,
  getMotionState,
  MOTION_LOOP_MS,
  MOTION_PHASES,
} from "./SignalCanvas";

test("uses the six specified motion phases and exact loop duration", () => {
  expect(MOTION_PHASES.map(({ name, duration }) => [name, duration])).toEqual([
    ["terrain-idle", 4000],
    ["path-emergence", 1200],
    ["path-extension", 3000],
    ["arrival", 600],
    ["impact-pulse", 1600],
    ["fade-reset", 2600],
  ]);
  expect(MOTION_LOOP_MS).toBe(13000);
});

test("advances through every phase at the specified boundaries", () => {
  expect(getMotionState(0).phase).toBe("terrain-idle");
  expect(getMotionState(3999).phase).toBe("terrain-idle");
  expect(getMotionState(4000).phase).toBe("path-emergence");
  expect(getMotionState(5200).phase).toBe("path-extension");
  expect(getMotionState(8200).phase).toBe("arrival");
  expect(getMotionState(8800).phase).toBe("impact-pulse");
  expect(getMotionState(10400).phase).toBe("fade-reset");
  expect(getMotionState(13000)).toMatchObject({
    phase: "terrain-idle",
    cycleIndex: 1,
  });
});

test("draws forward, arrives fully, pulses, then dissolves", () => {
  const emerging = getMotionState(4600);
  const extending = getMotionState(6700);
  const arrived = getMotionState(8500);
  const impact = getMotionState(9600);
  const fading = getMotionState(11700);

  expect(emerging.routeProgress).toBeGreaterThan(0);
  expect(emerging.routeProgress).toBeLessThan(0.14);
  expect(extending.routeProgress).toBeGreaterThan(0.14);
  expect(extending.routeProgress).toBeLessThan(1);
  expect(arrived).toMatchObject({ routeProgress: 1, routeOpacity: 1 });
  expect(arrived.arrivalProgress).toBeGreaterThan(0);
  expect(impact.impactProgress).toBeGreaterThan(0);
  expect(fading.fadeProgress).toBeGreaterThan(0);
  expect(fading.routeOpacity).toBeLessThan(1);
});

test("plans changing routes to one fixed destination", () => {
  const firstRoute = buildNavigationRoute(0);
  const nextRoute = buildNavigationRoute(1);
  const fixedEndpoint = { x: FIXED_DESTINATION.x, z: FIXED_DESTINATION.z };

  expect(firstRoute[firstRoute.length - 1]).toEqual(fixedEndpoint);
  expect(nextRoute[nextRoute.length - 1]).toEqual(fixedEndpoint);
  expect(firstRoute[0]).not.toEqual(nextRoute[0]);
  expect(firstRoute.map(({ z }) => z)).not.toEqual(nextRoute.map(({ z }) => z));
});
