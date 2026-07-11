import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ARC_START_X = 70;
const ARC_END_X = 930;
const ARC_EDGE_Y = 70;
const ARC_CONTROL_X = 500;
const ARC_CONTROL_Y = -20;
const VIEWBOX_WIDTH = 1000;

function getArcPoint(index, count) {
  const progress = count <= 1 ? 0.5 : index / (count - 1);
  const inverse = 1 - progress;
  const x =
    inverse * inverse * ARC_START_X +
    2 * inverse * progress * ARC_CONTROL_X +
    progress * progress * ARC_END_X;
  const y =
    inverse * inverse * ARC_EDGE_Y +
    2 * inverse * progress * ARC_CONTROL_Y +
    progress * progress * ARC_EDGE_Y;

  return { x, y };
}

export default function AchievementsTimeline({
  items,
  timelineRef,
  visible,
}) {
  const arcPath =
    "M " +
    ARC_START_X +
    " " +
    ARC_EDGE_Y +
    " Q " +
    ARC_CONTROL_X +
    " " +
    ARC_CONTROL_Y +
    " " +
    ARC_END_X +
    " " +
    ARC_EDGE_Y;

  return (
    <div
      className={"achievement-timeline" + (visible ? " visible" : "")}
      ref={timelineRef}
      style={{
        "--milestone-count": items.length,
        "--milestone-width": Math.min(18, 84 / Math.max(items.length, 1)) + "%",
      }}
    >
      <svg
        className="timeline-arc"
        viewBox="0 0 1000 105"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="timeline-line timeline-line-ghost" d={arcPath} />
        <path className="timeline-line timeline-line-progress" d={arcPath} />
      </svg>

      <ol className="timeline-milestones">
        {items.map((item, index) => {
          const point = getArcPoint(index, items.length);
          const position = (point.x / VIEWBOX_WIDTH) * 100 + "%";

          return (
            <li
              className={
                "timeline-milestone" + (item.current ? " current" : "")
              }
              key={item.year + "-" + item.label}
              style={{
                "--milestone-index": index,
                left: position,
                top: point.y - 22 + "px",
              }}
              tabIndex="0"
              aria-label={item.year + ": " + item.label + ". " + item.note}
            >
              <span className="timeline-marker" aria-hidden="true">
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <div className="timeline-copy">
                <strong>{item.year}</strong>
                <h3>{item.label}</h3>
                <p>{item.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}