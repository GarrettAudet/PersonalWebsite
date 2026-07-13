import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faBars,
  faChevronLeft,
  faChevronRight,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import SignalCanvas from "./SignalCanvas";
import { prefersReducedMotion } from "./motionPreferences";
import ExperienceMap from "./ExperienceMap";
import FooterNetwork from "./FooterNetwork";
import ImpactStack from "./ImpactStack";
import {
  awards,
  curiosities,
  experiences,
  impactLayers,
  navigation,
  operatingFlow,
  projects,
  socialLinks,
} from "./data/siteData";
import "./App.css";
import "./webpage-final.css";

const BRAND_DOMAIN = "garrettaudet.com";
const BRAND_NAME = "garrett audet";
const SCRAMBLE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function useReveal(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduced = prefersReducedMotion();
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

function useHeroScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduced = prefersReducedMotion();
    if (reduced) return undefined;

    let frame;
    const update = () => {
      frame = undefined;
      const rect = node.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.55, 1)));
      node.style.setProperty("--hero-progress", progress.toFixed(4));
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

function SectionLabel({ number, children }) {
  return (
    <p className="section-label">
      {number && <span>{number}</span>}
      {children}
    </p>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [brandText, setBrandText] = useState(BRAND_DOMAIN);
  const brandShowsDomain = useRef(true);
  const brandInterval = useRef(null);

  const transformBrand = useCallback(() => {
    const target = brandShowsDomain.current ? BRAND_NAME : BRAND_DOMAIN;
    window.clearInterval(brandInterval.current);

    if (prefersReducedMotion()) {
      setBrandText(target);
      brandShowsDomain.current = !brandShowsDomain.current;
      return;
    }

    let iteration = 0;
    brandInterval.current = window.setInterval(() => {
      setBrandText(
        target
          .split("")
          .map((character, index) => {
            if (index < iteration || character === " " || character === ".") {
              return character;
            }
            return SCRAMBLE_LETTERS[Math.floor(Math.random() * SCRAMBLE_LETTERS.length)];
          })
          .join("")
      );

      if (iteration >= target.length) {
        window.clearInterval(brandInterval.current);
        brandInterval.current = null;
        setBrandText(target);
        brandShowsDomain.current = !brandShowsDomain.current;
      }
      iteration += 1 / 3;
    }, 30);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    const sections = navigation
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0.01, 0.2, 0.5] });

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => () => window.clearInterval(brandInterval.current), []);

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <a
        className="brand"
        href="#top"
        aria-label="Garrett Audet home"
        onClick={() => setMenuOpen(false)}
        onFocus={transformBrand}
        onPointerEnter={transformBrand}
      >
        <span aria-hidden="true">{brandText}</span>
      </a>
      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
      </button>
      <nav className={"main-nav" + (menuOpen ? " open" : "")} aria-label="Primary navigation">
        {navigation.map((item) => (
          <a
            className={active === item.href.slice(1) ? "active" : ""}
            href={item.href}
            key={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#contact">Connect with Me</a>
    </header>
  );
}

function Hero() {
  const heroRef = useHeroScroll();
  const copyRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const copy = copyRef.current;
    if (!hero || !copy) return undefined;

    let frame = 0;
    let lastBottom = -1;

    const measureCopyHeight = () => {
      frame = 0;
      const heroRect = hero.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const nextBottom = Math.ceil(copyRect.bottom - heroRect.top);
      if (nextBottom === lastBottom) return;
      lastBottom = nextBottom;
      hero.style.setProperty("--hero-copy-bottom", nextBottom + "px");
    };

    const requestCopyHeightUpdate = () => {
      if (!frame) frame = requestAnimationFrame(measureCopyHeight);
    };

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(requestCopyHeightUpdate);
    measureCopyHeight();
    if (resizeObserver) resizeObserver.observe(copy);
    window.addEventListener("resize", requestCopyHeightUpdate);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", requestCopyHeightUpdate);
    };
  }, [heroRef]);

  return (
    <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
      <SignalCanvas />
      <div className="hero-inner">
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-eyebrow">Hello, I&apos;m</p>
          <h1 id="hero-title">Garrett<br />Audet</h1>
          <h2>Strategy &amp; Full-Stack Analytics</h2>
          <p className="hero-summary">
            I build analytical systems and machine learning solutions that turn complex signals into confident decisions&mdash;and measurable impact.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">Explore My Work <FontAwesomeIcon icon={faArrowRight} /></a>
            <a className="button secondary" href="#about">Learn More <FontAwesomeIcon icon={faArrowDown} /></a>
          </div>
        </div>

      </div>
    </section>
  );
}

