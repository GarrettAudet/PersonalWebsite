import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faLandmark,
  faLayerGroup,
  faMedal,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedinIn, faMedium } from "@fortawesome/free-brands-svg-icons";
import SignalCanvas, { AnimatedMetric } from "./SignalCanvas";
import ExperienceMap from "./ExperienceMap";
import ImpactStack from "./ImpactStack";
import AchievementsTimeline from "./AchievementsTimeline";
import "./App.css";

const metrics = [
  { value: "82.4k", label: "signals analyzed", position: "metric-a" },
  { value: "6.7m", label: "data points", position: "metric-b" },
  { value: "17.8k", label: "decisions augmented", position: "metric-c" },
  { value: "92.4%", label: "model accuracy", position: "metric-d" },
];

const focusAreas = ["strategy", "analytics", "machine learning"];
const capabilities = ["Strategy meets execution.", "Data-driven decision architect.", "Systems thinker. Builder.", "Always learning, always shipping."];
const stackItems = ["Institutions", "Data", "Models", "Systems", "Impact"];

const experiences = [
  { id: "military", code: "MI", title: "Military Intelligence - U.S. Army", description: "Delivered intelligence analysis and operational support in high-stakes environments.", range: "2019 - 2021", coordinates: [-110.3486, 31.5552] },
  { id: "wto", code: "WT", title: "WTO Secretariat - Trade & Agriculture", description: "AI/ML-driven data and policy research across member states.", range: "2021 - 2023", coordinates: [6.1432, 46.2044] },
  { id: "oxford", code: "OX", title: "Oxford University - Research Fellow", description: "Researched global governance, institutions, and political economy.", range: "2020 - 2023", coordinates: [-1.2577, 51.752] },
  { id: "carnegie", code: "CG", title: "Carnegie Endowment - Global Governance", description: "Advised on global risk and sustainable strategy.", range: "2023 - Present", coordinates: [-77.0369, 38.9072], current: true },
];

const projects = [
  { title: "NLP Research Platform", description: "Text analysis, clustering, and topic discovery for complex document sets.", tags: ["Python", "spaCy", "BERT"], visual: "nodes" },
  { title: "Decision Analytics Dashboard", description: "Interactive dashboards for scenario intelligence and decision support.", tags: ["Streamlit", "Plotly", "PostgreSQL"], visual: "chart" },
  { title: "Blackboard Search Extension", description: "Intelligent search across institutional learning data systems.", tags: ["Search", "LLMs", "Vector DB"], visual: "wave" },
  { title: "Graph Governance Visualizer", description: "Network graph for governance and policy relationships.", tags: ["D3.js", "Neo4j", "NetworkX"], visual: "graph" },
  { title: "AI Policy Explorer", description: "Explore AI policy landscapes through linked public data.", tags: ["Next.js", "NLP", "Mapbox"], visual: "grid" },
];

const achievements = [
  { year: "2019", label: "Military Intelligence", note: "Operational analysis in high-stakes environments.", icon: faShieldHalved },
  { year: "2021", label: "WTO Representative", note: "AI & agriculture policy research.", icon: faLandmark },
  { year: "2023", label: "Oxford Research Fellowship", note: "Institutions and global political economy.", icon: faMedal },
  { year: "2023", label: "Cansbridge Scholar", note: "Global governance and sustainable strategy.", icon: faLandmark },
  { year: "Present", label: "Data-Driven Impact", note: "Building systems that deliver measurable results.", icon: faLayerGroup, current: true },
];

const writings = [
  { title: "The Data Trap in Strategic Decision-Making", summary: "A systems approach to evidence and policy.", visual: "bars" },
  { title: "Why Systems Thinking Matters More Than Ever", summary: "Connecting models, institutions, and outcomes.", visual: "network" },
  { title: "From Data to Diplomacy", summary: "AI for public good and global cooperation.", visual: "dots" },
];

function SectionLabel({ number, children }) {
  return <p className="section-label"><span>{number}</span>{children}</p>;
}

function useReveal(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin, threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, visible];
}

function useScrollDepth() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      node.style.setProperty("--scroll-depth", "0");
      return undefined;
    }

    let frame;
    const update = () => {
      frame = undefined;
      const rect = node.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      node.style.setProperty("--scroll-depth", progress.toFixed(4));
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return ref;
}

