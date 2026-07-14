import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("renders the approved webpage-final portfolio journey", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /garrett audet/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/strategy & full-stack analytics/i),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /connect with me/i })).toHaveAttribute("href", "#contact");
  expect(document.querySelector(".signal-tagline")).not.toBeInTheDocument();
  expect(document.querySelector(".footer-network")).toBeInTheDocument();
  expect(document.querySelector(".header-snippet-exclusion")).toHaveAttribute("data-nosnippet");
  expect(screen.getByLabelText("Awards and distinctions").querySelectorAll("li")).toHaveLength(6);
  expect(screen.getByRole("button", { name: /next projects/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /curiosities and current focus/i })).toBeInTheDocument();
});

test("transforms the header brand between the domain and name", () => {
  jest.useFakeTimers();
  render(<App />);
  const brand = screen.getByRole("link", { name: /garrett audet home/i });

  fireEvent.pointerEnter(brand);
  act(() => jest.advanceTimersByTime(180));
  expect(brand).not.toHaveTextContent("garrettaudet.com");

  act(() => jest.advanceTimersByTime(1500));
  expect(brand).toHaveTextContent("garrett audet");

  fireEvent.pointerLeave(brand);
  fireEvent.pointerEnter(brand);
  act(() => jest.advanceTimersByTime(1800));
  expect(brand).toHaveTextContent("garrettaudet.com");

  jest.clearAllTimers();
  jest.useRealTimers();
});


test("publishes structured analytics events for meaningful interactions", () => {
  window.dataLayer = [];
  render(<App />);

  expect(window.dataLayer).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        event: "portfolio_page_view",
        page_type: "profile",
      }),
      expect.objectContaining({
        event: "portfolio_section_view",
        section_id: "top",
      }),
    ]),
  );

  fireEvent.click(screen.getByRole("link", { name: /explore my work/i }));

  expect(window.dataLayer).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        event: "portfolio_cta_click",
        event_label: "explore my work",
        event_location: "hero",
        link_destination: "#projects",
      }),
    ]),
  );
});
