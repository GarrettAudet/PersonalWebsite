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