function OperatingFlow({ visible }) {
  return (
    <ol className={"operating-flow" + (visible ? " visible" : "")}>
      {operatingFlow.map((item, index) => (
        <li key={item.title} style={{ "--flow-index": index }}>
          <span className="flow-icon"><FontAwesomeIcon icon={item.icon} /></span>
          <span><strong>{item.title}</strong><small>{item.detail}</small></span>
          {index < operatingFlow.length - 1 && <FontAwesomeIcon className="flow-arrow" icon={faArrowRight} />}
        </li>
      ))}
    </ol>
  );
}

function About() {
  const [revealRef, visible] = useReveal();
  return (
    <section className="about section-shell" id="about" aria-labelledby="about-title">
      <div ref={revealRef} className={"panel about-panel reveal-section" + (visible ? " visible" : "")}>
        <SectionLabel>About</SectionLabel>
        <div className="about-grid">
          <figure className="portrait-frame">
            <img src="/images/portrait-design.png" alt="Garrett Audet" />
          </figure>
          <div className="about-copy">
            <h2 id="about-title">I build systems and use data to make better strategic decisions.</h2>
            <span className="short-rule" aria-hidden="true" />
            <p>My background across computer science, business, and global affairs helps me connect technical depth, commercial judgment, and real-world context.</p>
          </div>
          <ImpactStack items={impactLayers} />
        </div>
        <OperatingFlow visible={visible} />
      </div>
    </section>
  );
}

