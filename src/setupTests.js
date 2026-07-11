import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  }),
});

class ResizeObserverMock {
  constructor(callback) { this.callback = callback; }
  observe() { this.callback([]); }
  disconnect() {}
}

class IntersectionObserverMock {
  constructor(callback) { this.callback = callback; }
  observe(target) { this.callback([{ isIntersecting: true, target }]); }
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;
global.IntersectionObserver = IntersectionObserverMock;

const gradient = { addColorStop() {} };
const canvasContext = {
  arc() {},
  beginPath() {},
  clearRect() {},
  createRadialGradient() { return gradient; },
  fill() {},
  fillRect() {},
  lineTo() {},
  moveTo() {},
  setTransform() {},
  stroke() {},
};

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => canvasContext,
});

Object.defineProperty(HTMLElement.prototype, "scrollTo", {
  value() {},
});
jest.mock("d3-geo", () => {
  const projection = (coordinates) => coordinates;
  projection.fitExtent = () => projection;

  return {
    geoGraticule10: () => ({}),
    geoNaturalEarth1: () => projection,
    geoPath: () => () => "",
  };
});

jest.mock("topojson-client", () => ({
  feature: () => ({ features: [] }),
}));
