import React, { useEffect, useState } from 'react'; 
import { useSpring, animated } from 'react-spring';
import './landing-page.css'; 
import Header from './header.js';
import PersonalLink from './personal-link.js';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import chevronDown from '../Img/chevronDown.svg';

const LandingPage = ({ scrollToSection, experienceRef, contactRef }) => {
  const [particleColor, setParticleColor] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#ffffff');

  const chevronAnimation = useSpring({
    to: { transform: 'translateY(-5px)' },
    from: { transform: 'translateY(0px)' },
    config: { 
      mass: 1, 
      tension: 200, // Increase tension for a snappier animation
      friction: 10, // Adjust friction for bounce
      duration: 400, // Duration in milliseconds
    },
    loop: { reverse: true },
  });

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const particleColorFromCSS = rootStyles.getPropertyValue('--particle-dot').trim();
    const lineColorFromCSS = rootStyles.getPropertyValue('--particle-line').trim();

    setParticleColor(particleColorFromCSS);
    setLineColor(lineColorFromCSS);

    const particlesJSConfig = {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 500,
          },
        },
        color: {
          value: particleColor,
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000',
          },
        },
        opacity: {
          value: 0.5,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: lineColor,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          out_mode: 'out',
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
        },
      },
      retina_detect: true,
    };

    if (window.particlesJS) {
      window.particlesJS('particles-js', particlesJSConfig);
    }
  }, [particleColor, lineColor]);

  return (
    <div id="particles-js" className="scroll-section flex">
      <Header />
      <div className="landing-page-header">
        <h1>GARRETT AUDET</h1>
        <div className="landing-page-title flex">
          <p>STRATEGY&nbsp;</p>
          <p className="bold">&&nbsp;</p>
          <p>FULL-STACK ANALYTICS</p>
        </div>
      </div>
      <div className="landing-page-link-container">
        <PersonalLink backgroundColor="rgb(36, 41, 46, 0.1)" divIcon={faGithub} link="https://github.com/GarrettAudet" />
        <PersonalLink backgroundColor="rgb(10, 102, 194, 0.1)" divIcon={faLinkedin} link="https://www.linkedin.com/in/garrettaudet/" />
        <PersonalLink backgroundColor="rgb(234, 67, 53, 0.1)" divIcon={faEnvelope} link="mailto:garrett.audet@gmail.com" />
      </div>
      <animated.div className="scroll-container" style={chevronAnimation}> 
        <p>Scroll</p>
        <div className="chevron-container flex">
          <img
            src={chevronDown}
            className="chevron-icon"
            alt="chevron down"
          />
        </div>
      </animated.div>
    </div>
  );
};

export default LandingPage;





