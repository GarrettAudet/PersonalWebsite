import {
  safeAnalyticsDestination,
  trackPortfolioEvent,
  trackWebVital,
} from "./analytics";

beforeEach(() => {
  window.dataLayer = [];
  window.history.replaceState({}, "", "/");
  document.title = "Garrett Audet";
});

test("pushes sanitized portfolio events to the shared data layer", () => {
  expect(
    trackPortfolioEvent("portfolio_cta_click", {
      event_label: "  Explore   My Work  ",
      ignored: null,
    }),
  ).toBe(true);

  expect(window.dataLayer).toEqual([
    {
      event: "portfolio_cta_click",
      page_path: "/",
      page_title: "Garrett Audet",
      event_label: "Explore My Work",
    },
  ]);
});

test("rejects invalid event names", () => {
  expect(trackPortfolioEvent("click", {})).toBe(false);
  expect(window.dataLayer).toHaveLength(0);
});

test("removes query strings and personal addresses from destinations", () => {
  expect(safeAnalyticsDestination("#projects")).toBe("#projects");
  expect(safeAnalyticsDestination("mailto:garrett.audet@gmail.com")).toBe(
    "email",
  );
  expect(
    safeAnalyticsDestination(
      "https://github.com/GarrettAudet?tab=repositories",
    ),
  ).toBe("github.com/GarrettAudet");
});

test("normalizes web-vital values", () => {
  expect(trackWebVital({ name: "CLS", value: 0.12345, rating: "good" })).toBe(
    true,
  );
  expect(window.dataLayer[0]).toEqual(
    expect.objectContaining({
      event: "portfolio_web_vital",
      metric_name: "CLS",
      metric_value: 0.123,
      metric_rating: "good",
    }),
  );
});
