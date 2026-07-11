import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the approved Option 4 portfolio journey", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /garrett audet/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/strategy & full-stack analytics/i),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /let's connect/i })).toHaveAttribute("href", "#contact");
  expect(document.querySelector(".signal-tagline")).toHaveTextContent(/Turning signals\s*into strategy\./);
  expect(screen.getByLabelText("Awards and distinctions").querySelectorAll("li")).toHaveLength(6);
  expect(screen.getByRole("button", { name: /next projects/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /curiosities and current focus/i })).toBeInTheDocument();
});
