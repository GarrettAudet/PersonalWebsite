const EVENT_NAME_PATTERN = /^portfolio_[a-z0-9_]{1,30}$/;
const MAX_STRING_LENGTH = 100;

function cleanValue(value) {
  if (typeof value === "string") {
    return value.replace(/\s+/g, " ").trim().slice(0, MAX_STRING_LENGTH);
  }
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value;
  return undefined;
}

export function safeAnalyticsDestination(href) {
  if (!href || typeof window === "undefined") return "";
  if (href.startsWith("#")) return href.slice(0, MAX_STRING_LENGTH);

  try {
    const url = new URL(href, window.location.origin);
    if (url.protocol === "mailto:") return "email";
    if (url.protocol === "tel:") return "phone";

    const path = url.pathname === "/" ? "" : url.pathname;
    const destination =
      url.origin === window.location.origin
        ? path + url.hash
        : url.hostname + path;
    return destination.slice(0, MAX_STRING_LENGTH);
  } catch {
    return "";
  }
}

export function trackPortfolioEvent(eventName, parameters = {}) {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !EVENT_NAME_PATTERN.test(eventName)
  ) {
    return false;
  }

  const cleanedParameters = Object.fromEntries(
    Object.entries(parameters)
      .map(([key, value]) => [key, cleanValue(value)])
      .filter(([, value]) => value !== undefined && value !== ""),
  );

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    page_path: window.location.pathname || "/",
    page_title: document.title,
    ...cleanedParameters,
  });
  return true;
}

export function trackWebVital(metric) {
  if (!metric || typeof metric.name !== "string") return false;

  const value =
    metric.name === "CLS"
      ? Math.round(metric.value * 1000) / 1000
      : Math.round(metric.value);

  return trackPortfolioEvent("portfolio_web_vital", {
    metric_name: metric.name,
    metric_value: value,
    metric_rating: metric.rating,
  });
}
