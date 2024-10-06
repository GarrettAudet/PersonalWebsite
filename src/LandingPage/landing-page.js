import React, { useEffect, useState } from 'react'; 
import './landing-page.css'; 
import Header from './header.js'

const LandingPage = ({ scrollToSection, experienceRef, contactRef }) => {
  // Define the state for particle and line colors
  const [particleColor, setParticleColor] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#ffffff');

  useEffect(() => {
    // Access the CSS variables from the :root element
    const rootStyles = getComputedStyle(document.documentElement);
    const particleColorFromCSS = rootStyles.getPropertyValue('--particle-dot').trim();
    const lineColorFromCSS = rootStyles.getPropertyValue('--particle-line').trim();

    // Set the values of the state variables
    setParticleColor(particleColorFromCSS);
    setLineColor(lineColorFromCSS);

    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 500,
            },
          },
          color: {
            value: particleColor, // Use the color from CSS variable
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000',
            },
            polygon: {
              nb_sides: 10,
            },
            image: {
              src: 'img/github.svg',
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: lineColor, // Use the line color from CSS variable
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse',
            },
            onclick: {
              enable: true,
              mode: 'push',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      });
    }
  }, [particleColor, lineColor]); // Ensure the effect re-runs when colors change

  return (
  <div id="particles-js" className="scroll-section flex">
    <Header />
      <div className = "landing-page-header">
        <h1>GARRETT AUDET</h1>
        <div className = "landing-page-title flex">
          <p>STRATEGY&nbsp;</p>
          <p className = "bold">&&nbsp;</p>
          <p>FULL-STACK ANALYTICS</p>
        </div>
      </div>
  </div>);
};

export default LandingPage;



