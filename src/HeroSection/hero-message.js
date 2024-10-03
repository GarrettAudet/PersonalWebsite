import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import './hero-message.css';

const HeroMessage = () => {
  return (
    <a href="https://www.linkedin.com/in/garrettaudet">
      <div className="header-container">
        <h2 className="hero-message-container"> 
          <span className="inline-block appearIn flex">I'm a developer and business professional who believes that </span>
          <span className="inline-block appearIn flex animation-container"><span className="text-decoration"> bridging diverse perspectives </span> unlocks <span className="text-animation">
            <TypeAnimation
              sequence={[
                'economic potential.', 3000,
                'career success.', 3000,
                'individual growth.', 3000
              ]}
              wrapper="span"
              speed={10}
              style={{ fontSize: '1em', display: 'inline-block' }}
              repeat={Infinity}
            />
          </span></span>
        </h2>
      </div>
    </a>
  );
};

export default HeroMessage;