function useMobileViewport() {
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 720px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const update = (event) => setMobile(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return mobile;
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Garrett Audet home"><span>GA</span><b>garrettaudet.com</b></a>
      <nav className="main-nav" aria-label="Primary navigation">
        <a href="#about">About</a><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#writing">Writing</a><a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  const depthRef = useScrollDepth();
  return (
    <section className="hero" id="home" aria-labelledby="hero-title" ref={depthRef}><div className="hero-inner page-grid">
      <div className="hero-copy"><h1 id="hero-title">Garrett<br />Audet</h1><h2>Strategy &amp; Full-Stack Analytics</h2><p>I build analytical systems and machine learning solutions that turn complex signals into confident decisions and measurable impact.</p><div className="hero-actions"><a className="button primary" href="#projects">Explore My Work <FontAwesomeIcon icon={faArrowRight} /></a><a className="button secondary" href="#about">Learn More <FontAwesomeIcon icon={faArrowRight} /></a></div></div>
      <div className="hero-system" aria-label="Analytics signal system"><SignalCanvas />{metrics.map((metric, index) => <AnimatedMetric value={metric.value} label={metric.label} className={metric.position} delay={200 + index * 160} key={metric.label} />)}<ol className="focus-list">{focusAreas.map((area, index) => <li key={area}><strong>{String(index + 1).padStart(2, "0")}</strong><span>{area}</span></li>)}</ol></div>
    </div></section>
  );
}

function About() {
  const depthRef = useScrollDepth();
  const [revealRef, visible] = useReveal("0px 0px -10% 0px");
  return <section className="section about" id="about" aria-labelledby="about-title" ref={depthRef}><div ref={revealRef} className={`section-inner about-grid${visible ? " visible" : ""}`}><div className="about-intro"><SectionLabel number="01">About Me</SectionLabel><h2 id="about-title">From public institutions to technical systems, I focus on turning complexity into clarity.</h2><a className="text-link" href="#experience">View Full Bio <FontAwesomeIcon icon={faArrowRight} /></a></div><ul className="capability-list">{capabilities.map((item, index) => <li key={item} style={{ "--item": index }}><span aria-hidden="true">+</span>{item}</li>)}</ul><ImpactStack items={stackItems} /></div></section>;
}

function Experience() {
  const initialIndex = Math.max(
    experiences.findIndex((experience) => experience.current),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [connectorY, setConnectorY] = useState(150);
  const [revealRef, visible] = useReveal();
  const listRef = useRef(null);
  const rowRefs = useRef([]);

  const alignActiveRow = useCallback(() => {
    const list = listRef.current;
    const row = rowRefs.current[activeIndex];
    if (!list || !row) return;

    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const rowTop = rowRect.top - listRect.top + list.scrollTop;
    const rowBottom = rowTop + rowRect.height;
    if (rowTop < list.scrollTop) {
      list.scrollTop = rowTop;
    } else if (rowBottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = rowBottom - list.clientHeight;
    }
  }, [activeIndex]);
  const updateConnector = useCallback(() => {
    const list = listRef.current;
    const row = rowRefs.current[activeIndex];
    const map = list?.closest(".experience-grid")?.querySelector(".map-visual");
    if (!list || !row || !map) return;

    const rowRect = row.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();
    const rowCenter = rowRect.top + rowRect.height / 2;
    if (mapRect.height <= 0) return;
    const normalized = ((rowCenter - mapRect.top) / mapRect.height) * 300;
    if (Number.isFinite(normalized)) {
      setConnectorY(Math.min(Math.max(normalized, 12), 288));
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    alignActiveRow();
    updateConnector();
  }, [alignActiveRow, updateConnector]);

  useEffect(() => {
    const handleLayout = () => {
      alignActiveRow();
      updateConnector();
    };
    window.addEventListener("resize", handleLayout);

    const observer = new ResizeObserver(handleLayout);
    const list = listRef.current;
    const row = rowRefs.current[activeIndex];
    const map = list?.closest(".experience-grid")?.querySelector(".map-visual");
    if (list) observer.observe(list);
    if (row) observer.observe(row);
    if (map) observer.observe(map);

    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) handleLayout();
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleLayout);
      observer.disconnect();
    };
  }, [activeIndex, alignActiveRow, updateConnector]);

  return <section className="section experience" id="experience" aria-labelledby="experience-title"><div className="section-inner"><SectionLabel number="02">Experience</SectionLabel><h2 className="sr-only" id="experience-title">Professional experience</h2><div ref={revealRef} className={"experience-grid reveal-group" + (visible ? " visible" : "")}><ExperienceMap experiences={experiences} activeIndex={activeIndex} connectorY={connectorY} /><div className="experience-list" ref={listRef} onScroll={updateConnector} aria-label="Professional experience timeline">{experiences.map((item, index) => <article className={"experience-row" + (index === activeIndex ? " active" : "") + (item.current ? " current" : "")} style={{ "--experience-index": index }} key={item.id} ref={(node) => { rowRefs.current[index] = node; }} tabIndex="0" onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} aria-label={item.title + ", " + item.range}><span className="hex-icon">{item.code}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><time>{item.range}</time></article>)}</div></div></div></section>;
}

function ProjectVisual({ type }) { return <div className={`project-visual visual-${type}`} aria-hidden="true"><i /><i /><i /><i /><i /></div>; }

