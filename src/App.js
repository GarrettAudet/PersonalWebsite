import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import ExperiencePage from './Experience/experience';
import LandingPage from './LandingPage/landing-page';
import Header from './General/header';

function App() {
  const experienceRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const location = useLocation(); // Hook to get current route location

  useEffect(() => {
    // Reinitialize or trigger cursor behavior on route change
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a');

    // Check if cursor and links exist
    if (cursor && links) {
      const addExpand = () => cursor.classList.add('expand');
      const removeExpand = () => cursor.classList.remove('expand');

      // Remove existing listeners before adding new ones
      links.forEach(link => {
        link.removeEventListener('mouseenter', addExpand);
        link.removeEventListener('mouseleave', removeExpand);
        link.addEventListener('mouseenter', addExpand);
        link.addEventListener('mouseleave', removeExpand);
      });

      // Clean up to avoid memory leaks
      return () => {
        links.forEach(link => {
          link.removeEventListener('mouseenter', addExpand);
          link.removeEventListener('mouseleave', removeExpand);
        });
      };
    }
  }, [location]); // Re-run effect on route change

  return (
    <div className="scrolling-container particles-js data-simplebar">
      <Header scrollToSection={scrollToSection} experienceRef={experienceRef} contactRef={contactRef} />
      <Routes>
        <Route
          path="/"
          element={<LandingPage scrollToSection={scrollToSection} experienceRef={experienceRef} contactRef={contactRef} />}
        />
        <Route path="/content" element={<ExperiencePage />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
