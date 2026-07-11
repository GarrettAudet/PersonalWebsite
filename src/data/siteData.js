import {
  faBrain,
  faBullseye,
  faCubes,
  faEnvelope,
  faGlobe,
  faGraduationCap,
  faLayerGroup,
  faMedal,
  faShieldHalved,
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
  { id: "army", code: "DS", title: "Sr. Data Scientist - U.S. Army", description: "Delivered data-driven analytics and operational insight to high-stakes decision makers.", range: "2018 - 2021", location: "North America", coordinates: [-110.3486, 31.5552] },
  { id: "wto", code: "WT", title: "WTO Secretariat - Trade & Agriculture", description: "Built analytical tools and policy research that informed international decisions.", range: "2021 - 2023", location: "Geneva, Switzerland", coordinates: [6.1432, 46.2044] },
  { id: "oxford", code: "OX", title: "Oxford University - Research Fellow", description: "Researched global governance, institutions, and political economy.", range: "2020 - 2023", location: "Oxford, United Kingdom", coordinates: [-1.2577, 51.752] },
  { id: "carnegie", code: "CE", title: "Carnegie Endowment - Global Governance", description: "Advised on global risk and institutional strategy.", range: "2023 - Present", location: "Washington, D.C.", coordinates: [-77.0369, 38.9072], current: true },
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
  { title: "NLP Research Platform", description: "Text analysis, clustering, and topic discovery.", tags: ["Python", "spaCy", "BERT"], visual: "nodes" },
  { title: "Decision Analytics Dashboard", description: "Interactive dashboards for decision intelligence and forecasting.", tags: ["Streamlit", "Plotly", "PostgreSQL"], visual: "chart" },
  { title: "Backtested Search Strategies", description: "Time-series search across internal data systems.", tags: ["Search", "MLflow", "Vector DB"], visual: "wave" },
  { title: "Graph Governance Visualizer", description: "Network intelligence for governance and policy relationships.", tags: ["D3.js", "Neo4j", "NetworkX"], visual: "graph" },
  { title: "AI Policy Explorer", description: "Linked public data for comparative AI policy analysis.", tags: ["Next.js", "NLP", "Mapbox"], visual: "grid" },
];

export const curiosities = [
  { title: "Applied AI for public good", detail: "Using AI to solve real-world problems at scale.", icon: faBullseye },
  { title: "Resilient systems & decision-quality", detail: "Building systems that withstand uncertainty and improve decisions.", icon: faShieldHalved },
  { title: "History, geopolitics & long-term thinking", detail: "Understanding the forces that shape the future and our choices.", icon: faGlobe },
];

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/GarrettAudet", icon: faGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/garrettaudet/", icon: faLinkedinIn },
  { label: "Email", href: "mailto:garrett.audet@gmail.com", icon: faEnvelope },
];