function Projects() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [revealRef, visible] = useReveal();
  const viewportRef = useRef(null);
  const pointerStart = useRef(null);
  const mobile = useMobileViewport();
  const maxSlide = mobile ? projects.length - 1 : projects.length - 3;

  const move = (direction) => setActiveSlide((current) => {
    const next = current + direction;
    if (next < 0) return maxSlide;
    if (next > maxSlide) return 0;
    return next;
  });

  useEffect(() => {
    setActiveSlide((current) => Math.min(current, maxSlide));
  }, [maxSlide]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelector(".project-card");
    if (!card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({ left: activeSlide * (card.getBoundingClientRect().width + 18), behavior: reduced ? "auto" : "smooth" });
  }, [activeSlide, mobile]);

  const finishSwipe = (event) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) > 48) move(distance < 0 ? 1 : -1);
  };

  return <section className="section projects" id="projects" aria-labelledby="projects-title"><div className="section-inner"><div className="section-top"><div><SectionLabel number="03">Technical Projects</SectionLabel><h2 className="sr-only" id="projects-title">Technical projects</h2></div><a className="text-link" href="#contact">View all projects <FontAwesomeIcon icon={faArrowRight} /></a></div><div ref={revealRef} className={`carousel-shell reveal-group${visible ? " visible" : ""}`}><button className="carousel-button prev" type="button" aria-label="Previous projects" onClick={() => move(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button><div className="project-viewport" ref={viewportRef} onPointerDown={(event) => { pointerStart.current = event.clientX; }} onPointerUp={finishSwipe} onPointerCancel={() => { pointerStart.current = null; }}><div className="project-track">{projects.map((project, index) => <article className="project-card" style={{ "--project-index": index }} key={project.title}><ProjectVisual type={project.visual} /><h3>{project.title}</h3><p>{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div></div><button className="carousel-button next" type="button" aria-label="Next projects" onClick={() => move(1)}><FontAwesomeIcon icon={faChevronRight} /></button></div><div className="pagination" aria-label="Project pages">{Array.from({ length: maxSlide + 1 }, (_, index) => <button type="button" className={index === activeSlide ? "active" : ""} aria-label={`Show project page ${index + 1}`} aria-current={index === activeSlide ? "true" : undefined} onClick={() => setActiveSlide(index)} key={index} />)}</div></div></section>;
}

function Achievements() {
  const [revealRef, visible] = useReveal("0px 0px -12% 0px");
  return <section className="section achievements" id="achievements" aria-labelledby="achievements-title"><div className="section-inner"><SectionLabel number="04">Achievements</SectionLabel><h2 className="sr-only" id="achievements-title">Achievements timeline</h2><AchievementsTimeline items={achievements} timelineRef={revealRef} visible={visible} /></div></section>;
}

function Writing() {
  const [revealRef, visible] = useReveal();
  return <section className="section writing" id="writing" aria-labelledby="writing-title"><div className="section-inner"><div className="section-top"><div><SectionLabel number="05">Writing &amp; Insights</SectionLabel><h2 className="sr-only" id="writing-title">Writing and insights</h2></div><a className="text-link" href="#contact">View all writing <FontAwesomeIcon icon={faArrowRight} /></a></div><div ref={revealRef} className={`writing-grid${visible ? " visible" : ""}`}>{writings.map((item, index) => <article className="writing-card" style={{ "--writing-index": index }} key={item.title}><div className={`mini-visual ${item.visual}`} aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.summary}</p><a href="#contact">Read <FontAwesomeIcon icon={faArrowRight} /></a></div></article>)}</div></div></section>;
}

function Footer() {
  const [revealRef, visible] = useReveal("0px");
  return <footer className={"site-footer" + (visible ? " visible" : "")} id="contact" ref={revealRef}><div className="section-inner"><h2>Let&apos;s build what&apos;s next.</h2><p>Open to collaboration on data, systems, and products that create impact.</p><a className="button secondary" href="mailto:garrett.audet@gmail.com">Get in Touch <FontAwesomeIcon icon={faArrowRight} /></a><div className="footer-bottom"><nav aria-label="Social links"><a href="https://www.linkedin.com/in/garrettaudet/" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedinIn} /></a><a href="https://github.com/GarrettAudet" aria-label="GitHub"><FontAwesomeIcon icon={faGithub} /></a><a href="https://medium.com/" aria-label="Medium"><FontAwesomeIcon icon={faMedium} /></a><a href="mailto:garrett.audet@gmail.com" aria-label="Email"><FontAwesomeIcon icon={faEnvelope} /></a></nav><p>&copy; 2026 Garrett Audet. All rights reserved.</p></div></div></footer>;
}

export default function App() { return <div className="portfolio-app" id="top"><Header /><main><Hero /><About /><Experience /><Projects /><Achievements /><Writing /></main><Footer /></div>; }
