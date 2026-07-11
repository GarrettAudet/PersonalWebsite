import React from "react";
import { render, screen } from "@testing-library/react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import AchievementsTimeline from "./AchievementsTimeline";

test("positions an arbitrary number of milestones from data", () => {
  const items = Array.from({ length: 6 }, (_, index) => ({
    year: String(2020 + index),
    label: "Milestone " + (index + 1),
    note: "Description " + (index + 1),
    icon: faStar,
    current: index === 5,
  }));

  const { container } = render(
    <AchievementsTimeline items={items} visible />,
  );

  const milestones = screen.getAllByRole("listitem");
  const positions = milestones.map((item) => item.style.left);

  expect(milestones).toHaveLength(6);
  expect(new Set(positions).size).toBe(6);
  expect(container.firstChild).toHaveStyle("--milestone-count: 6");
  expect(container.firstChild).toHaveStyle("--milestone-width: 14%");
  expect(milestones[5]).toHaveClass("current");
});