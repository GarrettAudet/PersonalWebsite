import React from 'react'; 
import { useSpring, animated } from 'react-spring';
import chevronDown from '../Img/chevronDown.svg';
import './landing-scroll.css'

const LandingScroll = () => {

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

  return (
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
  );
};

export default LandingScroll;