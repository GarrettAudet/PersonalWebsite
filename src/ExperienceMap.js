import React, { useId } from "react";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

const MAP_WIDTH = 640;
const MAP_HEIGHT = 300;
const MAP_HUB_X = 636;

const activityLights = [
  { coordinates: [-122.42, 37.77], tone: "cyan", delay: -0.4, duration: 3.8 },
  { coordinates: [-74.01, 40.71], tone: "cyan", delay: -1.8, duration: 4.6 },
  { coordinates: [-99.13, 19.43], tone: "amber", delay: -2.4, duration: 5.1 },
  { coordinates: [-46.63, -23.55], tone: "cyan", delay: -0.9, duration: 4.2 },
  { coordinates: [-0.13, 51.51], tone: "cyan", delay: -3.1, duration: 5.4 },
  { coordinates: [6.14, 46.2], tone: "amber", delay: -1.1, duration: 4.7 },
  { coordinates: [13.41, 52.52], tone: "cyan", delay: -2.2, duration: 3.9 },
  { coordinates: [31.24, 30.04], tone: "amber", delay: -3.7, duration: 5.3 },
  { coordinates: [3.38, 6.52], tone: "cyan", delay: -1.5, duration: 4.4 },
  { coordinates: [55.27, 25.2], tone: "amber", delay: -2.9, duration: 5.2 },
  { coordinates: [77.21, 28.61], tone: "cyan", delay: -0.7, duration: 3.7 },
  { coordinates: [103.82, 1.35], tone: "cyan", delay: -2.6, duration: 4.9 },
  { coordinates: [116.41, 39.9], tone: "amber", delay: -1.9, duration: 5.5 },
  { coordinates: [139.69, 35.68], tone: "cyan", delay: -3.4, duration: 4.1 },
  { coordinates: [151.21, -33.87], tone: "cyan", delay: -1.3, duration: 5 },
  { coordinates: [18.42, -33.92], tone: "amber", delay: -2.1, duration: 4.5 },
];

const countries = feature(
  worldAtlas,
  worldAtlas.objects.countries,
).features.filter((country) => String(country.id) !== "010");

const countryCollection = { type: "FeatureCollection", features: countries };

const projection = geoNaturalEarth1().fitExtent(
  [
    [18, 20],
    [594, 276],
  ],
  countryCollection,
);

const drawPath = geoPath(projection);
const graticulePath = drawPath(geoGraticule10());

function projectLocation(coordinates) {
  return projection(coordinates) || [MAP_WIDTH / 2, MAP_HEIGHT / 2];
}

export default function ExperienceMap({
  experiences,
  activeIndex,
  connectorY = MAP_HEIGHT / 2,
}) {
  const activeExperience = experiences[activeIndex];
  const activeIsCurrent = Boolean(activeExperience.current);
  const activePoint = projectLocation(activeExperience.coordinates);
  const activeX = activePoint[0];
  const activeY = activePoint[1];
  const hubY = Math.min(Math.max(connectorY, 12), MAP_HEIGHT - 12);
  const firstControlX = activeX + Math.max(64, (MAP_HUB_X - activeX) * 0.28);
  const secondControlX = MAP_HUB_X - 112;
  const route =
    "M " +
    activeX +
    " " +
    activeY +
    " C " +
    firstControlX +
    " " +
    (activeY - 26) +
    ", " +
    secondControlX +
    " " +
    hubY +
    ", " +
    MAP_HUB_X +
    " " +
    hubY;
  const idPrefix = useId().replace(/:/g, "");
  const dotPatternId = idPrefix + "-map-dots";
  const glowFilterId = idPrefix + "-map-glow";
  const routeGlowId = idPrefix + "-route-glow";

  return (
    <div className="map-visual">
      <svg
        className="world-map"
        viewBox={"0 0 " + MAP_WIDTH + " " + MAP_HEIGHT}
        role="img"
        aria-label={"World map highlighting " + activeExperience.title}
      >
        <defs>
          <pattern
            id={dotPatternId}
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <circle className="map-pattern-dot" cx="1.5" cy="1.5" r="1" />
          </pattern>
          <filter id={glowFilterId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={routeGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="map-graticule" d={graticulePath} />

        <g className="map-countries">
          {countries.map((country) => (
            <path
              className="map-country"
              d={drawPath(country)}
              key={country.id}
              style={{ fill: "url(#" + dotPatternId + ")" }}
            />
          ))}
        </g>

        <g className="map-activity" aria-hidden="true">
          {activityLights.map((light, index) => {
            const point = projectLocation(light.coordinates);
            return (
              <g
                className={"map-activity-light " + light.tone}
                key={index}
                transform={"translate(" + point[0] + " " + point[1] + ")"}
                style={{
                  "--light-delay": light.delay + "s",
                  "--light-duration": light.duration + "s",
                }}
              >
                <circle className="map-light-halo" r="7" />
                <circle className="map-light-core" r="1.55" />
              </g>
            );
          })}
        </g>

        <g
          className={
            "map-route-group " + (activeIsCurrent ? "current-route" : "prior-route")
          }
          key={activeExperience.id}
        >
          <path className="map-route map-route-trace" d={route} />
          <path
            className="map-route map-route-flow"
            d={route}
            filter={"url(#" + routeGlowId + ")"}
          />
        </g>

        <g className="map-nodes">
          {experiences.map((experience, index) => {
            const point = projectLocation(experience.coordinates);
            const active = index === activeIndex;
            const classes = [
              "map-node",
              active ? "active" : "",
              experience.current ? "current" : "prior",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <g
                className={classes}
                key={experience.id}
                transform={"translate(" + point[0] + " " + point[1] + ")"}
              >
                {active && <circle className="map-node-pulse" r="15" />}
                <circle className="map-node-ring" r={active ? 9 : 6} />
                <circle
                  className="map-node-core"
                  filter={active ? "url(#" + glowFilterId + ")" : undefined}
                  r={active ? 4.5 : 3}
                />
              </g>
            );
          })}

          <g
            className={
              "map-route-hub " + (activeIsCurrent ? "current-route" : "prior-route")
            }
          >
            <circle className="map-hub-ring" cx={MAP_HUB_X} cy={hubY} r="7" />
            <circle className="map-hub" cx={MAP_HUB_X} cy={hubY} r="3.25" />
          </g>
        </g>

        <g className="map-key" transform="translate(20 286)">
          <circle className="map-key-active" cx="0" cy="0" r="3" />
          <text x="9" y="3">Current / active</text>
          <circle className="map-key-prior" cx="88" cy="0" r="3" />
          <text x="97" y="3">Prior</text>
          <line className="map-key-line" x1="142" x2="158" y1="0" y2="0" />
          <text x="166" y="3">Selected route</text>
        </g>
      </svg>
    </div>
  );
}