function AwardsStrip({ visible }) {
  return (
    <ul className={"awards-strip" + (visible ? " visible" : "")} aria-label="Awards and distinctions">
      {awards.map((award, index) => (
        <li key={award.label} style={{ "--award-index": index }}>
          <FontAwesomeIcon icon={award.icon} />
          <span>{award.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Experience() {
  const initial = Math.max(experiences.findIndex((item) => item.current), 0);
  const [activeIndex, setActiveIndex] = useState(initial);
  const [connectorRatio, setConnectorRatio] = useState(null);
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const connectorFrame = useRef(0);
  const [revealRef, visible] = useReveal();

  const updateConnector = useCallback(() => {
    const list = listRef.current;
    const row = rowRefs.current[activeIndex];
    if (!list || !row || !list.clientHeight) return;

    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const rowCenter = rowRect.top + rowRect.height / 2 - listRect.top;
    const nextRatio = Math.min(Math.max(rowCenter / list.clientHeight, 0), 1);
    setConnectorRatio((current) =>
      current !== null && Math.abs(current - nextRatio) < 0.001
        ? current
        : nextRatio,
    );
  }, [activeIndex]);

  const requestConnectorUpdate = useCallback(() => {
    if (connectorFrame.current) return;
    connectorFrame.current = requestAnimationFrame(() => {
      connectorFrame.current = 0;
      updateConnector();
    });
  }, [updateConnector]);

  useEffect(() => {
    requestConnectorUpdate();
    const list = listRef.current;
    if (!list) return undefined;

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(requestConnectorUpdate);
    if (observer) observer.observe(list);
    window.addEventListener("resize", requestConnectorUpdate);
    return () => {
      if (connectorFrame.current) cancelAnimationFrame(connectorFrame.current);
      connectorFrame.current = 0;
      if (observer) observer.disconnect();
      window.removeEventListener("resize", requestConnectorUpdate);
    };
  }, [activeIndex, requestConnectorUpdate]);

  return (
    <section className="experience section-shell" id="experience" aria-labelledby="experience-title">
      <div ref={revealRef} className={"panel experience-panel reveal-section" + (visible ? " visible" : "")}>
        <SectionLabel>Experience</SectionLabel>
        <h2 className="sr-only" id="experience-title">Professional experience</h2>
        <div className="experience-grid">
          <ExperienceMap
            experiences={experiences}
            activeIndex={activeIndex}
            connectorRatio={connectorRatio}
          />
          <div
            className="experience-list"
            aria-label="Professional experience timeline"
            onScroll={requestConnectorUpdate}
            ref={listRef}
            tabIndex="0"
          >
            {experiences.map((item, index) => (
              <article
                className={"experience-row" + (index === activeIndex ? " active" : "") + (item.current ? " current" : "")}
                key={item.id}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
                style={{ "--experience-index": index }}
                tabIndex="0"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                aria-label={item.title + ", " + item.range}
              >
                <span className="hex-icon">{item.code}</span>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
                <time>{item.range}</time>
              </article>
            ))}
          </div>
        </div>
        <AwardsStrip visible={visible} />
      </div>
    </section>
  );
}

function ProjectVisual({ project, playing, playKey }) {
  const source = playing ? project.animation + "?play=" + playKey : project.poster;

  return (
    <div className={"project-visual" + (playing ? " playing" : "")} aria-hidden="true">
      <img key={source} src={source} alt="" />
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const startPlayback = () => {
    if (prefersReducedMotion()) return;
    setPlayKey((key) => key + 1);
    setPlaying(true);
  };

  const stopPlayback = () => setPlaying(false);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) stopPlayback();
  };

  return (
    <article
      className="project-card"
      style={{ "--project-index": index }}
      onPointerEnter={startPlayback}
      onPointerLeave={stopPlayback}
      onClick={startPlayback}
      onFocus={startPlayback}
      onBlur={handleBlur}
    >
      <ProjectVisual project={project} playing={playing} playKey={playKey} />
      <h3>
        <a href={project.href} target="_blank" rel="noreferrer">
          {project.title}
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </a>
      </h3>
      <p>{project.description}</p>
      <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>
  );
}

function Projects() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: false, duration: 28 });
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [revealRef, visible] = useReveal();

  const syncCarousel = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    syncCarousel();
    emblaApi.on("select", syncCarousel);
    emblaApi.on("reInit", syncCarousel);
    return () => {
      emblaApi.off("select", syncCarousel);
      emblaApi.off("reInit", syncCarousel);
    };
  }, [emblaApi, syncCarousel]);

  const handleKeys = (event) => {
    if (!emblaApi) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      emblaApi.scrollPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      emblaApi.scrollNext();
    }
  };

  return (
    <section className="projects section-shell" id="projects" aria-labelledby="projects-title">
      <div ref={revealRef} className={"panel projects-panel reveal-section" + (visible ? " visible" : "")}>
        <div className="section-top">
          <SectionLabel>Technical Projects</SectionLabel>
          <a href="https://github.com/GarrettAudet" target="_blank" rel="noreferrer">View all projects <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <h2 className="sr-only" id="projects-title">Technical projects</h2>
        <div className="carousel-shell">
          <button className="carousel-button prev" type="button" aria-label="Previous projects" disabled={!canPrev} onClick={() => emblaApi && emblaApi.scrollPrev()}><FontAwesomeIcon icon={faChevronLeft} /></button>
          <div className="project-viewport" ref={emblaRef} tabIndex="0" onKeyDown={handleKeys} aria-label="Project carousel">
            <div className="project-track">
              {projects.map((project, index) => (
                <ProjectCard project={project} index={index} key={project.title} />
              ))}
            </div>
          </div>
          <button className="carousel-button next" type="button" aria-label="Next projects" disabled={!canNext} onClick={() => emblaApi && emblaApi.scrollNext()}><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
        <div className="pagination" aria-label="Project pages">
          {Array.from({ length: snapCount }, (_, index) => (
            <button type="button" className={index === selected ? "active" : ""} aria-label={"Show project page " + (index + 1)} aria-current={index === selected ? "true" : undefined} onClick={() => emblaApi && emblaApi.scrollTo(index)} key={index} />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">Project page {selected + 1} of {snapCount}</p>
      </div>
    </section>
  );
}

function PolicySwarmVisual() {
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const startPlayback = () => {
    if (prefersReducedMotion()) return;
    setPlayKey((key) => key + 1);
    setPlaying(true);
  };

  const stopPlayback = () => setPlaying(false);
  const source = playing
    ? "/images/policy-swarm.gif?play=" + playKey
    : "/images/policy-swarm-poster.png";

  return (
    <div
      className={"policy-swarm-frame" + (playing ? " playing" : "")}
      role="img"
      aria-label="A policy signal activating a multi-agent stakeholder network"
      tabIndex="0"
      onPointerEnter={startPlayback}
      onPointerLeave={stopPlayback}
      onClick={startPlayback}
      onFocus={startPlayback}
      onBlur={stopPlayback}
    >
      <img key={source} src={source} alt="" />
      <span className="policy-swarm-play" aria-hidden="true"><FontAwesomeIcon icon={faPlay} /></span>
    </div>
  );
}

function Curiosities() {
  const [revealRef, visible] = useReveal();
  return (
    <section className="curiosities section-shell" id="insights" aria-labelledby="insights-title">
      <div ref={revealRef} className={"panel curiosities-panel reveal-section" + (visible ? " visible" : "")}>
        <SectionLabel>Curiosities / Beyond the Work</SectionLabel>
        <h2 className="sr-only" id="insights-title">Curiosities and current focus</h2>
        <div className="curiosities-grid">
          <ul className="curiosity-list">
            {curiosities.map((item, index) => (
              <li key={item.title} style={{ "--curiosity-index": index }}>
                <span><FontAwesomeIcon icon={item.icon} /></span>
                <div><h3>{item.title}</h3><p>{item.detail}</p></div>
              </li>
            ))}
          </ul>
          <article className="now-card">
            <div className="now-copy"><span>Now</span><h3>What I&apos;m focused on</h3><p>Simulating how public policies ripple through complex systems using multi-agent swarms.</p></div>
            <PolicySwarmVisual />
          </article>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [revealRef, visible] = useReveal("0px");

  return (
    <footer className={"connect-footer section-shell" + (visible ? " visible" : "")} id="contact" ref={revealRef}>
      <div className="panel footer-panel">
        <div className="footer-intro">
          <SectionLabel>Connect with Me</SectionLabel>
          <h2>Let&apos;s build something impactful together.</h2>
          <span className="short-rule" aria-hidden="true" />
          <p>I&apos;m open to mission-driven opportunities at the intersection of data, strategy, and technology.</p>
          <a className="button primary footer-cta" href="mailto:garrett.audet@gmail.com">Get in Touch <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <nav className="contact-list" aria-label="Contact links">
          {socialLinks.map((item, index) => (
            <a href={item.href} key={item.label} style={{ "--social-index": index }}>
              <span className="contact-icon"><FontAwesomeIcon icon={item.icon} /></span>
              <span><small>{item.label}</small><strong>{item.display}</strong></span>
            </a>
          ))}
        </nav>
        <div className="footer-orbit" aria-hidden="true">
          <FooterNetwork />
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Garrett Audet. All rights reserved.</p>
          <nav className="footer-legal" aria-label="Legal links"><a href="#top">Privacy Policy</a><a href="#top">Terms of Use</a></nav>
          <p>Built with data. Driven by curiosity.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="portfolio-app webpage-final">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Curiosities />
      </main>
      <Footer />
    </div>
  );
}
