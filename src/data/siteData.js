import {
  faBrain,
  faBullseye,
  faCubes,
  faEnvelope,
  faGlobe,
  faGraduationCap,
  faLandmark,
  faLayerGroup,
  faMedal,
  faRocket,
  faTableTennisPaddleBall,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export const navigation = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export const impactLayers = ["Institutions", "Data", "Models", "Systems", "Impact"];

export const operatingFlow = [
  { title: "Understand", detail: "Frame the real problem", icon: faGlobe },
  { title: "Build", detail: "Design data, models, and systems", icon: faCubes },
  { title: "Interpret", detail: "Separate signal from noise", icon: faWaveSquare },
  { title: "Decide & Scale", detail: "Turn insight into action", icon: faBullseye },
];

export const experiences = [
  {
    id: "queens",
    code: "QU",
    title: "Queen's University — Commerce & Computer Science",
    description:
      "Completed dual degrees in commerce and computer science, developing an interdisciplinary foundation across strategy, analytics, and software.",
    range: "2016 - 2021",
    location: "Kingston, Ontario",
    coordinates: [-76.4951, 44.2312]
  },

  {
    id: "army",
    code: "CAF",
    title: "Canadian Armed Forces — Intelligence Operator",
    description:
      "Produced intelligence assessments and operational insights to support decision-making in high-stakes military environments.",
    range: "2017 - 2019",
    location: "Various Locations, Canada",
    coordinates: [-75.6972, 45.4215]
  },

  {
    id: "wtoYouth",
    code: "WTO",
    title: "World Trade Organization — Canadian Youth Delegate",
    description:
      "Represented Canadian youth at the WTO Public Forum, contributing research on global trade challenges and presenting how blockchain could help combat illegal fishing in Southeast Asia.",
    range: "2020",
    location: "Geneva, Switzerland",
    coordinates: [6.1432, 46.2044]
  },

  {
    id: "cansbridge",
    code: "CB",
    title: "Cansbridge Fellowship — Fellow",
    description:
      "Joined a fellowship recognizing emerging Canadian leaders with the ambition and potential to build careers and ventures with global impact.",
    range: "2020 - 2021",
    location: "Canada & Asia",
    coordinates: [-123.1207, 49.2827]
  },

  {
    id: "atta",
    code: "AT",
    title: "ATTA — Software Design Lead",
    description:
      "Led software design for a mechatronics-based product that visualized the effects of air pollution on the human lungs.",
    range: "2020 - 2021",
    location: "Vancouver, British Columbia",
    coordinates: [-123.1207, 49.2827]
  },

  {
    id: "accenture",
    code: "AC",
    title: "Accenture — Strategy & Consulting Senior Analyst",
    description:
      "Delivered strategy, analytics, and digital transformation initiatives across financial services, government, and workforce development.",
    range: "2021 - 2023",
    location: "Ottawa, Ontario",
    coordinates: [-75.6972, 45.4215]
  },

  {
    id: "neo",
    code: "NE",
    title: "Neo Financial — Senior Associate, Growth Strategy & Analytics",
    description:
      "Led growth strategy and analytics across a multimillion-dollar acquisition portfolio, improving customer volume while reducing acquisition costs.",
    range: "2025 - 2026",
    location: "Calgary, Alberta",
    coordinates: [-114.0719, 51.0447]
  },

  {
    id: "schwarzman",
    code: "TS",
    title: "Tsinghua University — Schwarzman Scholar",
    description:
      "Awarded a fully funded Schwarzman Scholarship to pursue a Master's in Global Affairs at Tsinghua University and join a global cohort of emerging leaders studying China, leadership, and international affairs.",
    range: "2026 - 2027",
    location: "Beijing, China",
    coordinates: [116.3269, 40.0032],
    current: true
  }
];

export const awards = [
  { label: "Former Military Intelligence", icon: faMedal },
  { label: "First-Generation Student", icon: faGraduationCap },
  { label: "Schwarzman Scholar", icon: faLayerGroup },
  { label: "Published Machine Learning Researcher", icon: faBrain },
  { label: "WTO Representative", icon: faGlobe },
  { label: "Cansbridge Scholar", icon: faGraduationCap },
];

export const projects = [
  {
    title: "Blackboard Search",
    description: "Search and answer questions across indexed Blackboard courses, files, and sources.",
    tags: ["Chrome", "JavaScript", "RAG"],
    href: "https://chromewebstore.google.com/detail/blackboard-search-extensi/dkliepmojejfldpdmbkhbkfjlhllcapf",
    poster: "/images/projects/blackboard-search-extension-poster.png",
    animation: "/images/projects/blackboard-search-extension.gif"
  },
  {
    title: "Reddit Stock Prediction",
    description: "A trust-filtered Reddit signal and sliding-window model for stock-price prediction.",
    tags: ["NLP", "Time Series", "Python"],
    href: "https://ieeexplore.ieee.org/document/9671412",
    poster: "/images/projects/reddit-stock-trust-filter-poster.png",
    animation: "/images/projects/reddit-stock-trust-filter.gif"
  },
  {
    title: "TraceRail",
    description: "Modular deployment rails for composing, launching, and tracing AI agent swarms.",
    tags: ["AI Agents", "Swarm", "Deployment"],
    href: "https://github.com/GarrettAudet/TraceRail",
    poster: "/images/projects/tracerail-rail-visualization-poster.png",
    animation: "/images/projects/tracerail-rail-visualization.gif"
  },
  {
    title: "Opportunity Radar",
    description: "Searches, normalizes, and catalogs high-fit global opportunities.",
    tags: ["Search", "Automation", "Data"],
    href: "https://github.com/GarrettAudet/schwarzman-opportunity-radar",
    poster: "/images/projects/schwarzman-opportunity-radar-poster.png",
    animation: "/images/projects/schwarzman-opportunity-radar.gif"
  },
  {
    title: "LegacyMarText",
    description: "An SMS-first marketplace that turns text messages into internet listings.",
    tags: ["SMS", "Marketplace", "Web"],
    href: "https://github.com/GarrettAudet/LegacyMarText",
    poster: "/images/projects/legacymartext-sms-marketplace-poster.png",
    animation: "/images/projects/legacymartext-sms-marketplace.gif"
  },
]

export const curiosities = [
  {
    title: "History",
    detail: "Fascinated by Rome, medieval and Renaissance Europe, Three Kingdoms China, and the Ottoman and Timurid worlds.",
    icon: faLandmark,
  },
  {
    title: "Squash",
    detail: "Staying active and playing squash with friends, with more enthusiasm than finesse.",
    icon: faTableTennisPaddleBall,
  },
  {
    title: "Entrepreneurship",
    detail: "Constantly testing ideas, building side projects, and turning ambitious goals into practical experiments.",
    icon: faRocket,
  },
];

export const socialLinks = [
  { label: "Email", display: "garrett.audet@gmail.com", href: "mailto:garrett.audet@gmail.com", icon: faEnvelope },
  { label: "LinkedIn", display: "linkedin.com/in/garrettaudet", href: "https://www.linkedin.com/in/garrettaudet/", icon: faLinkedinIn },
  { label: "GitHub", display: "github.com/GarrettAudet", href: "https://github.com/GarrettAudet", icon: faGithub },
];
