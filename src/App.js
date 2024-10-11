import React, { useRef } from 'react';
import './App.css';
import Content from './Content/Content';  // Import Content
import Cursor from './Cursor/Cursor';
import LandingPage from './LandingPage/landing-page';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Router and Routes

function App() {
  const experienceRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Router>
      <div className="scrolling-container particles-js data-simplebar">
        <Routes>
          <Route
            path="/"
            element={<LandingPage scrollToSection={scrollToSection} experienceRef={experienceRef} contactRef={contactRef} />}
          />
          <Route path="/content" element={<Content />} />  
        </Routes>
        <Cursor />
      </div>
    </Router>
  );
}

export default App;
