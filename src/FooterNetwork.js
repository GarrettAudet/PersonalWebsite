import React from "react";

const leftPaths = [
  "M8 40 C92 40 124 78 224 112",
  "M8 66 C94 66 142 92 224 112",
  "M8 92 C92 92 154 102 224 112",
  "M8 118 C96 118 154 114 224 112",
  "M8 144 C96 144 144 128 224 112",
  "M8 170 C92 170 128 144 224 112",
];

const rightPaths = [
  "M224 112 C308 74 356 38 452 28",
  "M224 112 C316 86 370 68 452 66",
  "M224 112 C324 104 382 100 452 102",
  "M224 112 C324 122 382 136 452 142",
  "M224 112 C308 146 364 174 452 184",
];

const particles = [
  [26, 58], [52, 132], [76, 82], [102, 154], [126, 98], [150, 126], [176, 86], [198, 116],
  [252, 94], [276, 122], [302, 72], [326, 146], [350, 58], [378, 116], [404, 82], [430, 158],
];

export default function FooterNetwork() {
  return (
    <svg className="footer-network" viewBox="0 0 460 212" focusable="false">
      <defs>
        <filter id="footer-node-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className="footer-network-lines cyan-lines">
        {leftPaths.map((path, index) => <path d={path} key={path} style={{ "--network-index": index }} />)}
      </g>
      <g className="footer-network-lines amber-lines">
        {rightPaths.map((path, index) => <path d={path} key={path} style={{ "--network-index": index }} />)}
      </g>
      <g className="footer-network-particles">
        {particles.map(([cx, cy], index) => <circle cx={cx} cy={cy} key={cx + "-" + cy} r={index % 4 === 0 ? 2.2 : 1.35} style={{ "--particle-index": index }} />)}
      </g>
      <circle className="footer-network-halo" cx="224" cy="112" r="18" />
      <circle className="footer-network-node" cx="224" cy="112" r="4.5" filter="url(#footer-node-glow)" />
    </svg>
  );
}