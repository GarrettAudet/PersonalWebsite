import React, { useState } from "react";

function layerPoints(index) {
  const centerX = 112;
  const topY = 9 + index * 20;
  const halfWidth = 88;
  const depth = 50;

  return [
    `${centerX},${topY}`,
    `${centerX + halfWidth},${topY + depth}`,
    `${centerX},${topY + depth * 2}`,
    `${centerX - halfWidth},${topY + depth}`,
  ].join(" ");
}

export default function ImpactStack({ items }) {
  const [activeLayer, setActiveLayer] = useState(null);

  return (
    <div
      className="stack-diagram"
      aria-label="Impact stack"
      data-active-layer={activeLayer === null ? undefined : activeLayer}
      onMouseLeave={() => setActiveLayer(null)}
    >
      <div className="stack-visual" aria-hidden="true">
        <span className="stack-aura" />
        <svg viewBox="0 0 224 190" focusable="false">
          <path className="stack-axis" d="M112 12 L112 174" />
          {items.map((item, index) => (
            <g
              className={index === items.length - 1 ? "stack-layer impact" : "stack-layer"}
              data-layer={index}
              key={item}
              style={{ "--layer": index }}
            >
              <polygon points={layerPoints(index)} />
              <circle cx="112" cy={59 + index * 20} r="2.4" />
            </g>
          ))}
        </svg>
      </div>
      <ol className="stack-labels">
        {items.map((item, index) => (
          <li
            key={item}
            data-layer={index}
            style={{ "--layer": index }}
            tabIndex="0"
            onMouseEnter={() => setActiveLayer(index)}
            onFocus={() => setActiveLayer(index)}
            onBlur={() => setActiveLayer(null)}
          >
            <span aria-hidden="true" />
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}
