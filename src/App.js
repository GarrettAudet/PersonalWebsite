import React, { useRef } from 'react';
import './App.css';
import Header from './Header/Header'
import Content from './Content/Content'
import Cursor from './Cursor/Cursor'
import LandingPage from './LandingPage/landing-page'

function App() {
  const experienceRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (sectionRef) => {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="scrolling-container">
      <LandingPage/>
      <Header scrollToSection={scrollToSection} experienceRef={experienceRef} contactRef={contactRef}/>
      <Content experienceRef={experienceRef} contactRef={contactRef}/>
      <Cursor />
    </div>
  );
}

export default App;
